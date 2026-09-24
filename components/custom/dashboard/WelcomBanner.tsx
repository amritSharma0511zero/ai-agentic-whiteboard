"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkle } from "lucide-react";
import React from "react";

export const WelcomBanner = () => {
  const { user } = useUser();

  return (
    <div>
      <div className="p-10 border rounded-xl bg-gradient-to-r from-blue-200 to-purple-200">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.fullName || "User"} 👋
        </h1>

        <p className="mt-2">
          Bring your ideas to life on an infinite canvas.
        </p>

        <div className="flex items-center gap-2 mt-5">
            <Button>+ Create New Board</Button>
            <Button variant={"outline"}><Sparkle/> AI Helper</Button>
        </div>
      </div>
    </div>
  );
};
