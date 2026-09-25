"use client";
import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Share } from "lucide-react";

type Props = {
  selectedTab: any;
};
const WorkspaceHeader = ({ selectedTab }: Props) => {
  return (
    <div className="p-3 border-b flex justify-between">
      <div className="flex gap-2 items-center font-bold">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <h2>Workspace Name</h2>
      </div>

      <div>
        <Tabs
          defaultValue="whiteboard"
          className=""
          onValueChange={(value) => selectedTab(value)}
        >
          <TabsList>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            <TabsTrigger value="doc">doc</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>

        <Button className="bg-red-600 text-white hover:bg-red-700">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
