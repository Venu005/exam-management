"use client";

import { SignOutButton, useAuth, UserButton } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export const NavBar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="flex items-end justify-between py-4 px-6 bg-background border-b top-0 sticky z-50">
      <Link
        href="/"
        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 cursor-pointer"
      >
        Exam Flow
      </Link>
      <div className="flex items-center ml-auto gap-2">
        {isSignedIn ? (
          <div className="flex items-center gap-4 cursor-pointer">
            <Button variant="outline" asChild>
              <SignOutButton>
                <div>
                  <LogInIcon size={20} />
                  Logout
                </div>
              </SignOutButton>
            </Button>
            <Link
              href="/dashboard"
              className={`hidden md:block ${buttonVariants({
                variant: "link",
                size: "default",
              })}`}
            >
              Dashboard
            </Link>
            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
