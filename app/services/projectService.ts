// @ts-nocheck
import { Project } from "@prisma/client";

interface PaginationParams {
  page?: number;
  limit?: number;
  district?: string;
  division?: string;
  projectName?: string;
}

interface PaginatedResponse {
  projects: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Get all projects with optional pagination and filters
export async function getProjects(
  params?: PaginationParams
): Promise<PaginatedResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.district) queryParams.append("district", params.district);
  if (params?.division) queryParams.append("division", params.division);
  if (params?.projectName)
    queryParams.append("projectName", params.projectName);

  const response = await fetch(`/api/projects?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch projects");
  }

  return response.json();
}

// Get a single project by ID
export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch project");
  }

  return response.json();
}

// Create a new project
export async function createProject(
  projectData: Omit<
    Project,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >
): Promise<Project> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create project");
  }

  const data = await response.json();
  return data.project;
}

// Update an existing project
export async function updateProject(
  id: string,
  projectData: Partial<Project>
): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update project");
  }

  const data = await response.json();
  return data.project;
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete project");
  }
}
