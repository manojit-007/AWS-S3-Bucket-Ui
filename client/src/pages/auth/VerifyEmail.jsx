import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userEmailVerificationThunkFn, verifyEmailVerificationThunkFn } from "@/redux/auth/authThunkFn";
import { handleThunkResponse } from "@/utils/ShowMessage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [code, setCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    if (user && user.isVerified) {
      toast.success("Your email is already verified.");
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
  
    if (!code.trim()) {
      toast.error("Please enter your verification code");
      return;
    }
  
    setVerifyLoading(true);
    try {
      const res = await handleThunkResponse(dispatch, verifyEmailVerificationThunkFn, code, {
        successMessage: "Email verified successfully!",
        errorMessage: "Invalid verification code. Please try again.",
      });
  
      if (res) {
        navigate("/profile");
      }
    } finally {
      setVerifyLoading(false);
    }
  };
  const handleResend = async () => {
    setVerificationLoading(true);
    try {
      await handleThunkResponse(dispatch, userEmailVerificationThunkFn, null, {
        successMessage: "Verification code resent to your email.",
      });
    } finally {
      setVerificationLoading(false);
    }
  };
  
  

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="font-semibold text-center text-2xl text-gray-900 dark:text-white">
          Verify Your Email
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Please enter the verification code sent to your email address.
        </p>

        {/* Form */}
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code" className="text-gray-700 dark:text-gray-300">
              Verification Code
            </Label>
            <Input
              id="verification-code"
              placeholder="Enter your verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={!code.trim() || verifyLoading}
            className="w-full bg-black/80 hover:bg-black text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifyLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        {/* Resend link */}
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Didn’t receive the code?{" "}
          <Button
            type="button"
            onClick={handleResend}
            disabled={verificationLoading}
            variant="ghost"
            className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {verificationLoading ? "Resending..." : "Resend"}
          </Button>
        </p>
      </div>
    </main>
  );
};

export default VerifyEmail;
