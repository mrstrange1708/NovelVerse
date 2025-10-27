"use client";
import React from "react";
import { BackgroundBeams } from "../../components/ui/background-beams";
import SignupFormDemo from "./signin-form-demo"

export default function signin() {
  return (
    <>
    <div className="h-[100vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased z-0">
      <BackgroundBeams />
      <SignupFormDemo />
    </div>
    </>
  );
}

