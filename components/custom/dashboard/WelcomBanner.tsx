"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkle } from "lucide-react";
import React from "react";
import CreateNewBoardDialog from "./CreateNewBoardDialog";

export const WelcomBanner = () => {
  const { user } = useUser();

  return (
    <div>
      <div className="p-10 border rounded-xl bg-gradient-to-r from-blue-200 to-purple-200">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.fullName || "User"} 👋
            </h1>

            <p className="mt-2">
              Bring your ideas to life on an infinite canvas.
            </p>

            <div className="flex items-center gap-2 mt-5">
                {/* <Button>+ Create New Board</Button>
                 */}
                 <CreateNewBoardDialog/>
                <Button variant={"outline"}><Sparkle/> AI Helper</Button>
            </div>
          </div>

          {/* Decorative mockup card */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg p-4 w-64">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg">
                New Idea ✨
              </span>
              <span className="text-xs font-medium bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg">
                AI Brainstorm
              </span>
            </div>

            <div className="mt-3 text-xs text-gray-500 bg-red-50 px-3 py-1.5 rounded-lg inline-block">
              Design → Build → Ship
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};