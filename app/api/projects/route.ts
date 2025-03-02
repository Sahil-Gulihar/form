// app/api/projects/route.ts
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

    // Build filter object - only return projects created by this user
    // Admins can see all projects if needed
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const filter: any = {};

    // If user is not an admin, filter projects by user ID
    if (userData?.role !== "ADMIN") {
      filter.createdBy = user.id;
    }

    // Add other filters if provided
    if (district) filter.district = district;
    if (division) filter.division = division;
    if (projectName)
      filter.projectName = { contains: projectName, mode: "insensitive" };

    // Get total count for pagination
    const total = await prisma.project.count({ where: filter });

    // Get projects with pagination
    const projects = await prisma.project.findMany({
      where: filter,
      orderBy: { slNo: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
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

export async function POST(request: NextRequest) {
  try {
    // Get auth token to verify user is authenticated
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and extract user ID
    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create new project in database with user ID
    const project = await prisma.project.create({
      data: {
        projectName: data.projectName,
        nodalDepartment: data.nodalDepartment,
        division: data.division,
        district: data.district,
        lac: data.lac,
        fundSource: data.fundSource,
        aaNo: data.aaNo,
        estimatedValue: data.estimatedValue,
        pmcWorkOrderDate: data.pmcWorkOrderDate,
        worksWorkOrderDate: data.worksWorkOrderDate,
        consultantName: data.consultantName,
        contractorName: data.contractorName,
        physicalProgress: data.physicalProgress,
        financialProgress: data.financialProgress,
        completionDatePerTender: data.completionDatePerTender,
        expectedCompletionDate: data.expectedCompletionDate,
        provisions: data.provisions,
        landStatus: data.landStatus,
        remarks: data.remarks,
        branch: data.branch,
        // Connect project to the user who created it
        createdBy: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project added successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
