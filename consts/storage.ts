import { storageKey } from '../utils/storage'

export const STORAGE_KEYS = {
    FS: storageKey('fs'),
    CURRENT_PATH: storageKey('currentPath'),
    LAST_KNOWN_FILE: storageKey('lastKnownFile'),
    LAST_KNOWN_FILE_CONTENT: storageKey('lastKnownFileContent'),
    TABS: storageKey('tabs'),
    BOOTSTRAPPED: storageKey('bootstrapped')
}

export const LOCAL_STORAGE_CAP = 1024 * 1024 // 1MB
