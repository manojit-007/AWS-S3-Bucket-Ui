import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col  w-full m-auto items-center justify-center h-screen bg-gray-100">
      <section className="text-center max-w-6xl">
        <TriangleAlert className="w-16 h-16 mx-auto mt-4 text-black" />
        <h1 className="text-5xl font-extrabold text-black">404</h1>
        {/* 404 icon */}
        <h2 className="mt-2 text-2xl font-semibold text-gray-800">
          Oops! Page not found
        </h2>
        <p className="mt-3 text-gray-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
      </section>

      <section className="mt-6 flex gap-4">
        <Button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border
           btn-shadow text-black transition"
        >
          Go Back
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="px-4 py-2 border
           btn-shadow text-black transition"
        >
          Home
        </Button>
      </section>
    </main>
  );
};

export default Error;
