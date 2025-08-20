import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgetPasswordThunkFn, logInThunkFn } from "@/redux/auth/authThunkFn";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleThunkResponse } from "@/utils/ShowMessage";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  // CoolDown timer state
  const [coolDown, setCoolDown] = useState(0);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        window.location.href = "/file-manager";
      }, 1000);
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (coolDown > 0) {
      timer = setInterval(() => {
        setCoolDown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [coolDown]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const res = await handleThunkResponse(dispatch, logInThunkFn, formData, {
      successMessage: "Logged in successfully!",
      errorMessage: "Invalid email or password",
    });

    if (res) {
      navigate("/file-manager");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const res = await handleThunkResponse(
      dispatch,
      forgetPasswordThunkFn,
      email,
      {
        successMessage: "Check your inbox for reset instructions!",
      }
    );

    if (res) {
      setCoolDown(60); 
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="mb-2 text-center font-bold text-2xl">Log In</h1>
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChangeHandler}
            placeholder="Email"
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <Label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Password"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-black/10 hover:bg-black text-black hover:text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Button
          variant="outline"
          onClick={() => navigate("/signup")}
          className="bg-black/10 hover:bg-black text-black hover:text-white"
        >
          Sign Up
        </Button>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        Forget password?{" "}
        <Dialog>
          <DialogTrigger className="bg-black/10 p-2 rounded-sm hover:bg-black text-black hover:text-white">
            Reset here
          </DialogTrigger>
          <DialogContent className="rounded-sm border-0">
            <DialogHeader>
              <DialogTitle>Forget password</DialogTitle>
              <DialogDescription>
                Enter your email address to receive a password reset link.
                <Label htmlFor="reset-email" className="mt-4">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  className="mt-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  variant="outline"
                  onClick={handleResetPassword}
                  className="bg-black/10 hover:bg-black text-black hover:text-white mt-4"
                  disabled={coolDown > 0}
                >
                  {coolDown > 0 ? `Retry in ${coolDown}s` : "Reset here"}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </p>
    </main>
  );
};

export default LogIn;
