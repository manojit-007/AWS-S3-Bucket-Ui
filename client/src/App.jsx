import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsThunkFn } from "./redux/auth/authThunkFn";
import "./App.css";
import Loader from "./components/loader";
import { handleThunkResponse } from "./utils/ShowMessage";
import { getAllS3BucketContent } from "./redux/data/dataThunkFn";
import PrivacyNote from "./pages/privacy/PrivacyNote";

// Lazy-loaded pages
const ProtectedRoute = lazy(() => import("./utils/ProtectedRoute"));
const Home = lazy(() => import("./pages/home"));
const LogIn = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Explorer = lazy(() => import("./pages/explorer/index"));
const Profile = lazy(() => import("./pages/profile/index"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const Error = lazy(() => import("./pages/error"));

function App() {
  const dispatch = useDispatch();
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const { fetchedData } = useSelector(
    (state) => state.s3Bucket
  );

  useEffect(() => {
    const init = async () => {
      // 1️⃣ Fetch user if not authenticated
      if (!user && !isAuthChecked) {
        await handleThunkResponse(dispatch, getUserDetailsThunkFn, null, {
          successMessage: "User already logged in . ",
          errorMessage: "Server error, please try again later   ",
        });
      }
      
      // 2️⃣ Fetch S3 data only if user exists, has credentials, and not fetched yet
      if (user && user?.hasCredentials && !fetchedData) {
        await handleThunkResponse(dispatch, getAllS3BucketContent, null, {
          successMessage: "Bucket contents loaded successfully  ",
          errorMessage: "Server error, please try again later   ",
        });
      }
    };
  
    init();
  }, [dispatch, user, isAuthChecked, fetchedData]);
  

  // 🔐 Don't render routes until auth is verified
  if (!isAuthChecked) {
    return (
      <section className="flex items-center justify-center h-screen">
        <Loader />
      </section>
    );
  }

  return (
    <Suspense
      fallback={
        <section className="flex items-center justify-center h-screen">
          <Loader />
        </section>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/file-manager" /> : <LogIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/file-manager" /> : <Signup />}
        />
        <Route
          path="/verifyEmail"
          element={!user?.isVerified ? <VerifyEmail /> : <Navigate to="/profile" />}
        />
        <Route
          path="/privacy"
          element={<PrivacyNote />}
        />

        <Route
          path="/file-manager"
          element={
            <ProtectedRoute>
              <Explorer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
}

export default App;
