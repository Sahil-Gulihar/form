"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: string;
  projectName: string;
  district: string;
  division: string;
  user: { name: string; email: string };
}

export default function ProjectTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  const limit = 10;

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects?page=${page}&limit=${limit}`);
        const data = await res.json();
        if (res.ok) {
          setProjects(data.projects);
          setTotalPages(data.pagination.pages);
          setUserEmail(data.userData.email);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setLoading(false);
    }

    fetchProjects();
  }, [page]);

  return (
    <>
      <div className="flex justify-end items-end px-16 pt-2">{userEmail || "N/A"}</div>
      <Card className="w-full max-w-[90%] mt-6 mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Project List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Project Name</TableHead>
                      <TableHead className="w-1/4">District</TableHead>
                      <TableHead className="w-1/4">Division</TableHead>
                      <TableHead className="w-1/4">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow
                        key={project.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {project.projectName}
                        </TableCell>
                        <TableCell>
                          {project.district || (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {project.division || (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{project.user.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {project.user.email}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="min-w-[100px]"
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} ({projects.length} items)
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || loading}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="min-w-[100px]"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
