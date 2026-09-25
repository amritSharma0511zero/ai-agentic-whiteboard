'use client'

import { toast } from "@/components/ui/toast";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import "./whiteboard.css"
import { ArrowRight, Circle, Diamond, Eraser, Hand, Image, Minus, MousePointer, Pencil, Square, Type } from "lucide-react";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

const tools = [
    {
        name : 'selection',
        icon : MousePointer,
        color : "text-blue-600"
    },
    {
        name : 'hand',
        icon : Hand,
        color : "text-cyan-600"
    },
    {
        name : 'rectangle',
        icon : Square,
        color : "text-blue-600"
    },
    {
        name : 'diamond',
        icon : Diamond,
        color : "text-emerald-600"
    },
    {
        name : 'ellipse',
        icon : Circle,
        color : "text-amber-600"
    },
    {
        name : 'arrow',
        icon : ArrowRight,
        color : "text-violet-600"
    },
    {
        name : 'line',
        icon : Minus,
        color : "text-pink-600"
    },
    {
        name : 'freedraw',
        icon : Pencil,
        color : "text-orange-600"
    },
    {
        name : 'text',
        icon : Type,
        color : "text-indigo-600"
    },
    {
        name : 'image',
        icon : Image,
        color : "text-green-600"
    },
    {
        name : 'eraser',
        icon : Eraser,
        color : "text-red-600"
    },
]
const Whiteboard = () => {
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI|null>(null);

    const saveTimeRef = useRef<any>(null);
    const {projectId} = useParams();
    const [activeTool, setActiveTool] = useState('selection');

    const handleCanvasChange = (elements : readonly any[], appState: any, files : any) => {
        //Cancel prev timer
        if(saveTimeRef?.current){
            clearTimeout(saveTimeRef.current);
        }

        //Start New 10 Second Timer
        saveTimeRef.current = setTimeout(() => {
            //save method
            // saveCanvasChanges(elements,appState,files);
            // toast.add({
            //     title : "Changes Saved",
            //     type : "Success"
            // })
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

    const changeTool = (tool:any) => {
        if(!excalidrawAPI) return;

        setActiveTool(tool);
        excalidrawAPI.setActiveTool({
            type: tool
        })
    }

  return (
    <div style={{ height: "90vh" }}>
        <Excalidraw 
        //@ts-ignore
        excalidrawAPI={(api)=> setExcalidrawAPI(api)} 
        onChange={handleCanvasChange}
        />
        <div className="absolute left-3 top-1/2 z-50 -translate-y-1/2
        flex flex-col gap-1 rounded-2xl bg-white border p-1.5 shadow-xl">
            {tools.map((tool) => {
                const Icon = tool.icon
                return (
                    <button className={`flex h-8 w-8 items-center justify-center rounded-xl transition
                     hover:bg-blue-100 hover:cursor-pointer
                     ${activeTool == tool.name ? "bg-blue-100":null}`}
                     onClick={() => changeTool(tool.name)}>
                        <Icon size="19" className={tool.color}/>
                    </button>
                )
            })}
        </div>
      </div>
  )
}

export default Whiteboard