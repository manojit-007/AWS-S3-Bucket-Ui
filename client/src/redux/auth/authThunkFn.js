import { handleApiRequest } from "@/api/req";
import { createAsyncThunk } from "@reduxjs/toolkit";

//   Sign Up
export const signUpThunkFn = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/signUp", userData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Log In
export const logInThunkFn = createAsyncThunk(
  "auth/logIn",
  async (userData, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/login", userData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Log Out
export const logOutThunkFn = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/logOut");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Forget Password
export const forgetPasswordThunkFn = createAsyncThunk(
  "auth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/forgetPassword", {
        email,
      });
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Reset Password
export const resetPasswordThunkFn = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/reset-password", {
        resetToken,
        newPassword,
      });
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Delete user
export const deleteUserThunkFn = createAsyncThunk(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/deleteUser");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Send verification code (resend)
export const userEmailVerificationThunkFn = createAsyncThunk(
  "auth/emailVerification",
  async (_, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/getVerificationCode");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Verify the code
export const verifyEmailVerificationThunkFn = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationToken, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/verifyEmail", {
        verificationToken,
      });
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Get Logged In User Details
export const getUserDetailsThunkFn = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      return await handleApiRequest("get", "/api/v1/user/getDetails");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Remove AWS Key
export const removeKeyThunkFn = createAsyncThunk(
  "auth/removeAwsKey",
  async (_, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/removeAwsApiKey");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//   Submit AWS Credentials
export const submitAwsCredentialsThunkFn = createAsyncThunk(
  "auth/submitAwsCredentials",
  async (awsCredentials, { rejectWithValue }) => {
    try {
      return await handleApiRequest("post", "/api/v1/user/saveAwsApiKey", awsCredentials);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
