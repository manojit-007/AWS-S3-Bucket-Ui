import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllS3BucketContent,
  deleteS3Object,
  deleteS3FolderObject,
  downloadFileThunkFn,
} from "@/redux/data/dataThunkFn";
import { buildFileTree } from "@/utils/formatter";
import FileNode from "./FileNode";
import UploaderForm from "./UploaderForm";
import DeleteConfirmDialog from "@/components/ui/deleteConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { File, Files, FilesIcon, Folder, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleThunkResponse } from "@/utils/ShowMessage";
import { handleApiRequest } from "@/api/req";

const FileExplorer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { s3BucketContent, fetchedData } = useSelector(
    (state) => state.s3Bucket
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isFolder, setIsFolder] = useState(false);

  useEffect(() => {
    if (user === null) {
      toast.error("You must be logged in to access the file explorer.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && !user?.isVerified) {
      toast.error("Please verify your email before continue.");
      navigate("/profile");
      return;
    }
    if (user && !user?.hasCredentials) {
      toast.error(
        "Please set up your AWS credentials in your profile to access S3."
      );
      navigate("/profile");
      return;
    }
    // if (user && user?.hasCredentials && !fetchedData) {
    //   dispatch(getAllS3BucketContent());

    // }
  }, [dispatch, fetchedData, navigate, user]);

  const s3DataTree = useMemo(
    () => buildFileTree(s3BucketContent || []),
    [s3BucketContent]
  );
  const topLevelFolders = useMemo(
    () => s3DataTree.filter((item) => item.type === "folder"),
    [s3DataTree]
  );

  const topLevelFiles = useMemo(
    () => s3DataTree.filter((item) => item.type === "file"),
    [s3DataTree]
  );

  const handleDeleteFn = (fileKey) => {
    setIsFolder(false); // 👈 it's a file
    setFileToDelete(fileKey);
    setConfirmOpen(true);
  };

  const handleDeleteFolderFn = (folderKey) => {
    setIsFolder(true); // 👈 it's a folder
    setFileToDelete(folderKey);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      if (isFolder) {
        await handleThunkResponse(
          dispatch,
          deleteS3FolderObject,
          fileToDelete,
          {
            successMessage: "📁 Folder deleted successfully",
            errorMessage: "   Failed to delete folder",
          }
        );
      } else {
        await handleThunkResponse(dispatch, deleteS3Object, fileToDelete, {
          successMessage: "🗎 File deleted successfully",
          errorMessage: "   Failed to delete file",
        });
      }

      dispatch(getAllS3BucketContent());
    } finally {
      setFileToDelete(null);
      setIsFolder(false);
      setConfirmOpen(false);
    }
  };

  const handleFileDownload = (key) => {
    dispatch(downloadFileThunkFn(key))
      .unwrap()
      .then(() => toast.success("  File downloaded successfully"))
      .catch((err) => toast.error(`   ${err.message || "Download failed"}`));
  };

  const handleView = async (key) => {
    try {
      const { data } = await handleApiRequest(
        "get",
        `/api/v1/user/download?key=${encodeURIComponent(key)}`
      );
  
      const { url } = data;
      if (!url) throw new Error("No signed URL returned");
  
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err.message || "Failed to view file");
    }
  };
  

  return (
    <main className="min-h-screen dark:bg-zinc-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-800 p-6 mt-2 ">
        <section className="flex items-center justify-between mb-4">
          <h1 className="flex items-center  justify-center gap-2 font-semibold text-gray-800 dark:text-white text-lg sm:text-xl md:text-2xl">
            <img
              src="./disk.svg"
              alt="AWS S3 Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            />
            AWS S3 UI
          </h1>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/profile")}
              title="Go to Profile"
              className="bg-transparent rounded-none btn-shadow hover:text-red-500"
            >
              <User className="w-4 h-4 text-black" />
            </Button>
            <UploaderForm title="Upload anything" data={s3DataTree} />
          </div>
        </section>
        {s3DataTree.length != 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Click on file name to view
          </p>
        )}
        <section className="min-h-[75vh]">
          <h1 className="text-lg font-semibold flex justify-center gap-2 items-center text-gray-800 dark:text-white mb-4">
            {" "}
            <Folder className="w-4 h-4" />
            Folders{" "}
          </h1>
          {topLevelFolders.length === 0 ? (
            <p className="text-gray-700 text-center dark:text-gray-400">
              No Folders Found.
            </p>
          ) : (
            topLevelFolders.map((node) => (
              <FileNode
                key={node.name}
                type="Folder"
                node={node}
                handleView={handleView}
                handleDelete={handleDeleteFn}
                handleFolderDelete={handleDeleteFolderFn}
                handleFileDownload={handleFileDownload}
              />
            ))
          )}
          <h1 className="text-lg font-semibold flex items-center justify-center gap-2 text-gray-800 dark:text-white mb-4 mt-4">
            {" "}
            <File className="w-4 h-4" /> Files{" "}
          </h1>

          {topLevelFiles.length === 0 ? (
            <p className="text-gray-700 text-center dark:text-gray-400">
              No Files Found.
            </p>
          ) : (
            topLevelFiles.map((node) => (
              <FileNode
                key={node.name}
                node={node}
                type="File"
                handleView={handleView}
                handleDelete={handleDeleteFn}
                handleFolderDelete={handleDeleteFolderFn}
                handleFileDownload={handleFileDownload}
              />
            ))
          )}
        </section>
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={setConfirmOpen}
        fileKey={fileToDelete}
        onConfirm={confirmDelete}
      />
    </main>
  );
};

export default FileExplorer;
