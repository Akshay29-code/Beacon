"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../../appwrite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const AuthSuccessPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const user = await account.get();
        if (user) {
          setTimeout(() => {
            router.push('/beacon');
          }, 2000);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthSuccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Authentication Successful!
          </CardTitle>
          <CardDescription>
            {isLoading 
              ? "Verifying your account..." 
              : "Redirecting you to the app..."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            ) : (
              <span className="text-2xl">✅</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Please wait while we complete the sign-in process...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSuccessPage;
