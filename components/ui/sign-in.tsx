"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  heroImageSrc: string;
  testimonials: Testimonial[];
  onSignIn: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn: () => void;
  onResetPassword: () => void;
  onCreateAccount: () => void;
}

export function SignInPage({
  heroImageSrc,
  testimonials,
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}: SignInPageProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-white">Welcome</h1>
            <p className="text-gray-400">Access your account and continue your journey with us</p>
          </div>

          <form onSubmit={onSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-300">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="remember" className="text-sm text-gray-300">
                  Keep me signed in
                </label>
              </div>
              <Button
                type="button"
                variant="link"
                className="text-sm text-purple-400 p-0 h-auto"
                onClick={onResetPassword}
              >
                Reset password
              </Button>
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
            onClick={onGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm text-gray-400">
            New to our platform?{" "}
            <Button
              type="button"
              variant="link"
              className="text-blue-400 p-0 h-auto"
              onClick={onCreateAccount}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative">
        <div style={{backgroundImage: `url('https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80')`}} className="rounded-3xl m-4 absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"></div>
        
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-1 border border-white/10">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white/30">
                    <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <p className="font-medium text-sm text-white">{testimonial.name}</p>
                      <p className="text-white/70 text-xs">{testimonial.handle}</p>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{testimonial.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
