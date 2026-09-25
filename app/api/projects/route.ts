import { db, projects } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectName, projectId } = await req.json();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!projectId || !projectName) {
      return NextResponse.json(
        { error: "Project information missing" },
        { status: 400 }
      );
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(projects)
      .values({
        projectId,
        projectName: projectName.trim(),
        userEmail: email,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });

  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}