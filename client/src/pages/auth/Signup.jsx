import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpThunkFn } from "@/redux/auth/authThunkFn";
import { toast } from "sonner";
import { handleThunkResponse } from "@/utils/ShowMessage";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await handleThunkResponse(dispatch, signUpThunkFn, formData, {
      successMessage: "Account created successfully! Please verify your email.",
      errorMessage: "Failed to create account",
    });

    setLoading(false);

    if (res?.success) {
      navigate("/verifyEmail");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 border rounded-lg shadow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            // className="rounded-none"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            className="w-full bg-black/10 hover:bg-black text-black hover:text-white"
            // className="w-full rounded-none bg-black/60 text-black py-2 hover:bg-black btn-shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Button
            type="button"
            className="w-auto bg-black/10 hover:bg-black text-black hover:text-white"
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
