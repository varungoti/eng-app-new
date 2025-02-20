"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";

export function ResetPassword() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const showToast = (props: any) => {
    if (toast) {
      toast(props);
    }
  };

  useEffect(() => {
    // Parse the hash portion of the URL
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    const accessToken = params.get('access_token');

    console.log('URL Hash:', hash);
    console.log('Parsed Token:', accessToken);

    if (!accessToken) {
      logger.error("No access token found in URL", {
        context: { hash },
        source: "ResetPassword"
      });
      navigate("/login");
      toast({
        variant: "destructive",
        description: "Invalid password reset link"
      });
      return;
    }

    // Store token for form submission
    setAccessToken(accessToken);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!accessToken) {
        throw new Error("Missing reset token");
      }

      if (!resetPassword) throw new Error("Reset password function not available");

      await resetPassword({ accessToken, newPassword });
      toast({
        description: "Password reset successful"
      });
      navigate("/login");
    } catch (error) {
      logger.error('Failed to reset password', {
        context: { error },
        source: 'ResetPassword'
      });
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to reset password"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container max-w-md mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  );
} 