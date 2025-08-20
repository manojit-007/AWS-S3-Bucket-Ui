import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const CorsPolicySnippet = () => {
  const codeSnippet = `[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "https://aws-s3-bucket-ui.vercel.app",
            "https://aws-s3-bucket-ui.onrender.com"
        ],
        "ExposeHeaders": []
    }
]`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="bg-white text-black btn-shadow p-4 relative">
      <pre className="overflow-x-auto text-sm">
        <code>{codeSnippet}</code>
      </pre>
      <Button
        onClick={handleCopy}
        size="sm"
        variant="secondary"
        className="absolute top-3 right-3 flex items-center gap-2"
      >
        <Copy size={16} />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </section>
  );
};

export default CorsPolicySnippet;
