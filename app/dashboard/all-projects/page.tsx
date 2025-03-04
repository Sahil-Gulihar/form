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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  projectName: string;
  district: string;
  division: string;
  user: { name: string; email: string };
  // Add other fields from your data
  slNo?: number;
  nodalDepartment?: string;
  lac?: string;
  fundSource?: string;
  aaNo?: string;
  estimatedValue?: string;
  pmcWorkOrderDate?: string;
  worksWorkOrderDate?: string;
  consultantName?: string;
  contractorName?: string;
  physicalProgress?: string;
  financialProgress?: string;
  completionDatePerTender?: string;
  expectedCompletionDate?: string;
  provisions?: string;
  landStatus?: string;
  remarks?: string;
  branch?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const router = useRouter();

  const limit = 10;

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/allProject?page=${page}&limit=${limit}&&allProjects=true`);
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
                      <TableHead className="w-1/6">Actions</TableHead>
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
                            <span>{project?.user?.name || "N/A"}</span>
                            <span className="text-sm text-muted-foreground">
                              {project?.user?.email || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(project)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Project Details</DialogTitle>
                              </DialogHeader>
                              {selectedProject && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <p className="font-semibold">Project Name:</p>
                                    <p>{selectedProject.projectName}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">District:</p>
                                    <p>{selectedProject.district || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Division:</p>
                                    <p>{selectedProject.division || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Created By:</p>
                                    <p>{selectedProject?.user?.name} ({selectedProject?.user?.email})</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Serial No:</p>
                                    <p>{selectedProject.slNo || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Nodal Department:</p>
                                    <p>{selectedProject.nodalDepartment || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">LAC:</p>
                                    <p>{selectedProject.lac || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Fund Source:</p>
                                    <p>{selectedProject.fundSource || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">AA No:</p>
                                    <p>{selectedProject.aaNo || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Estimated Value:</p>
                                    <p>{selectedProject.estimatedValue || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">PMC Work Order Date:</p>
                                    <p>{selectedProject.pmcWorkOrderDate || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Works Work Order Date:</p>
                                    <p>{selectedProject.worksWorkOrderDate || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Consultant Name:</p>
                                    <p>{selectedProject.consultantName || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Contractor Name:</p>
                                    <p>{selectedProject.contractorName || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Physical Progress:</p>
                                    <p>{selectedProject.physicalProgress || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Financial Progress:</p>
                                    <p>{selectedProject.financialProgress || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Completion Date (Tender):</p>
                                    <p>{selectedProject.completionDatePerTender || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Expected Completion:</p>
                                    <p>{selectedProject.expectedCompletionDate || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Provisions:</p>
                                    <p>{selectedProject.provisions || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Land Status:</p>
                                    <p>{selectedProject.landStatus || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Remarks:</p>
                                    <p>{selectedProject.remarks || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Branch:</p>
                                    <p>{selectedProject.branch || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Created At:</p>
                                    <p>{selectedProject.createdAt || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Updated At:</p>
                                    <p>{selectedProject.updatedAt || "N/A"}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

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