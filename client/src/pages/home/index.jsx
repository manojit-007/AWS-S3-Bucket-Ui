import React from "react";
import { Link } from "react-router-dom";
import { steps } from "./steps";
import { ArrowDown, Cloud, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const scrollToSteps = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Navbar */}
      <nav className="w-full max-w-6xl flex justify-between items-center px-6 md:px-16 py-4 fixed top-0 bg-white/40 backdrop-blur-xs shadow-sm z-50">
        <Link
          to="/"
          className="text-lg sm:text-xl gap-2 font-bold bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text"
        >
          AWS S3 Manager
        </Link>

        <div className="flex gap-4">
          {user ? (
            <Link
              to="/file-manager"
              className="px-4 py-2 btn-shadow bg-black text-black text-sm sm:text-base font-medium hover:bg-gray-800 transition"
            >
              File Manager
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 btn-shadow border text-black text-sm sm:text-base font-medium hover:bg-gray-800 transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 btn-shadow bg-black text-black text-sm sm:text-base font-medium hover:bg-gray-800 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center max-w-3xl min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-black to-gray-900 text-transparent bg-clip-text">
          Securely Manage Your AWS S3 Buckets
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-black/80 mb-10">
          A simple yet powerful dashboard to upload, organize, and manage your
          files in Amazon S3 with complete security.
        </p>

        <div className="flex flex-col items-center md:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-6 py-3 btn-shadow bg-black/90 text-black text-sm sm:text-base hover:bg-black transition-transform transform shadow-md"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 btn-shadow border border-gray-300 text-gray-700 text-sm sm:text-base hover:bg-gray-100 transition-transform transform shadow-sm"
          >
            Log In
          </Link>
        </div>

        <Button
          onClick={scrollToSteps}
          className="mt-6 flex items-center justify-center gap-2  text-gray-950 hover:text-gray-900 hover:bg-gray-100 btn-shadow py-6 rounded-none transition-colors duration-300 text-sm sm:text-base"
        >
          See How It Works
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 w-full max-w-6xl flex flex-col items-center px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose AWS S3 Manager?
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full">
          <div className="flex flex-col items-center text-center p-8 bg-white btn-shadow transition">
            <Cloud className="w-10 h-10 mb-4 text-gray-800" />
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              Easy File Management
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Upload, preview, download, and organize files directly from your
              browser.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white btn-shadow transition">
            <ShieldCheck className="w-10 h-10 mb-4 text-gray-800" />
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              Secure by Design
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Your credentials and data are encrypted and handled with care.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white btn-shadow transition">
            <Zap className="w-10 h-10 mb-4 text-gray-800" />
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              Fast & Reliable
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Optimized for speed and efficiency with AWS SDK + secure APIs.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 flex flex-col items-center justify-center max-w-6xl w-full px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14 text-gray-800">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center bg-white border border-gray-200 p-8 shadow-md btn-shadow transition-all duration-300"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">{`Step ${step.id}: ${step.title}`}</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl bg-black text-white text-xs sm:text-sm py-6 px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} AWS S3 Manager. All rights
            reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
