"use client";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";

export const NavBar = () => {
  return (
    <nav className="flex items-end justify-between py-4 px-6 bg-background border-b top-0 sticky z-50">
      hello
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
          <SignInButton mode="modal">
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
