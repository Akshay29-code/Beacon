"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, ID } from "../../appwrite";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";

const Testimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "NoteCraft revolutionized my writing process. Perfect for capturing fleeting ideas and organizing thoughts seamlessly."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Dr. Michael Rodriguez",
    handle: "@profmike",
    text: "Finally, a note app that understands how researchers think. Lightning-fast sync keeps my work organized across devices."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/32.jpg",
    name: "Emma Thompson",
    handle: "@emmacreates",
    text: "As a content creator, I'm constantly juggling ideas. NoteCraft keeps everything accessible and organized. Game-changer!"
  },
];

const LoginPage = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await account.get();
        if (user) {
          router.push('/beacon');
          return;
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      router.push('/beacon');
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      account.createOAuth2Session(
        'google',
        `${window.location.origin}/auth/success`,
        `${window.location.origin}/auth/failure`
      );
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleResetPassword = () => {
    alert("Password reset functionality will be implemented soon!");
  };

  const handleCreateAccount = () => {
    setIsRegistering(!isRegistering);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={Testimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default LoginPage;
