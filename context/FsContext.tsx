import { WindowEventListener } from "@solid-primitives/event-listener";
import { ReactiveMap } from "@solid-primitives/map";
import { makePersisted } from "@solid-primitives/storage";
import {
  Accessor,
  batch,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { SYSTEM_PATHS } from "../consts/app";
import { EMPTY_NODE_NAME } from "../consts/FS";
import { LOCAL_STORAGE_CAP, STORAGE_KEYS } from "../consts/storage";
import { useAppState } from "../context/AppStateContext";
import { useCurrentFile } from "../hooks/useCurrentFile";
import { useOPFS } from "../hooks/useOPFS";
import { folderHas, getFolder, getNode, getParent, sortTreeInDraft } from "../service/FS.service";
import { setBaseline } from "../stores/dirtyStore";
import { editorMounted, setStart, start } from "../stores/editorStore";
import { File, Folder, FSNode, isFolder } from "../types/FS.types";
import { cappedSetItem } from "../utils/storage";

export interface FSContext {
  fs: Folder;
  setFs: Setter<Folder>;
  currentPath: Accessor<string>;
  currentNode: Accessor<FSNode>;
  setCurrentNode: (node: FSNode) => void;
  currentFolder: Accessor<Folder>;
  setCurrentFolder: (folder: Folder) => void;
  currentFile: Accessor<File | null>;
  beginRename: (node: FSNode) => void;
  cancelRename: () => void;
  editingPath: Accessor<string | null>;
  addNode: (config: {
    name: string;
    parent?: Folder;
    children?: FSNode[];
    onlyInMemory?: boolean;
    skipSort?: boolean;
  }) => void | FSNode;
  updateNodeName: (node: FSNode, name: string) => void;
  removeNode: (node?: FSNode, onlyInMemory?: boolean) => void;
  closeTab: (path: string) => void;
  setIsOpen: (node: Folder, isOpen: boolean) => void;
  moveNode: (currentPath: string, newPath: string) => void;
  currentFileSize: Accessor<number>;
  openFiles: Map<string, string>;
  setLastKnownFile: (file: File | null) => void;
  tabs: Accessor<string[]>;
}

const FSContext = createContext<FSContext>();

// computed inside provider using useAppState()

// isEmptyNode is computed within FSProvider where rootName is available
export const FSProvider: ParentComponent<{ initialTree?: Folder }> = (props) => {
  const { rootName, setIsFsLoading, hasPaintedBus } = useAppState();
  const EMPTY_ROOT = {
    name: rootName(),
    path: "",
    children: [],
    isOpen: true,
  };
  const isEmptyNode = (node: FSNode) => {
    let nodeCopy = {
      ...node,
      children: [...((node as Folder)?.children ?? [])],
    };

    if (isFolder(nodeCopy) && nodeCopy.name === rootName()) {
      nodeCopy.children = nodeCopy.children.filter((child) => !SYSTEM_PATHS.includes(child.path));
    } else return false;

    const rootPaths = ["", "/"];
    return nodeCopy.isOpen && nodeCopy.children.length === 0 && rootPaths.includes(nodeCopy.path);
  };
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.FS) ?? "null") as Folder | null;

  const [fs, setFs] = makePersisted(createStore<Folder>(savedData ?? props.initialTree ?? EMPTY_ROOT), {
    name: STORAGE_KEYS.FS,
  });
  const OPFS = useOPFS();
  createEffect(
    on(
      editorMounted,
      async (mounted) => {
        if (!mounted) return;
        try {
          // OPFS is the source of truth
          let tree = await new Promise<Folder>((resolve) => {
            hasPaintedBus.listen(async (p) => {
              if (!p) return;
              const t = await OPFS.tree(fs);
              resolve(t);
            });
          });
          if (!isEmptyNode(tree)) {
            tree.name = rootName();
            setFs(sortTreeInDraft(tree));
            return;
          }
          tree.name = rootName();
          setFs(sortTreeInDraft(tree));
        } catch (e) {
          console.error(e);
        } finally {
          console.info(`OPFS sync took ${(performance.now() - start()).toFixed(2)} ms`);
          queueMicrotask(() => setStart(0));
          setIsFsLoading(false);
        }
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      editorMounted,
      async (mounted) => {
        if (!mounted) return;

        let tabsFromStorage = localStorage.getItem(STORAGE_KEYS.TABS);
        if (tabsFromStorage) {
          tabsFromStorage = JSON.parse(tabsFromStorage);
          if (Array.isArray(tabsFromStorage)) {
            const results = await Promise.all(
              tabsFromStorage.filter(Boolean).map(async (path: string) => {
                const file = getNode(fs, path);
                if (!file) return;
                const content = await OPFS.getFile(file);
                return { path: file.path, content: content ?? "" };
              }),
            );

            results
              .filter((p): p is { path: string; content: string } => !!p)
              .forEach(({ path, content }) => {
                openFiles.set(path, content);
                console.log("setting baseline for", path, content);
                setBaseline(path, content);
              });
          }
        }

        console.info(`tab sync took ${(performance.now() - start()).toFixed(2)} ms`);
      },
      { defer: true },
    ),
  );

  const openFiles = new ReactiveMap<string, string>();
  const tabs = createMemo(() => [...openFiles.keys()]);
  createEffect(
    on(
      tabs,
      (tabs) => {
        localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
      },
      { defer: true },
    ),
  );
  const [currentPath, setCurrentPath] = makePersisted(createSignal("/"), {
    name: STORAGE_KEYS.CURRENT_PATH,
  });
  const [currentNode, _setCurrentNode] = createSignal(getNode(fs, currentPath()) ?? fs);
  const setCurrentNode = (node: FSNode) => {
    //TODO is better cleaner to just effect??
    batch(() => {
      _setCurrentNode(node);
      setCurrentPath(node.path);
    });
  };
  const [currentFolder, setCurrentFolder] = createSignal(getFolder(fs, currentPath()) ?? fs);

  // Global rename state: which node path is being edited
  const [editingPath, setEditingPath] = createSignal<string | null>(null);
  const beginRename = (node: FSNode) => setEditingPath(node.path);
  const cancelRename = () => setEditingPath(null);
  const [lastKnownFile, setLastKnownFile] = makePersisted(createSignal<File | null>(null), {
    name: STORAGE_KEYS.LAST_KNOWN_FILE,
  });
  const file = lastKnownFile();
  if (file) {
    const content = localStorage.getItem(STORAGE_KEYS.LAST_KNOWN_FILE_CONTENT);
    if (content) openFiles.set(file.path, content);
  }
  const currentFile = createMemo(() => {
    if (currentNode() === fs) {
      return null;
    }
    return !isFolder(currentNode()) ? currentNode() : lastKnownFile();
  });
  const [currentFileSize, setCurrentFileSize] = createSignal(0);

  const { currentFileContent } = useCurrentFile(currentFile, openFiles);
  const loadCurrentFile = async (file: File | null) => {
    if (!file || !file.path) return;
    setLastKnownFile(file);
    if (openFiles.has(file.path)) {
    } else {
      const opfsNode = await OPFS.getOpfsNode(file);
      if (opfsNode.kind === "file") {
        const size = await opfsNode.getSize();
        setCurrentFileSize(size);
        if (size <= LOCAL_STORAGE_CAP) {
          const content = await opfsNode.text();
          openFiles.set(file.path, content);
          setBaseline(file.path, content);
          return;
        }
      }
      const chunk = await OPFS.getFileInChunks(file, LOCAL_STORAGE_CAP);
      if (!chunk) return;
      try {
        const { value, done } = await chunk.next();
        if (done) return;
        openFiles.set(file.path, value);
        setBaseline(file.path, value);
      } finally {
        // Explicitly close the stream to avoid OPFS locks
        try {
          await chunk.return(undefined);
        } catch {}
      }
    }
  };
  createEffect(on(currentFile, loadCurrentFile, { defer: true }));

  const addNode: FSContext["addNode"] = ({
    name,
    parent = currentFolder(),
    children,
    onlyInMemory = false,
    skipSort = false,
  }) => {
    if (!parent) return;
    if (parent.name === EMPTY_NODE_NAME) return;
    const isDir = Array.isArray(children);
    const segments = name.split("/").filter((segment) => segment !== "");
    let parentPath = parent.path;
    if (parentPath === "/") parentPath = "";

    const newPath = parentPath === "" ? "/" + segments.join("/") : `${parentPath}/${segments.join("/")}`;
    if (folderHas(name, parent)) {
      console.error(`A ${isDir ? "folder" : "file"} with the name "${name}" already exists in "${parent.name}".`);
      return;
    }

    setFs(
      produce((draft: Folder) => {
        const target = getNode(draft, parent.path);
        if (!target || !isFolder(target)) return;
        let current: FSNode = target;
        let currentPath = target.path;
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];
          currentPath = currentPath === "" ? "/" + segment : `${currentPath}/${segment}`;
          const existing = getNode(draft, currentPath);
          if (!existing) {
            if (i === segments.length - 1) {
              if (isDir) {
                const newFolder: Folder = {
                  name: segment,
                  path: currentPath,
                  children,
                  isOpen: true,
                };
                (current as Folder).children.push(newFolder);
                current = newFolder;
              } else {
                const newFile: File = { name: segment, path: currentPath };
                (current as Folder).children.push(newFile);
                current = newFile;
              }
            } else {
              const newFolder: Folder = {
                name: segment,
                path: currentPath,
                children: [] as FSNode[],
                isOpen: true,
              };
              (current as Folder).children.push(newFolder);
              current = newFolder;
            }
          } else {
            if (!isFolder(existing) && i < segments.length - 1) return;
            current = existing;
          }
        }
        const parentNode = getParent(current, draft) ?? draft;
        if (!skipSort) sortTreeInDraft(parentNode);
      }),
    );
    const newNode = getNode(fs, newPath.startsWith("/") ? newPath.slice(1) : newPath)!;
    // node we just created has to exist
    if (!newNode) console.error("Failed to add node.", newPath);
    // For placeholder nodes, do not change current selection; finalize on rename
    if (newNode.name !== EMPTY_NODE_NAME) {
      batch(() => {
        if (isDir) {
          setCurrentFolder(newNode as Folder);
          setCurrentNode(newNode);
          setIsOpen(newNode as Folder, true);
        } else {
          setCurrentNode(newNode);
          setIsOpen(parent, true);
        }
      });
    }
    // Do not touch OPFS for placeholder nodes; finalize on rename
    const shouldOnlyInMemory = onlyInMemory || name === EMPTY_NODE_NAME;
    if (!shouldOnlyInMemory) {
      OPFS.create(newNode).catch(() => removeNode(newNode, true));
    }

    return newNode;
  };

  // Centralized tab close logic used by EditorTabs and removeNode
  const closeTab: FSContext["closeTab"] = (path) => {
    const list = tabs();
    const idx = list.indexOf(path);
    batch(() => {
      if (currentNode().path === path) {
        if (list.length === 1) {
          setCurrentNode(fs);
        } else if (idx > 0) {
          const prevPath = list[idx - 1];
          const node = getNode(fs, prevPath) ?? fs;
          setCurrentNode(node);
        } else {
          const nextPath = list[1];
          const node = getNode(fs, nextPath) ?? fs;
          setCurrentNode(node);
        }
      }
      openFiles.delete(path);
    });
  };
  const removeNode: FSContext["removeNode"] = (node: FSNode = currentNode(), onlyInMemory = false) => {
    // Never attempt OPFS removal for placeholders
    if ((node?.name ?? "") === EMPTY_NODE_NAME) {
      onlyInMemory = true;
    }
    const parent = getParent(node, fs);
    if (!parent) return;
    setFs(
      produce((draft: Folder) => {
        const targetParent = getNode(draft, parent.path);
        if (!targetParent || !isFolder(targetParent)) return;
        const index = targetParent.children.findIndex((child) => child.path === node.path);
        if (index === -1) return;
        targetParent.children.splice(index, 1);
      }),
    );
    const deleteFromMap = (node: FSNode) => {
      if (isFolder(node)) {
        node.children.forEach((child) => deleteFromMap(child));
      } else {
        if (openFiles.has(node.path)) closeTab(node.path);
      }
    };
    deleteFromMap(node);

    if (onlyInMemory) return;
    OPFS.remove(node).catch(() => {
      addNode({
        name: node.name,
        parent: parent,
        children: isFolder(node) ? node.children : undefined,
        onlyInMemory: true,
      });
    });
  };
  const updateNodeName: FSContext["updateNodeName"] = (node, name) => {
    const oldPath = node.path;
    const oldName = node.name;
    const wasTemp = oldName === EMPTY_NODE_NAME;
    // If request is to set a real node into placeholder, treat as a UI no-op
    if (!wasTemp && name === EMPTY_NODE_NAME) {
      return;
    }

    // Prevent duplicates within the same parent
    const parent = getParent(node, fs) ?? fs;
    const siblingExists = parent.children.some((c) => c.name === name && c.path !== node.path);
    if (siblingExists) {
      console.error(`A node named "${name}" already exists in "${parent.name}".`);
      return;
    }

    // Update in-memory tree in place (and descendants for folders)
    setFs(
      produce((draft) => {
        const target = getNode(draft, oldPath);
        if (!target) return;
        const newPath = target.path.replace(oldName, name);
        if (isFolder(target)) {
          // update descendants paths if folder
          const updateDescendantPaths = (folder: Folder, oldPrefix: string, newPrefix: string) => {
            folder.children.forEach((child) => {
              if (child.path.startsWith(oldPrefix)) {
                if (isFolder(child)) {
                  updateDescendantPaths(child, oldPrefix, newPrefix);
                }
                const c = getNode(draft, child.path);
                if (c) c.path = child.path.replace(oldPrefix, newPrefix);
              }
            });
          };
          updateDescendantPaths(target as Folder, target.path, newPath);
        }
        target.path = newPath;
        target.name = name;
        if (oldPath === currentPath()) setCurrentPath(newPath);
      }),
    );

    // Maintain open files map for non-folder nodes (non-temp renames too)
    if (!isFolder(node) && openFiles.has(oldPath)) {
      const content = openFiles.get(oldPath);
      openFiles.delete(oldPath);
      openFiles.set(oldPath.replace(oldName, name), content ?? "");
    }

    // Finalize OPFS side
    if (wasTemp) {
      // Create only now at the finalized path
      const created = getNode(fs, oldPath.replace(oldName, name));
      if (created) {
        // Now that the node is truly created, set it as current
        batch(() => {
          setCurrentNode(created);
          if (isFolder(created)) {
            setCurrentFolder(created);
            setIsOpen(created, true);
          } else {
            const parent = getParent(created, fs) ?? fs;
            setIsOpen(parent, true);
          }
        });
        OPFS.create(created).catch(() => {
          // If OPFS create fails, revert in-memory node
          setFs(
            produce((draft) => {
              const t = getNode(draft, created.path);
              if (!t) return;
              t.name = oldName;
              t.path = oldPath;
            }),
          );
        });
      }
      return;
    }

    // Real rename → move in OPFS
    const updated = getNode(fs, oldPath.replace(oldName, name)) ?? node;
    OPFS.move(updated, oldPath).catch(() => {
      // Attempt to revert on failure
      setFs(
        produce((draft) => {
          const t = getNode(draft, updated.path);
          if (!t) return;
          t.name = oldName;
          t.path = oldPath;
        }),
      );
      if (!isFolder(node) && openFiles.has(updated.path)) {
        const content = openFiles.get(updated.path);
        openFiles.delete(updated.path);
        openFiles.set(oldPath, content ?? "");
      }
    });
  };
  const moveNode = (currentPath: string, targetPath: string) => {
    const old = getNode(fs, currentPath);
    if (!old) return;

    let content: string | undefined;
    if (!isFolder(old)) {
      content = openFiles.get(old.path);
    }

    batch(() => {
      removeNode(old);
      const node = addNode({
        name: old.name,
        parent: getFolder(fs, targetPath) ?? fs,
        children: isFolder(old) ? old.children : undefined,
      });
      if (content && node) {
        openFiles.set(node.path, content);
      }
    });
  };

  function setIsOpen(node: Folder, isOpen: boolean) {
    setFs(
      produce((draft) => {
        const target = getNode(draft, node.path);
        if (target && isFolder(target)) {
          target.isOpen = isOpen;
        }
      }),
    );
  }

  const context: FSContext = {
    fs,
    setFs,
    currentPath,
    currentNode,
    setCurrentNode,
    currentFolder,
    setCurrentFolder,
    currentFile,
    beginRename,
    cancelRename,
    editingPath,
    addNode,
    closeTab,
    updateNodeName,
    removeNode,
    setIsOpen,
    moveNode,
    currentFileSize,
    openFiles,
    setLastKnownFile,
    tabs,
  };

  return (
    <FSContext.Provider value={context}>
      <WindowEventListener
        onUnload={() => {
          cappedSetItem(STORAGE_KEYS.LAST_KNOWN_FILE_CONTENT, currentFileContent());
        }}
      />

      {props.children}
    </FSContext.Provider>
  );
};

export function useFS() {
  const context = useContext(FSContext);
  if (!context) throw new Error("useFS must be used within a FSProvider");
  return context;
}
