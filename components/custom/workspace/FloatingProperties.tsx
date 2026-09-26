"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  Copy,
  Diamond,
  Image as ImageIcon,
  Lock,
  MoreHorizontal,
  Palette,
  Pencil,
  Settings2,
  Square,
  Trash2,
  Type,
  Unlock,
} from "lucide-react";

type ElementType =
  | "rectangle"
  | "ellipse"
  | "diamond"
  | "text"
  | "line"
  | "arrow"
  | "freedraw"
  | "image";

type SelectedElement = {
  id?: string;

  type: ElementType;

  text?: string;

  fontSize?: number;
  fontFamily?: number | string;
  textAlign?: "left" | "center" | "right";

  stroke?: string;
  strokeColor?: string;

  fill?: string;
  backgroundColor?: string;

  strokeWidth?: number;
  strokeStyle?: "solid" | "dashed" | "dotted";

  opacity?: number;

  locked?: boolean;

  startArrowhead?: string | null;
  endArrowhead?: string | null;

  [key: string]: any;
};

type Props = {
  selectedElement: SelectedElement | null;

  position: {
    left: number;
    top: number;
  };

  onPropertyChange: (
    property: string,
    value: any
  ) => void;

  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleLock?: () => void;

  onBringToFront?: () => void;
  onSendToBack?: () => void;
};

type OpenPanel =
  | "color"
  | "properties"
  | "layer"
  | "more"
  | null;

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const FILL_COLORS = [
  "transparent",

  // Dark / Black
  "#000000",
  "#111827",
  "#1f2937",
  "#374151",

  // Dark Red
  "#450a0a",
  "#7f1d1d",
  "#991b1b",

  // Dark Orange / Brown
  "#431407",
  "#7c2d12",

  // Dark Green
  "#052e16",
  "#14532d",
  "#166534",

  // Dark Cyan / Teal
  "#083344",
  "#164e63",

  // Dark Blue
  "#172554",
  "#1e3a8a",
  "#1e40af",

  // Dark Purple
  "#1e1b4b",
  "#312e81",
  "#581c87",

  // Dark Pink
  "#500724",
  "#831843",

  // White
  "#ffffff",
];

/* =========================================================
   COLOR HELPERS
========================================================= */

/**
 * Converts HEX color + opacity to RGBA.
 *
 * Example:
 * #3b82f6 + 50
 * =>
 * rgba(59, 130, 246, 0.5)
 */
function hexToRgba(
  hex: string,
  opacity: number
) {
  if (
    !hex ||
    hex === "transparent"
  ) {
    return "rgba(0, 0, 0, 0)";
  }

  let cleanHex = hex.replace(
    "#",
    ""
  );

  // Convert #fff -> #ffffff
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map(
        (char) => char + char
      )
      .join("");
  }

  const r = parseInt(
    cleanHex.substring(0, 2),
    16
  );

  const g = parseInt(
    cleanHex.substring(2, 4),
    16
  );

  const b = parseInt(
    cleanHex.substring(4, 6),
    16
  );

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Converts rgba/rgb/hex into:
 *
 * {
 *   color: "#3b82f6",
 *   opacity: 0.5
 * }
 */
function getColorAndOpacity(
  color?: string
) {
  if (
    !color ||
    color === "transparent"
  ) {
    return {
      color: "transparent",
      opacity: 0,
    };
  }

  /*
   * rgba(...)
   */
  const rgbaMatch =
    color.match(
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i
    );

  if (rgbaMatch) {
    const r = Number(
      rgbaMatch[1]
    );

    const g = Number(
      rgbaMatch[2]
    );

    const b = Number(
      rgbaMatch[3]
    );

    const opacity =
      rgbaMatch[4] !== undefined
        ? Number(
            rgbaMatch[4]
          )
        : 1;

    const toHex = (
      value: number
    ) =>
      value
        .toString(16)
        .padStart(2, "0");

    return {
      color: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
      opacity,
    };
  }

  /*
   * HEX
   */
  if (color.startsWith("#")) {
    return {
      color,
      opacity: 1,
    };
  }

  return {
    color,
    opacity: 1,
  };
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Divider() {
  return (
    <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
      {children}
    </div>
  );
}

function ToolbarIcon({
  children,
  active = false,
  title,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
        active
          ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );
}

function ColorDot({
  color,
  selected,
  onClick,
}: {
  color: string;
  selected?: boolean;
  onClick: () => void;
}) {
  const isTransparent =
    color === "transparent";

  return (
    <button
      type="button"
      onClick={onClick}
      title={color}
      className={`h-7 w-7 rounded-full border-2 transition hover:scale-110 ${
        selected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-neutral-300 dark:border-neutral-600"
      }`}
      style={{
        backgroundColor:
          isTransparent
            ? "#ffffff"
            : color,

        backgroundImage:
          isTransparent
            ? "linear-gradient(45deg,#d4d4d4 25%,transparent 25%,transparent 75%,#d4d4d4 75%),linear-gradient(45deg,#d4d4d4 25%,#ffffff 25%,#ffffff 75%,#d4d4d4 75%)"
            : undefined,

        backgroundSize:
          isTransparent
            ? "8px 8px"
            : undefined,

        backgroundPosition:
          isTransparent
            ? "0 0,4px 4px"
            : undefined,
      }}
    />
  );
}

/* =========================================================
   COLOR PANEL
========================================================= */

function ColorPanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  const isText =
    element.type === "text";

  const currentStroke =
    element.strokeColor ??
    element.stroke ??
    "#000000";

  const currentFill =
    element.backgroundColor ??
    element.fill ??
    "transparent";

  /*
   * Get current fill color
   * and opacity.
   */
  const fillInfo =
    getColorAndOpacity(
      currentFill
    );

  const fillOpacity = Math.round(
    fillInfo.opacity * 100
  );

  /*
   * Change ONLY fill opacity.
   */
  const changeFillOpacity = (
    opacity: number
  ) => {
    /*
     * If transparent is selected,
     * there is no actual color to
     * apply opacity to.
     */
    if (
      fillInfo.color ===
        "transparent" ||
      !fillInfo.color
    ) {
      return;
    }

    const rgba =
      hexToRgba(
        fillInfo.color,
        opacity / 100
      );

    onChange(
      "backgroundColor",
      rgba
    );
  };

  /*
   * Change fill color while
   * preserving opacity.
   */
  const changeFillColor = (
    color: string
  ) => {
    if (
      color === "transparent"
    ) {
      onChange(
        "backgroundColor",
        "transparent"
      );

      return;
    }

    const rgba =
      hexToRgba(
        color,
        fillInfo.opacity
      );

    onChange(
      "backgroundColor",
      rgba
    );
  };

  return (
    <div className="w-[260px]">
      {/* =====================================================
          STROKE / TEXT COLOR
      ====================================================== */}

      <SectionLabel>
        {isText
          ? "Text Color"
          : "Stroke Color"}
      </SectionLabel>

      <div className="grid grid-cols-5 gap-2">
        {COLORS.map((color) => (
          <ColorDot
            key={color}
            color={color}
            selected={
              currentStroke ===
              color
            }
            onClick={() =>
              onChange(
                "strokeColor",
                color
              )
            }
          />
        ))}
      </div>

      {/* =====================================================
          FILL COLOR
      ====================================================== */}

      {![
        "text",
        "line",
        "arrow",
        "freedraw",
      ].includes(
        element.type
      ) && (
        <>
          <div className="my-3 h-px bg-neutral-200 dark:bg-neutral-700" />

          <SectionLabel>
            Fill Color
          </SectionLabel>

          <div className="grid grid-cols-5 gap-2">
            {FILL_COLORS.map(
              (color) => {
                const selected =
                  color ===
                    "transparent"
                    ? currentFill ===
                      "transparent"
                    : fillInfo.color ===
                      color;

                return (
                  <ColorDot
                    key={color}
                    color={color}
                    selected={
                      selected
                    }
                    onClick={() =>
                      changeFillColor(
                        color
                      )
                    }
                  />
                );
              }
            )}
          </div>

          {/* =================================================
              FILL OPACITY
          ================================================== */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                Fill Opacity
              </span>

              <span className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {fillOpacity}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={
                fillOpacity
              }
              disabled={
                fillInfo.color ===
                "transparent"
              }
              onChange={(e) =>
                changeFillOpacity(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full cursor-pointer accent-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            />

            <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   SHAPE PANEL
========================================================= */

function ShapePanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  const title =
    element.type ===
    "rectangle"
      ? "Rectangle"
      : element.type ===
        "ellipse"
      ? "Ellipse"
      : "Diamond";

  return (
    <div className="w-[260px]">
      <SectionLabel>
        {title} Properties
      </SectionLabel>

      {/* Border Width */}

      <div className="mb-4">
        <div className="mb-2 text-xs text-neutral-500">
          Border Width
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 8].map(
            (width) => (
              <button
                key={width}
                type="button"
                onClick={() =>
                  onChange(
                    "strokeWidth",
                    width
                  )
                }
                className={`rounded-md border px-2 py-2 text-xs ${
                  element.strokeWidth ===
                  width
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                }`}
              >
                {width}
              </button>
            )
          )}
        </div>
      </div>

      {/* Border Style */}

      <div>
        <div className="mb-2 text-xs text-neutral-500">
          Border Style
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            "solid",
            "dashed",
            "dotted",
          ].map((style) => (
            <button
              key={style}
              type="button"
              onClick={() =>
                onChange(
                  "strokeStyle",
                  style
                )
              }
              className={`rounded-md border px-2 py-2 text-xs capitalize ${
                element.strokeStyle ===
                style
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TEXT PANEL
========================================================= */

function TextPanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  return (
    <div className="w-[260px]">
      <SectionLabel>
        Text Properties
      </SectionLabel>

      {/* Font Size */}

      <div className="mb-4">
        <div className="mb-2 text-xs text-neutral-500">
          Font Size
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            12,
            16,
            20,
            24,
            32,
            40,
            48,
            64,
          ].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                onChange(
                  "fontSize",
                  size
                )
              }
              className={`rounded-md border px-2 py-2 text-xs ${
                element.fontSize ===
                size
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}

      <div className="mb-4">
        <div className="mb-2 text-xs text-neutral-500">
          Alignment
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            "left",
            "center",
            "right",
          ].map((align) => (
            <button
              key={align}
              type="button"
              onClick={() =>
                onChange(
                  "textAlign",
                  align
                )
              }
              className={`rounded-md border px-2 py-2 text-xs capitalize ${
                element.textAlign ===
                align
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}

      <div>
        <div className="mb-2 text-xs text-neutral-500">
          Font Family
        </div>

        <div className="space-y-2">
          {[
            {
              name: "Normal",
              value: 1,
            },
            {
              name: "Hand",
              value: 2,
            },
            {
              name: "Mono",
              value: 3,
            },
          ].map((font) => (
            <button
              key={font.name}
              type="button"
              onClick={() =>
                onChange(
                  "fontFamily",
                  font.value
                )
              }
              className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                element.fontFamily ===
                font.value
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LINE PANEL
========================================================= */

function LinePanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  return (
    <div className="w-[260px]">
      <SectionLabel>
        Line Properties
      </SectionLabel>

      <div className="mb-4">
        <div className="mb-2 text-xs text-neutral-500">
          Line Width
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 8].map(
            (width) => (
              <button
                key={width}
                type="button"
                onClick={() =>
                  onChange(
                    "strokeWidth",
                    width
                  )
                }
                className={`rounded-md border px-2 py-2 text-xs ${
                  element.strokeWidth ===
                  width
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"
                }`}
              >
                {width}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs text-neutral-500">
          Line Style
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            "solid",
            "dashed",
            "dotted",
          ].map((style) => (
            <button
              key={style}
              type="button"
              onClick={() =>
                onChange(
                  "strokeStyle",
                  style
                )
              }
              className={`rounded-md border px-2 py-2 text-xs capitalize ${
                element.strokeStyle ===
                style
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ARROW PANEL
========================================================= */

function ArrowPanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  return (
    <div className="w-[260px]">
      <SectionLabel>
        Arrow Properties
      </SectionLabel>

      {/* Arrow Head */}

      <div className="mb-4">
        <div className="mb-2 text-xs text-neutral-500">
          Arrow Head
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            {
              name: "None",
              value: null,
            },
            {
              name: "Arrow",
              value: "arrow",
            },
            {
              name: "Triangle",
              value: "triangle",
            },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                onChange(
                  "endArrowhead",
                  item.value
                )
              }
              className={`rounded-md border px-2 py-2 text-xs ${
                element.endArrowhead ===
                item.value
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Width */}

      <div className="mb-4">
        <div className="mb-2 text-xs text-neutral-500">
          Width
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 8].map(
            (width) => (
              <button
                key={width}
                type="button"
                onClick={() =>
                  onChange(
                    "strokeWidth",
                    width
                  )
                }
                className={`rounded-md border px-2 py-2 text-xs ${
                  element.strokeWidth ===
                  width
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"
                }`}
              >
                {width}
              </button>
            )
          )}
        </div>
      </div>

      {/* Style */}

      <div>
        <div className="mb-2 text-xs text-neutral-500">
          Style
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            "solid",
            "dashed",
            "dotted",
          ].map((style) => (
            <button
              key={style}
              type="button"
              onClick={() =>
                onChange(
                  "strokeStyle",
                  style
                )
              }
              className={`rounded-md border px-2 py-2 text-xs capitalize ${
                element.strokeStyle ===
                style
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FREE DRAW PANEL
========================================================= */

function FreeDrawPanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  return (
    <div className="w-[260px]">
      <SectionLabel>
        Free Draw Properties
      </SectionLabel>

      <div>
        <div className="mb-2 text-xs text-neutral-500">
          Pen Width
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 8].map(
            (width) => (
              <button
                key={width}
                type="button"
                onClick={() =>
                  onChange(
                    "strokeWidth",
                    width
                  )
                }
                className={`rounded-md border px-2 py-2 text-xs ${
                  element.strokeWidth ===
                  width
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"
                }`}
              >
                {width}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   IMAGE PANEL
========================================================= */

function ImagePanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  const opacity = Math.round(
    (element.opacity ?? 1) *
      100
  );

  return (
    <div className="w-[260px]">
      <SectionLabel>
        Image Properties
      </SectionLabel>

      <div className="mb-4 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
        <div className="text-sm font-medium">
          Image
        </div>

        <div className="mt-1 text-xs text-neutral-500">
          Adjust image appearance.
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Opacity
          </span>

          <span className="text-xs font-medium">
            {opacity}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) =>
            onChange(
              "opacity",
              Number(
                e.target.value
              ) / 100
            )
          }
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}

/* =========================================================
   PROPERTIES PANEL
========================================================= */

function PropertiesPanel({
  element,
  onChange,
}: {
  element: SelectedElement;

  onChange: (
    property: string,
    value: any
  ) => void;
}) {
  switch (element.type) {
    case "rectangle":
    case "ellipse":
    case "diamond":
      return (
        <ShapePanel
          element={element}
          onChange={onChange}
        />
      );

    case "text":
      return (
        <TextPanel
          element={element}
          onChange={onChange}
        />
      );

    case "line":
      return (
        <LinePanel
          element={element}
          onChange={onChange}
        />
      );

    case "arrow":
      return (
        <ArrowPanel
          element={element}
          onChange={onChange}
        />
      );

    case "freedraw":
      return (
        <FreeDrawPanel
          element={element}
          onChange={onChange}
        />
      );

    case "image":
      return (
        <ImagePanel
          element={element}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
}

/* =========================================================
   LAYER PANEL
========================================================= */

function LayerPanel({
  onBringToFront,
  onSendToBack,
}: {
  onBringToFront?: () => void;
  onSendToBack?: () => void;
}) {
  return (
    <div className="w-[220px]">
      <SectionLabel>
        Layer
      </SectionLabel>

      <div className="space-y-1">
        <button
          type="button"
          onClick={onBringToFront}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowUp size={16} />

          <span>
            Bring to front
          </span>
        </button>

        <button
          type="button"
          onClick={onSendToBack}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowDown size={16} />

          <span>
            Send to back
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MORE PANEL
========================================================= */

function MorePanel({
  element,
  onDuplicate,
  onDelete,
  onToggleLock,
}: {
  element: SelectedElement;

  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleLock?: () => void;
}) {
  return (
    <div className="w-[220px]">
      <SectionLabel>
        More Actions
      </SectionLabel>

      <div className="space-y-1">
        <button
          type="button"
          onClick={onDuplicate}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Copy size={16} />

          <span>
            Duplicate
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleLock}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          {element.locked ? (
            <Unlock size={16} />
          ) : (
            <Lock size={16} />
          )}

          <span>
            {element.locked
              ? "Unlock"
              : "Lock"}
          </span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 size={16} />

          <span>
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FloatingProperties({
  selectedElement,
  position,
  onPropertyChange,
  onDuplicate,
  onDelete,
  onToggleLock,
  onBringToFront,
  onSendToBack,
}: Props) {
  const [openPanel, setOpenPanel] =
    useState<OpenPanel>(null);

  /*
   * Don't show anything when
   * there is no selected element.
   */
  if (!selectedElement) {
    return null;
  }

  /*
   * Open / close individual
   * panels.
   */
  const togglePanel = (
    panel: Exclude<
      OpenPanel,
      null
    >
  ) => {
    setOpenPanel(
      (current) =>
        current === panel
          ? null
          : panel
    );
  };

  /* =========================================================
     ELEMENT NAME
  ========================================================= */

  const getElementName = () => {
    switch (
      selectedElement.type
    ) {
      case "rectangle":
        return "Rectangle";

      case "ellipse":
        return "Ellipse";

      case "diamond":
        return "Diamond";

      case "text":
        return "Text";

      case "arrow":
        return "Arrow";

      case "line":
        return "Line";

      case "freedraw":
        return "Free Draw";

      case "image":
        return "Image";

      default:
        return "Element";
    }
  };

  /* =========================================================
     ELEMENT ICON
  ========================================================= */

  const getElementIcon = () => {
    switch (
      selectedElement.type
    ) {
      case "rectangle":
        return <Square size={16} />;

      case "ellipse":
        return <Circle size={16} />;

      case "diamond":
        return <Diamond size={16} />;

      case "text":
        return <Type size={16} />;

      case "arrow":
        return <ArrowRight size={16} />;

      case "line":
        return (
          <div className="h-[2px] w-4 bg-current" />
        );

      case "freedraw":
        return <Pencil size={16} />;

      case "image":
        return (
          <ImageIcon size={16} />
        );

      default:
        return (
          <Settings2 size={16} />
        );
    }
  };

  /* =========================================================
     PANEL RENDERER
  ========================================================= */

  const renderPanel = () => {
    /*
     * COLOR
     */
    if (
      openPanel === "color"
    ) {
      return (
        <ColorPanel
          element={
            selectedElement
          }
          onChange={
            onPropertyChange
          }
        />
      );
    }

    /*
     * ELEMENT PROPERTIES
     */
    if (
      openPanel ===
      "properties"
    ) {
      return (
        <PropertiesPanel
          element={
            selectedElement
          }
          onChange={
            onPropertyChange
          }
        />
      );
    }

    /*
     * LAYER
     */
    if (
      openPanel === "layer"
    ) {
      return (
        <LayerPanel
          onBringToFront={
            onBringToFront
          }
          onSendToBack={
            onSendToBack
          }
        />
      );
    }

    /*
     * MORE
     */
    if (
      openPanel === "more"
    ) {
      return (
        <MorePanel
          element={
            selectedElement
          }
          onDuplicate={
            onDuplicate
          }
          onDelete={onDelete}
          onToggleLock={
            onToggleLock
          }
        />
      );
    }

    return null;
  };

  return (
    <div
      className="absolute z-[1000]"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">

        {/* Selected Element */}

        <div className="flex h-8 items-center gap-2 rounded-lg bg-neutral-100 px-2.5 text-sm dark:bg-neutral-800">
          {getElementIcon()}

          <span className="font-medium">
            {getElementName()}
          </span>
        </div>

        <Divider />

        {/* COLOR */}

        <ToolbarIcon
          title="Color"
          active={
            openPanel === "color"
          }
          onClick={() =>
            togglePanel(
              "color"
            )
          }
        >
          <Palette size={16} />
        </ToolbarIcon>

        {/* PROPERTIES */}

        <ToolbarIcon
          title="Properties"
          active={
            openPanel ===
            "properties"
          }
          onClick={() =>
            togglePanel(
              "properties"
            )
          }
        >
          <Settings2 size={16} />
        </ToolbarIcon>

        {/* LAYER */}

        <ToolbarIcon
          title="Layer"
          active={
            openPanel ===
            "layer"
          }
          onClick={() =>
            togglePanel(
              "layer"
            )
          }
        >
          <ArrowUp size={16} />
        </ToolbarIcon>

        <Divider />

        {/* DUPLICATE */}

        <ToolbarIcon
          title="Duplicate"
          onClick={
            onDuplicate
          }
        >
          <Copy size={16} />
        </ToolbarIcon>

        {/* LOCK */}

        <ToolbarIcon
          title={
            selectedElement.locked
              ? "Unlock"
              : "Lock"
          }
          onClick={
            onToggleLock
          }
        >
          {selectedElement.locked ? (
            <Unlock size={16} />
          ) : (
            <Lock size={16} />
          )}
        </ToolbarIcon>

        {/* DELETE */}

        <ToolbarIcon
          title="Delete"
          onClick={onDelete}
        >
          <Trash2
            size={16}
            className="text-red-500"
          />
        </ToolbarIcon>

        {/* MORE */}

        <ToolbarIcon
          title="More"
          active={
            openPanel === "more"
          }
          onClick={() =>
            togglePanel("more")
          }
        >
          <MoreHorizontal
            size={16}
          />
        </ToolbarIcon>
      </div>

      {/* =====================================================
          FLOATING PANEL
      ====================================================== */}

      {openPanel !== null && (
        <div className="absolute left-0 top-[48px] rounded-xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          {renderPanel()}
        </div>
      )}
    </div>
  );
}