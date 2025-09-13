import { ReactiveMap } from "@solid-primitives/map";
import { dir as fsDir, file as fsFile, write as fsWrite } from "opfs-tools";
import { OPFS } from "../service/OPFS.service";
import { worker } from "../stores/editorStore";
import { FSNode, File, Folder, isFolder } from "../types/FS.types";
import { ACTIONS, measure } from "../stores/measureStore";

export function useOPFS() {
  const saveFile = (file: File, content: string) =>
    measure(ACTIONS.SAVE_FILE, { ...file, size: content.length, source: "OPFS" }, () => OPFS.saveFile(file, content));

  const getFile = (file: File) => measure(ACTIONS.GET_FILE, { ...file, source: "OPFS" }, () => OPFS.getFile(file));

  const move = (node: FSNode, oldPath: string) =>
    measure(ACTIONS.MOVE, { ...node, oldPath, source: "OPFS" }, async () => OPFS.move(node, oldPath));

  const remove = (node: FSNode) => measure(ACTIONS.REMOVE, { ...node, source: "OPFS" }, () => OPFS.remove(node));

  const tree = (node: Folder) => measure(ACTIONS.TREE, { ...node, source: "OPFS" }, () => OPFS.tree(node));

  const write: typeof fsWrite = (...params) =>
    measure(ACTIONS.WRITE, { source: "OPFS", params }, () => fsWrite(...params));

  const getFileInChunks = (file: File, size?: number) =>
    measure(ACTIONS.READ_CHUNK, { ...file, size, source: "OPFS" }, () => OPFS.getFileInChunks(file, size));

  const mapFiles = (root: Folder) => measure(ACTIONS.MAP_FILES, { ...root, source: "OPFS" }, OPFS.mapFiles, root);

  const getOpfsNode = async (node: FSNode) => (isFolder(node) ? fsDir(node.path) : fsFile(node.path));

  const createFile = (path: string, content: string) =>
    measure(ACTIONS.CREATE_FILE, { path, size: content.length, source: "OPFS" }, async () => {
      const file = await fsFile(path).createWriter();
      await file.write(content);
      await file.close();
      return file;
    });
  const createFolder = (path: string) =>
    measure(ACTIONS.CREATE_FOLDER, { path, source: "OPFS" }, async () => {
      const folder = await fsDir(path).create();
      return folder;
    });

  const create = async (node: FSNode) => {
    if (isFolder(node)) {
      createFolder(node.path);
      node.children.forEach(create);
    } else {
      return createFile(node.path, "");
    }
  };
  return {
    saveFile,
    getFile,
    move,
    remove,
    tree,
    write,
    getFileInChunks,
    getOpfsNode,
    mapFiles,
    create,
  };
}
