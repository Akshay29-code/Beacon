"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { account } from "../app/appwrite";
import { Button } from "./ui/button";
import { LaunchButton } from "./ui/launch-button";

export default function Navbar(){
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        // User is not yet logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-center">
        <ul className="flex items-center gap-10 text-white navbar-blankriver select-none">
          <li>
            <Link href="#" className="text-lg sm:text-xl tracking-wider hover:opacity-80 transition-opacity">
              Home
            </Link>
          </li>
          <li>
            <Link href="#features" className="text-lg sm:text-xl tracking-wider hover:opacity-80 transition-opacity">
              Features
            </Link>
          </li>
          <li>
            <Link href="#about" className="text-lg sm:text-xl tracking-wider hover:opacity-80 transition-opacity">
              About
            </Link>
          </li>
          <li>
            <Link href="#contact" className="text-lg sm:text-xl tracking-wider hover:opacity-80 transition-opacity">
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4 ml-10">
          {isLoading ? (
            <div className="w-20 h-9 bg-white/20 rounded-md animate-pulse"></div>
          ) : user ? (
            <Link href="/beacon">
              <LaunchButton />
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-6"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}


