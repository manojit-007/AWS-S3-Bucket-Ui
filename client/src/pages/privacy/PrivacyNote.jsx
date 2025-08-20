import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyNote = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 px-4">
      <section className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        
        {/* Back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            className="btn-shadow text-gray-800 dark:text-white"
            variant="outline"
          >
            ← Back
          </Button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-6">
          🔒 AWS Keys Security Notice
        </h1>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          {/* Storage & Deletion */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Storage & Deletion on Our Platform
            </h2>
            <p className="mt-2">
              When you provide your AWS API keys to our platform, they are stored securely
              and are used only to enable you to access and manage your AWS resources
              through our application.
            </p>
            <p className="mt-2">
              If you choose to remove your AWS keys from our system, they will be{" "}
              <strong>permanently deleted</strong> from our servers.
            </p>
          </section>

          {/* Responsibility */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Responsibility in AWS Account
            </h2>
            <p className="mt-2">
              <strong>
                Deleting your AWS keys from our system does not delete them from your AWS account.
              </strong>
            </p>
            <p className="mt-2">
              For your own security, you must log in to your AWS account and{" "}
              <strong>manually remove, deactivate, or delete those keys</strong>.
            </p>
            <p className="mt-2">
              This ensures that no unauthorized access can occur outside of our platform.
            </p>
          </section>

          {/* Before deleting account */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Before Deleting Your Account
            </h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>We strongly advise you to remove your AWS keys from our system first.</li>
              <li>
                Once your account is deleted, you will no longer be able to access or manage
                those credentials through our platform.
              </li>
              <li>
                Please also ensure you delete or deactivate those keys directly from AWS before deleting your account.
              </li>
            </ul>
          </section>

          {/* Security Recommendation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Security Recommendation
            </h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Always rotate your AWS keys regularly.</li>
              <li>Use IAM roles and temporary credentials wherever possible.</li>
              <li>
                Contact AWS Support immediately if you suspect any unauthorized use of your keys.
              </li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
};

export default PrivacyNote;
