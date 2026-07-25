import { useEffect, useState } from "react";
import {
  buildFolder,
  buildRenamedFolder,
  getFolders,
  storeFolders,
} from "../utill/folder";

const { migrateFolderCollection } = require("../utill/folderModel");

export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getFolders()
      .then((loadedFolders) => {
        if (isMounted) setFolders(loadedFolders);
      })
      .catch((error) => {
        if (isMounted) setStorageError(error);
      })
      .finally(() => {
        if (isMounted) setIsInit(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isInit) return;
    storeFolders(folders).then((success) => {
      if (!success) setStorageError(new Error("Failed to store folders"));
    });
  }, [folders, isInit]);

  const addFolder = (name) => {
    const folder = buildFolder({ name });
    setFolders((current) => [...current, folder]);
    return folder;
  };

  const updateFolder = (id, name) => {
    setFolders((current) =>
      current.map((folder) =>
        folder.id === id ? buildRenamedFolder(folder, name) : folder
      )
    );
  };

  const deleteFolder = (id) => {
    setFolders((current) => current.filter((folder) => folder.id !== id));
  };

  const replaceFolders = (nextFolders) => {
    setFolders(migrateFolderCollection(nextFolders));
  };

  return {
    folders,
    isInit,
    storageError,
    addFolder,
    updateFolder,
    deleteFolder,
    replaceFolders,
  };
}
