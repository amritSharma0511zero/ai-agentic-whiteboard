import { db, whiteboardData } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, elements, files, appState } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json("Unauthorized User", { status: 401 });
    }

    if (!projectId) {
      return NextResponse.json(
        "Project information missing",
        { status: 400 }
      );
    }

    const result = await db
      .insert(whiteboardData)
      .values({
        projectId,
        elements,
        appState,
        files,
      })
      .onConflictDoUpdate({
        target: whiteboardData.projectId,
        set: {
          elements,
          appState,
          files,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(result[0], { status: 200 });

  } catch (error) {
    console.error("Error saving whiteboard data:", error);

    return NextResponse.json(
      "Failed to save whiteboard data",
      { status: 500 }
    );
  }
}