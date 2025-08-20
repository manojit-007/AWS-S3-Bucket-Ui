import apiClient from "@/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

//   Sign Up
export const signUpThunkFn = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/signUp", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

//   Log In
export const logInThunkFn = createAsyncThunk(
  "auth/logIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/login", userData);
      return response.data;
    } catch (error) {
        //console.log(error);

      return rejectWithValue(
        error.response?.data || { message: error.message } 
      );
    }
  }
);

//   Log Out
export const logOutThunkFn = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/logOut");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

//   Forget Password
export const forgetPasswordThunkFn = createAsyncThunk(
  "auth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/forgetPassword", {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Something went wrong. Please try again."
      );
    }
  }
);

//   Reset Password
export const resetPasswordThunkFn = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/api/v1/user/reset-password", {
        resetToken,
        newPassword,
      });
      return data; // { success, message, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Reset password failed" }
      );
    }
  }
);

//   Delete user
export const deleteUserThunkFn = createAsyncThunk(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/deleteUser");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Send verification code (resend)
export const userEmailVerificationThunkFn = createAsyncThunk(
  "auth/emailVerification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/getVerificationCode");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Verify the code
export const verifyEmailVerificationThunkFn = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationToken, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/verifyEmail", {
        verificationToken,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

//   Get Logged In User Details

export const getUserDetailsThunkFn = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      let token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) return rejectWithValue({ message: "Please log in or create an account to continue." });

      const config = { withCredentials: true };
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      const response = await apiClient.get("/api/v1/user/getDetails", config);

      // Ensure response is normalized: { success: true/false, message: string, data: {} }
      return {
        success: response.data.success ?? true,
        message: response.data.message ?? "User details fetched",
        data: response.data.data ?? response.data,
      };
    } catch (error) {
        //console.log(error);
      return rejectWithValue(
        error.response?.data || { message: error.message || "Something went wrong" }
      );
    }
  }
);

//   Get Logged In User Details
export const removeKeyThunkFn = createAsyncThunk(
  "auth/removeAwsKey",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/user/removeAwsApiKey");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

//   Submit AWS Credentials
export const submitAwsCredentialsThunkFn = createAsyncThunk(
  "auth/submitAwsCredentials",
  async (awsCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/api/v1/user/saveAwsApiKey",
        awsCredentials
      );
        //console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
