import { Cloud, Key, Upload } from "lucide-react";

export const steps = [
    {
      id: 1,
      title: "Login or Create AWS Account",
      description:
        "Go to the AWS Console and sign in with your existing account or create a new one.",
      icon: <Cloud className="w-8 h-8 text-black" />,
    },
    {
      id: 2,
      title: "Create an S3 Bucket",
      description:
        "In the AWS S3 service, create a bucket to store your files and set the region.",
      icon: <Upload className="w-8 h-8 text-black" />,
    },
    {
      id: 3,
      title: "Generate API Keys",
      description:
        "Navigate to IAM service in AWS, create a user, and generate Access Key ID and Secret Access Key.",
      icon: <Key className="w-8 h-8 text-black" />,
    },
    {
      id: 4,
      title: "Submit Your Keys",
      description:
        "Return here and upload your AWS credentials securely to start managing your files.",
      icon: <Upload className="w-8 h-8 text-black" />,
    },
  ];