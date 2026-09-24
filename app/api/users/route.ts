
import { db, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "User email not found" },
        { status: 400 }
      );
    }

    // Check if user already exists in database
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userData.length > 0) {
      return NextResponse.json(userData[0], { status: 200 });
    }

    // Create new user
    const result = await db
      .insert(users)
      .values({
        name: user.fullName ?? "",
        email: email,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("User API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}