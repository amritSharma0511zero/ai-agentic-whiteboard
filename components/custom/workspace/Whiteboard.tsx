"use client"

import { Excalidraw } from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Minus,
  MousePointer,
  Pencil,
  Square,
  Type,
} from "lucide-react"
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types"
import FloatingProperties from "./FloatingProperties"
import "./whiteboard.css"

const tools = [
  {
    name: "selection",
    icon: MousePointer,
    color: "text-blue-600",
  },
  {
    name: "hand",
    icon: Hand,
    color: "text-cyan-600",
  },
  {
    name: "rectangle",
    icon: Square,
    color: "text-blue-600",
  },
  {
    name: "diamond",
    icon: Diamond,
    color: "text-emerald-600",
  },
  {
    name: "ellipse",
    icon: Circle,
    color: "text-amber-600",
  },
  {
    name: "arrow",
    icon: ArrowRight,
    color: "text-violet-600",
  },
  {
    name: "line",
    icon: Minus,
    color: "text-pink-600",
  },
  {
    name: "freedraw",
    icon: Pencil,
    color: "text-orange-600",
  },
  {
    name: "text",
    icon: Type,
    color: "text-indigo-600",
  },
  {
    name: "image",
    icon: Image,
    color: "text-green-600",
  },
  {
    name: "eraser",
    icon: Eraser,
    color: "text-red-600",
  },
]

const Whiteboard = () => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null)

  const saveTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { projectId } = useParams()

  const [activeTool, setActiveTool] = useState("selection")

  const [selectedElement, setSelectedElement] = useState<any>(null)

  const [canvasState, setCanvasState] = useState<any>(null)

  // ---------------------------------------------------------
  // Handle canvas changes
  // ---------------------------------------------------------

  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    setCanvasState(appState)

    // Find selected element
    const selectedIds = Object.keys(
      appState.selectedElementIds || {}
    )

    if (selectedIds.length === 1) {
      const selectedId = selectedIds[0]

      const element = elements.find(
        (element) => element.id === selectedId
      )

      setSelectedElement(element || null)
    } else {
      setSelectedElement(null)
    }

    // Cancel previous save timer
    if (saveTimeRef.current) {
      clearTimeout(saveTimeRef.current)
    }

    // Save after 10 seconds of inactivity
    saveTimeRef.current = setTimeout(() => {
      saveCanvasChanges(elements, appState, files)
    }, 10000)
  }

  // ---------------------------------------------------------
  // Save canvas
  // ---------------------------------------------------------

  const saveCanvasChanges = async (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    try {
      await axios.post("/api/whiteboard", {
        elements,
        appState,
        files,
        projectId,
      })

      console.log("Canvas saved successfully")
    } catch (error) {
      console.error("Failed to save canvas:", error)
    }
  }

  // ---------------------------------------------------------
  // Change active tool
  // ---------------------------------------------------------

  const changeTool = (tool: string) => {
    if (!excalidrawAPI) return

    setActiveTool(tool)

    excalidrawAPI.setActiveTool({
      type: tool as any,
    })
  }

  // ---------------------------------------------------------
  // Floating toolbar position
  // ---------------------------------------------------------

  const getFloatingPosition = () => {
    if (!selectedElement || !canvasState) {
      return {
        left: 0,
        top: 0,
      }
    }

    const zoom = canvasState.zoom?.value ?? 1

    const scrollX = canvasState.scrollX ?? 0
    const scrollY = canvasState.scrollY ?? 0

    const centerX =
      selectedElement.x +
      selectedElement.width / 2

    const screenX =
      (centerX + scrollX) * zoom

    const screenY =
      (selectedElement.y + scrollY) * zoom

    return {
      left: screenX,
      top: screenY - 60,
    }
  }

  // ---------------------------------------------------------
  // Change selected element property
  // ---------------------------------------------------------

  const handlePropertyChange = (
    property: string,
    value: any
  ) => {
    if (!excalidrawAPI || !selectedElement) return

    const sceneElements =
      excalidrawAPI.getSceneElements()

    const updatedElements =
      sceneElements.map((element) => {
        if (
          element.id !==
          selectedElement.id
        ) {
          return element
        }

        let actualProperty = property
        let actualValue = value

        // ---------------------------------------------
        // Convert our UI property names to Excalidraw
        // property names
        // ---------------------------------------------

        if (property === "stroke") {
          actualProperty = "strokeColor"
        }

        if (property === "fill") {
          actualProperty = "backgroundColor"
        }

        // Excalidraw opacity is 0 -> 1
        // Our UI uses 0 -> 100
        if (property === "opacity") {
          actualValue = value / 100
        }

        return {
          ...element,

          [actualProperty]: actualValue,

          version: element.version + 1,

          versionNonce:
            Math.floor(
              Math.random() * 2147483647
            ),

          updated: Date.now(),
        }
      })

    excalidrawAPI.updateScene({
      elements: updatedElements,
    })
  }

  // ---------------------------------------------------------
  // Bring selected element to front
  // ---------------------------------------------------------

  const bringToFront = () => {
    if (!excalidrawAPI || !selectedElement) {
      return
    }

    const sceneElements =
      excalidrawAPI.getSceneElements()

    const selected = sceneElements.find(
      (element) =>
        element.id === selectedElement.id
    )

    if (!selected) return

    const remainingElements =
      sceneElements.filter(
        (element) =>
          element.id !== selectedElement.id
      )

    const updatedSelected = {
      ...selected,
      version: selected.version + 1,
      versionNonce:
        Math.floor(
          Math.random() * 2147483647
        ),
      updated: Date.now(),
    }

    excalidrawAPI.updateScene({
      elements: [
        ...remainingElements,
        updatedSelected,
      ],
    })
  }

  // ---------------------------------------------------------
  // Send selected element to back
  // ---------------------------------------------------------

  const sendToBack = () => {
    if (!excalidrawAPI || !selectedElement) {
      return
    }

    const sceneElements =
      excalidrawAPI.getSceneElements()

    const selected = sceneElements.find(
      (element) =>
        element.id === selectedElement.id
    )

    if (!selected) return

    const remainingElements =
      sceneElements.filter(
        (element) =>
          element.id !== selectedElement.id
      )

    const updatedSelected = {
      ...selected,
      version: selected.version + 1,
      versionNonce:
        Math.floor(
          Math.random() * 2147483647
        ),
      updated: Date.now(),
    }

    excalidrawAPI.updateScene({
      elements: [
        updatedSelected,
        ...remainingElements,
      ],
    })
  }

  const floatingPosition =
    getFloatingPosition()

  return (
    <div
      className="relative"
      style={{ height: "90vh" }}
    >
      {/* ------------------------------------------------ */}
      {/* EXCALIDRAW */}
      {/* ------------------------------------------------ */}

      <Excalidraw
        excalidrawAPI={(api) =>
          setExcalidrawAPI(api)
        }
        onChange={handleCanvasChange}
      />

      {/* ------------------------------------------------ */}
      {/* CUSTOM LEFT TOOLBAR */}
      {/* ------------------------------------------------ */}

      <div
        className="
          absolute
          left-3
          top-1/2
          z-50
          -translate-y-1/2
          flex
          flex-col
          gap-1
          rounded-2xl
          border
          bg-white
          p-1.5
          shadow-xl
        "
      >
        {tools.map((tool) => {
          const Icon = tool.icon

          return (
            <button
              key={tool.name}
              type="button"
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                transition
                hover:cursor-pointer
                hover:bg-blue-100
                ${
                  activeTool === tool.name
                    ? "bg-blue-100"
                    : ""
                }
              `}
              onClick={() =>
                changeTool(tool.name)
              }
            >
              <Icon
                size={19}
                className={tool.color}
              />
            </button>
          )
        })}
      </div>

      {/* ------------------------------------------------ */}
      {/* FLOATING PROPERTIES */}
      {/* ------------------------------------------------ */}

      <FloatingProperties
        selectedElement={selectedElement}
        position={floatingPosition}
        onPropertyChange={handlePropertyChange}

        // Duplicate
        onDuplicate={() => {
          if (
            !excalidrawAPI ||
            !selectedElement
          ) {
            return
          }

          const element =
            selectedElement

          excalidrawAPI.updateScene({
            elements: [
              ...excalidrawAPI.getSceneElements(),

              {
                ...element,

                id: crypto.randomUUID(),

                x: element.x + 20,
                y: element.y + 20,

                version: 1,

                versionNonce:
                  Math.floor(
                    Math.random() *
                      2147483647
                  ),

                updated: Date.now(),
              },
            ],
          })
        }}

        // Delete
        onDelete={() => {
          if (
            !excalidrawAPI ||
            !selectedElement
          ) {
            return
          }

          const remainingElements =
            excalidrawAPI
              .getSceneElements()
              .filter(
                (element) =>
                  element.id !==
                  selectedElement.id
              )

          excalidrawAPI.updateScene({
            elements:
              remainingElements,
          })

          setSelectedElement(null)
        }}

        // Lock / Unlock
        onToggleLock={() => {
          if (
            !excalidrawAPI ||
            !selectedElement
          ) {
            return
          }

          handlePropertyChange(
            "locked",
            !selectedElement.locked
          )
        }}

        // Bring to Front
        onBringToFront={
          bringToFront
        }

        // Send to Back
        onSendToBack={
          sendToBack
        }
      />
    </div>
  )
}

export default Whiteboard