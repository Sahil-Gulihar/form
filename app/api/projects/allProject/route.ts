import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/database/db";

export async function GET(request: NextRequest) {
  try {
    // Get auth token to verify user is authenticated
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and extract user ID
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const district = searchParams.get("district");
    const division = searchParams.get("division");
    const projectName = searchParams.get("projectName");

    // Get user data to check role
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, name: true, email: true },
    });

    // Build filter object
    const filter: any = {};

    // Add optional filters
    if (district) filter.district = district;
    if (division) filter.division = division;
    if (projectName) filter.name = { contains: projectName, mode: 'insensitive' };

    // Get total count for pagination
    const total = await prisma.project.count({ where: filter });

    // Get projects with creator details
    const projects = await prisma.project.findMany({
      where: filter,
      orderBy: { slNo: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { name: true, email: true }, // Include creator's name and email
        },
      },
    });

    return NextResponse.json({
      userData,
      projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}