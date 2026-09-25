'use client'

import { toast } from "@/components/ui/toast";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
const Whiteboard = () => {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);

    const saveTimeRef = useRef<any>(null);
    const {projectId} = useParams();

    const handleCanvasChange = (elements : readonly any[], appState: any, files : any) => {
        //Cancel prev timer
        if(saveTimeRef?.current){
            clearTimeout(saveTimeRef.current);
        }

        //Start New 10 Second Timer
        saveTimeRef.current = setTimeout(() => {
            //save method
            saveCanvasChanges(elements,appState,files);
            toast.add({
                title : "Changes Saved",
                type : "Success"
            })
        }, 10000);
    }

    const saveCanvasChanges =async (elements : readonly any[], appState: any, files : any) => {
        const result = await axios.post('/api/whiteboard', {
            elements : elements,
            appState : appState,
            files : files,
            projectId: projectId
        })
    }

  return (
    <div style={{ height: "90vh" }}>
        <Excalidraw 
        //@ts-ignore
        excalidrawAPI={(api)=> setExcalidrawAPI(api)} 
        onChange={handleCanvasChange}
        />
      </div>
  )
}

export default Whiteboard