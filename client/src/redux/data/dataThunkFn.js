// http://localhost:8000/api/v1/user/getS3BucketContent

import apiClient from "@/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

//   Sign Up
export const getAllS3BucketContent = createAsyncThunk(
  "user/s3BucketContent",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/v1/user/getS3BucketContent", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

//   Get URL to Upload
export const getUrlToUpload = createAsyncThunk(
  "user/getUrlToUpload",
  async (files, { rejectWithValue }) => {
      //console.log("Thunk fn runned");
    try {
      const response = await apiClient.post("/api/v1/user/getUrlToUpload", {
        files, // expecting: [{ fileName, contentType }]
      });
      return response.data; // or response.data depending on your API format
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

//   Get URL to Downloadload
export const downloadFileThunkFn = createAsyncThunk(
  "files/downloadFile",
  async (key, { rejectWithValue }) => {
    try {
      // 1️⃣ Get signed URL from backend
      const res = await apiClient.get(
        `/api/v1/user/download?key=${encodeURIComponent(key)}`
      );
      const { url } = res.data.data;
      if (!url) throw new Error("No signed URL returned");

      // 2️⃣ Fetch file from S3
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file from S3");
      const blob = await response.blob();

      // 3️⃣ Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = key.split("/").pop();
      document.body.appendChild(link);
      link.click();

      // 4️⃣ Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true, key }; // return useful data for reducer
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

//   Delete S3 Object
// redux/data/dataThunkFn.js

export const deleteS3Object = createAsyncThunk(
  "s3Bucket/deleteS3Object",
  async (key) => {
    const response = await apiClient.delete(`/api/v1/user/delete`, { data: { key } });
    return response.data;
  }
);
// redux/data/dataThunkFn.js

export const deleteS3FolderObject = createAsyncThunk(
  "s3Bucket/deleteS3Object",
  async (prefix) => {
    const response = await apiClient.delete(`/api/v1/user/deleteAllPrefix`, { data: { prefix } });
    return response.data;
  }
);
