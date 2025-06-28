import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Shield } from 'lucide-react';

import { fetchGoogleAuthURL } from "../api/auth";
import BackendStatus from "../components/BackendStatus";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LoginPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const { url } = await fetchGoogleAuthURL();
      window.location.href = url;
    } catch (err) {
      setAuthError(err.message || "Failed to initiate Google authentication.");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <BackendStatus />
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <button
              onClick={handleGoogleAuth}
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <LoadingSpinner size={5} color="border-current" />
              ) : (
                <>
                  <FcGoogle className="h-6 w-6" />
                  Continue with Google
                </>
              )}
            </button>
          </div>
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-red-200 text-red-800 border text-sm">
              {authError}
            </div>
          )}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="flex items-center justify-center h-full">
            <Shield size={100} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
