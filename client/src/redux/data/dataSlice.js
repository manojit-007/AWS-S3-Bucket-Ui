import { createSlice } from '@reduxjs/toolkit';
import { getAllS3BucketContent, getUrlToUpload } from './dataThunkFn';

const initialState = {
  s3BucketContent: [],
  urlToUpload: null,     // Proper key for upload URL
  loading: false,
  error: null,
  success: false,
  message: null,
  fetchedData: false,
};

const DataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearUrl: (state) => {
      state.urlToUpload = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔵 Get All S3 Bucket Content
      .addCase(getAllS3BucketContent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.fetchedData = false;
      })
      .addCase(getAllS3BucketContent.fulfilled, (state, action) => {
        state.loading = false;
        state.s3BucketContent = action.payload.data.content || [];
        state.success = true;
        state.fetchedData = true;
        state.message = action.payload.message || null;
      })
      .addCase(getAllS3BucketContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
        state.fetchedData = true;
      })

      // 🔵 Get URL to upload
      .addCase(getUrlToUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.urlToUpload = null;
      })
      .addCase(getUrlToUpload.fulfilled, (state, action) => {
        state.loading = false;
          //console.log(action.payload);
        state.urlToUpload = action.payload.data.signedUrls || null;
        state.success = true;
        state.message = action.payload.message || null;
      })
      .addCase(getUrlToUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get upload URL";
        state.success = false;
      });
  },
});

//   Export reducers
export const { clearErrors, clearMessage, clearUrl } = DataSlice.actions;
export default DataSlice.reducer;
