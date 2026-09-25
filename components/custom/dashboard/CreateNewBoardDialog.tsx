"use client";
import React, { useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "@/components/ui/toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateNewBoardDialog = () => {
  const [workspaceName, setWorkspaceName] = useState("");

  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);

  const route = useRouter();

  const handleCreateBoard = async () => {
    if (workspaceName.trim() === "" || workspaceName?.length > 30) {
      toast.add({
        type: "error",
        title: "Invalid Workspace Name",
        description: "Please enter a valid workspace name",
      });
      return;
    }
    setLoading(true);
    try {
      const projectId = crypto.randomUUID();
      const result = await axios.post("/api/projects", {
        projectId: projectId,
        projectName: workspaceName,
      });

      console.log("this is project", result);

      toast.add({
        type: "success",
        title: "New Workspace Created",
      });
      route.push('/workspace/' + projectId)
    } catch (error) {
      console.error(error);

      toast.add({
        type: "error",
        title: "Failed to create workspace",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      setDialog(false);
    }
  };
  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger>
        <Button className="w-full">
          <Plus /> Create New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Whiteboard Workspace Name
          </DialogTitle>
        </DialogHeader>
        <div>
          <label className="text-gray-500">
            Enter Whiteboard Workspace Name
          </label>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace Name"
            className="mt-1"
          />
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={workspaceName.length === 0}
            onClick={handleCreateBoard}
          >
            {loading && <Loader2 className="animate-spin" />} Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBoardDialog;
