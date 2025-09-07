"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AuthFailurePage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Authentication Failed
          </CardTitle>
          <CardDescription>
            There was an issue signing you in with Google
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This could be due to:
          </p>
          <ul className="text-sm text-muted-foreground text-left space-y-1 mb-4">
            <li>• Cancelled authorization</li>
            <li>• Network connection issues</li>
            <li>• Temporary service unavailability</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            You'll be redirected to the login page automatically in a few seconds.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthFailurePage;
