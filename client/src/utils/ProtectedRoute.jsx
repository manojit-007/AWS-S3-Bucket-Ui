import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "@/components/loader";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  if (!user && !isAuthChecked) {
    return (
      <section className="flex items-center justify-center h-screen">
        <Loader />
      </section>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
