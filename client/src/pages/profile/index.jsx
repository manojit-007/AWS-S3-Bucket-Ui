import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteUserThunkFn,
  logOutThunkFn,
  removeKeyThunkFn,
  submitAwsCredentialsThunkFn,
} from "@/redux/auth/authThunkFn";
import { useNavigate } from "react-router-dom";
import { handleThunkResponse } from "@/utils/ShowMessage";
import { CircleCheck, CircleX } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    awsAccessKey: "",
    awsSecretKey: "",
    awsRegion: "",
    bucketName: "",
  });

  useEffect(() => {
    if (user?.isVerified === false) {
      navigate("/verifyEmail");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await handleThunkResponse(
      dispatch,
      submitAwsCredentialsThunkFn,
      form,
      {
        successMessage: "✅ AWS credentials saved successfully!",
        errorMessage: "❌ Failed to save AWS credentials.",
      }
    );

    if (res) {
      setForm({ awsAccessKey: "", awsSecretKey: "", awsRegion: "", bucketName: "" });
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    const res = await handleThunkResponse(dispatch, logOutThunkFn, null, {
      successMessage: "👋 Logged out successfully!",
      errorMessage: "Logout failed. Please try again.",
    });

    if (res) navigate("/login");
  };

  if (!user) {
    return (
      <section className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </section>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4 py-10">
      <div className="w-full max-w-xl space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-md">
        
        {/* Header */}
        <section>
          <Button
          onClick={() => navigate(-1)}
          className={"mb-4 bg-black/10 hover:bg-black text-black hover:text-white"}
          >Back</Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome, {user.email.split("@")[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage your AWS credentials and account settings.
          </p>
        </section>

        {/* Profile Info */}
        <section className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Email:</strong> {user.email}</p>
          <p className="flex items-center gap-2">
            <strong>API Key Status:</strong>
            {user.hasCredentials ? (
              <span className="flex items-center text-black">
                <CircleCheck className="w-4 h-4 mr-1" /> Active
              </span>
            ) : (
              <span className="flex items-center text-black">
                <CircleX className="w-4 h-4 mr-1" /> Not Uploaded
              </span>
            )}
          </p>

          {user.hasCredentials && (
            <Button
              className="w-full mt-3 bg-black/10 hover:bg-black text-black hover:text-white"
              onClick={() => navigate("/file-manager")}
            >
              Open File Manager
            </Button>
          )}
        </section>

        {/* Upload Credentials Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-black/10 hover:bg-black text-black hover:text-white"
              disabled={user?.hasCredentials}
            >
              {user?.hasCredentials ? "Credentials Uploaded" : "Upload AWS Credentials"}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload AWS Credentials</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: "awsAccessKey", label: "AWS Access Key" },
                { id: "awsSecretKey", label: "AWS Secret Key", type: "password" },
                { id: "awsRegion", label: "AWS Region", placeholder: "e.g. ap-south-1" },
                { id: "bucketName", label: "Bucket Name" },
              ].map(({ id, label, type = "text", placeholder }) => (
                <div key={id} className="flex flex-col gap-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[id]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <Button
                type="submit"
                className="w-full bg-black/10 hover:bg-black text-black hover:text-white"
              >
                Save Credentials
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Account Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleLogout}
            className="w-full bg-black/10 hover:bg-black text-black hover:text-white"
          >
            Log Out
          </Button>

          <Button
            onClick={() => dispatch(removeKeyThunkFn())}
            disabled={!user?.hasCredentials}
            className="w-full bg-black/10 hover:bg-black text-black hover:text-white"
          >
            Delete AWS Credentials
          </Button>

          <Button
            onClick={() => {
              dispatch(deleteUserThunkFn());
              navigate("/login");
            }}
            className="w-full bg-black/70 text-white hover:bg-black"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
