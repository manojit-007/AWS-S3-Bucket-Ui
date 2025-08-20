// utils/handleApiRequest.js
import Cookies from "js-cookie";
import apiClient from "./index"; // Adjust the import path as necessary

export const handleApiRequest = async (method, url, body = {}, config = {}) => {
  try {
    // Try to get token (cookies will still be sent automatically with withCredentials)
    let token = Cookies.get("token") || localStorage.getItem("token");

    const requestConfig = {
      withCredentials: true,
      ...config,
    };

    if (token) {
      requestConfig.headers = {
        ...(requestConfig.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    // Pick correct axios method
    let response;
    if (method === "get") {
      response = await apiClient.get(url, requestConfig);
    } else {
      response = await apiClient[method](url, body, requestConfig);
    }

    // Normalize response
    return {
      success: response.data?.success ?? true,
      message: response.data?.message ?? "Request successful",
      data: response.data?.data ?? response.data,
    };
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Something went wrong",
        data: {},
      }
    );
  }
};
// utils/createThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createThunk = (type, asyncFn) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      return await asyncFn(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  });
