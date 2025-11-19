"use client";

import React from "react";
import { LoaderOne } from "../ui/loader";

export default function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <LoaderOne />
    </div>
  );
}