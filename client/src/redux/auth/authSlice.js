import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUserThunkFn,
  forgetPasswordThunkFn,
  getUserDetailsThunkFn,
  logInThunkFn,
  logOutThunkFn,
  removeKeyThunkFn,
  signUpThunkFn,
  submitAwsCredentialsThunkFn,
  userEmailVerificationThunkFn,
  verifyEmailVerificationThunkFn, //   Import it
} from "./authThunkFn";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // general loading
  verifyLoading: false, // for verifying email
  verificationLoading: false, // for resending code
  error: null,
  success: false,
  message: null,
  isAuthChecked: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /** 🔵 Sign Up */
      .addCase(signUpThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(signUpThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        localStorage.setItem("token", action.payload.data.token);
        state.isAuthenticated = true;
        state.success = true;
        state.message = action.payload.message;
        state.isAuthChecked = true;
      })
      .addCase(signUpThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      /** 🟢 Log In */
      .addCase(logInThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(logInThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        localStorage.setItem("token", action.payload.data.token);
        state.isAuthenticated = true;
        state.success = true;
        state.message = action.payload.message;
        state.isAuthChecked = true;
      })
      .addCase(logInThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      /** 🟢 Log Out */
      .addCase(logOutThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(logOutThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.success = true;
        state.message = action.payload.message || "Logged out successfully";
        state.isAuthChecked = true;
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .addCase(logOutThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.isAuthChecked = true;
      })

      /** 🔄 Get User Details */
      .addCase(getUserDetailsThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getUserDetailsThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.success = true;
        state.message = action.payload.message;
        state.isAuthChecked = true;
      })
      .addCase(getUserDetailsThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      /** 📧 Verify Email */
      .addCase(verifyEmailVerificationThunkFn.pending, (state) => {
        state.verifyLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailVerificationThunkFn.fulfilled, (state, action) => {
        state.verifyLoading = false;
        // update existing user object
        if (state.user) {
          state.user = { ...state.user, isVerified: true };
        }
        if (action.payload?.data?.user) {
          state.user = action.payload.data.user;
        }
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verifyEmailVerificationThunkFn.rejected, (state, action) => {
        state.verifyLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      /** 📧 Resend Email Verification Code */
      .addCase(userEmailVerificationThunkFn.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(userEmailVerificationThunkFn.fulfilled, (state, action) => {
        state.verificationLoading = false;
        if (action.payload?.data?.user) {
          state.user = action.payload.data.user;
        }
        if (state.user) {
          state.isAuthenticated = true;
        }
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(userEmailVerificationThunkFn.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      /** 🔵 Forget Password */
      .addCase(forgetPasswordThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(forgetPasswordThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Password reset email sent.";
      })
      .addCase(forgetPasswordThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to send reset email",
        };
        state.success = false;
      })

      /** 🔴 Delete User */
      .addCase(deleteUserThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteUserThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.success = true;
        state.message = action.payload.message;
        localStorage.removeItem("token");
        state.isAuthChecked = true;
      })
      .addCase(deleteUserThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      /** 🔵 Store AWS Key */
      .addCase(submitAwsCredentialsThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(submitAwsCredentialsThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.success = true;
        state.message = action.payload.message;
        state.isAuthChecked = true;
      })
      .addCase(submitAwsCredentialsThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      /** 🔵 Remove AWS Key */
      .addCase(removeKeyThunkFn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(removeKeyThunkFn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.success = true;
        state.message = action.payload.message;
        state.isAuthChecked = true;
      })
      .addCase(removeKeyThunkFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearErrors, clearMessage } = AuthSlice.actions;
export default AuthSlice.reducer;
