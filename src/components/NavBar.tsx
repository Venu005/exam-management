"use client";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const NavBar = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const handleLoogClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };
  return (
    <nav className="flex items-end justify-between py-4 px-6 bg-background border-b top-0 sticky z-50">
      <span
        onClick={handleLoogClick}
        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 cursor-pointer"
      >
        Exam Flow
      </span>
      <div className="flex items-center ml-auto gap-2">
        <SignedIn>
          <SignOutButton>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center gap-2"
            >
              <LogOutIcon className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl={"/dashboard"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center gap-2"
            >
              <LogInIcon className="size-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </SignInButton>
        </SignedOut>

        <UserButton />
      </div>
    </nav>
  );
};
