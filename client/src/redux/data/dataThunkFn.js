// redux/s3/s3ThunkFn.js
import { handleApiRequest } from "@/api/req";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Get all bucket content
export const getAllS3BucketContent = createAsyncThunk("s3Bucket/getContent", () =>
  handleApiRequest("get", "/api/v1/user/getS3BucketContent")
);

// Get URL to upload
export const getUrlToUpload = createAsyncThunk("s3Bucket/getUrlToUpload", (files) =>
  handleApiRequest("post", "/api/v1/user/getUrlToUpload", { files })
);

// Download file (special because we need to fetch S3 blob)
export const downloadFileThunkFn = createAsyncThunk("s3Bucket/downloadFile", async (key) => {
  // 1️⃣ Get signed URL
  const { data } = await handleApiRequest("get", `/api/v1/user/download?key=${encodeURIComponent(key)}`);
  const { url } = data;
  if (!url) throw new Error("No signed URL returned");

  // 2️⃣ Fetch file
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch file from S3");
  const blob = await response.blob();

  // 3️⃣ Trigger download
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = key.split("/").pop();
  document.body.appendChild(link);
  link.click();

  // 4️⃣ Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);

  return { success: true, key };
});

// Delete single object
export const deleteS3Object = createAsyncThunk("s3Bucket/deleteObject", (key) =>
  handleApiRequest("delete", "/api/v1/user/delete", { key })
);

// Delete all objects with prefix
export const deleteS3FolderObject = createAsyncThunk("s3Bucket/deleteFolder", (prefix) =>
  handleApiRequest("delete", "/api/v1/user/deleteAllPrefix", { prefix })
);
