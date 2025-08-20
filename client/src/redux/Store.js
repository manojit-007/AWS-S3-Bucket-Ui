import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import dataSlice from "./data/dataSlice";

const Store = configureStore({
    reducer: {
        auth : authSlice,
        s3Bucket: dataSlice
    }
})

export default Store;