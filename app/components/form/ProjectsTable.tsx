import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Download } from "lucide-react";

const ProjectsTable = ({ projects, handleDeleteProject, generateExcel }) => {
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-500 h-2.5"></div>
      <CardHeader className="pb-2 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-800 flex items-center">
              Projects List
              <Badge className="ml-2 bg-green-100 text-green-800 border-0">
                {projects.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              {projects.length} project{projects.length !== 1 && "s"} added
              successfully
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateExcel}
            className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 hover:bg-green-100 shadow-sm hover:shadow transition-all"
          >
            <Download className="mr-1 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[80px]">Sl. No</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Department
                </TableHead>
                <TableHead className="hidden md:table-cell">District</TableHead>
                <TableHead className="hidden md:table-cell">
                  Est. Value (Cr.)
                </TableHead>
                <TableHead className="text-right w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{project.slNo}</TableCell>
                  <TableCell className="font-medium">
                    <div>{project.projectName}</div>
                    <div className="text-xs text-gray-500 md:hidden mt-1">
                      {project.nodalDepartment} • {project.district}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {project.nodalDepartment}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {project.district}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{project.estimatedValue}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      onClick={() => handleDeleteProject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectsTable;
