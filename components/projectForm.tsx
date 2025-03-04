//@ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  consultants,
  departments,
  divisions,
  districts,
  lacs,
  contractors,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BadgeCheck,
  Trash2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Copyright,
  Download,
  Save,
  FileX,
  InfoIcon,
  Search,
  X,
  CheckCircle2,
  Circle,
  ChevronRight,
  MenuIcon,
  FileText,
  EyeOff,
  Eye,
  Edit,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";

const ProjectForm = () => {
  const initialFormData = {
    slNo: "",
    projectName: "",
    nodalDepartment: "",
    division: "",
    district: "",
    lac: "",
    fundSource: "",
    aaNo: "",
    estimatedValue: "",
    pmcWorkOrderDate: "",
    worksWorkOrderDate: "",
    consultantName: "",
    contractorName: "",
    physicalProgress: "",
    financialProgress: "",
    completionDatePerTender: "",
    expectedCompletionDate: "",
    provisions: "",
    landStatus: "",
    remarks: "",
    branch: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [projects, setProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formCompletion, setFormCompletion] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    district: "all",
    division: "all",
    projectName: "",
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [paginationData.page, filters]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      // Build query params for filtering and pagination
      const queryParams = new URLSearchParams();
      queryParams.append("page", paginationData.page.toString());
      queryParams.append("limit", paginationData.limit.toString());

      if (filters.district && filters.district !== "all")
        queryParams.append("district", filters.district);
      if (filters.division && filters.division !== "all")
        queryParams.append("division", filters.division);
      if (filters.projectName)
        queryParams.append("projectName", filters.projectName);

      // Make actual API request
      const response = await fetch(`/api/projects?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.projects);
      setPaginationData(data.pagination);
    } catch (error) {
      setErrorMessage(error.message || "Error fetching projects");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    // Reset to first page when applying new filters
    setPaginationData((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      district: "all",
      division: "all",
      projectName: "",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for this field as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Calculate form completion percentage
    calculateFormCompletion();
  };

  const calculateFormCompletion = () => {
    const requiredFields = fieldGroups
      .flatMap((group) => group.fields)
      .filter((field) => field.required)
      .map((field) => field.name);

    const filledRequiredFields = requiredFields.filter((fieldName) =>
      formData[fieldName]?.trim()
    );

    const percentage = Math.round(
      (filledRequiredFields.length / requiredFields.length) * 100
    );

    setFormCompletion(percentage);
  };

  const validateForm = (tabId) => {
    const currentGroup = fieldGroups.find((group) => group.id === tabId);
    const newErrors = {};
    let isValid = true;

    currentGroup.fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    setFormErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Validate only required fields before submission
    const allErrors = {};
    let isValid = true;

    fieldGroups.forEach((group) => {
      group.fields.forEach((field) => {
        if (field.required && !formData[field.name]?.trim()) {
          allErrors[field.name] = `${field.label} is required`;
          isValid = false;
        }
      });
    });

    setFormErrors(allErrors);

    if (!isValid) {
      setErrorMessage("Please fill all required fields across all tabs");
      setIsLoading(false);
      return;
    }

    try {
      let response;

      if (isEditMode) {
        // Update existing project via API
        response = await fetch(`/api/projects/${currentProjectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new project via API
        response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save project");
      }

      const responseData = await response.json();

      // Refresh the projects list to get updated data
      await fetchProjects();

      // Reset form
      setFormData(initialFormData);
      setIsEditMode(false);
      setCurrentProjectId(null);

      // Show success message
      setSuccessMessage(
        isEditMode
          ? "Project updated successfully!"
          : "Project added successfully!"
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      // Reset to first tab
      setActiveTab("basic");

      // Clear all errors
      setFormErrors({});

      // Reset form completion
      setFormCompletion(0);
    } catch (error) {
      setErrorMessage(error.message || "Error saving project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        setIsLoading(true);

        // Make actual API request to delete project
        const response = await fetch(`/api/projects/${projectToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete project");
        }

        // Refresh the projects list
        await fetchProjects();

        setProjectToDelete(null);

        // Show success message
        setSuccessMessage("Project deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage(error.message || "Error deleting project");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditProject = async (projectId) => {
    try {
      setIsLoading(true);

      // Make actual API request to get project details
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch project details");
      }

      const projectData = await response.json();

      // Populate form with project data
      setFormData(projectData);
      setIsEditMode(true);
      setCurrentProjectId(projectId);

      // Calculate form completion
      calculateFormCompletion();

      // Set active tab to basic
      setActiveTab("basic");

      // Scroll to form
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(error.message || "Error fetching project");
    } finally {
      setIsLoading(false);
    }
  };

  const generateExcel = () => {
    // Create CSV string
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent +=
      "Sl. no,Name of Project,Name of Nodal Department,Name of Division,Name of District,Name of LAC,Source of Fund,AA No.,Estimated Value in Cr.,Work Order Date (PMC / Consultancy),Work Order Date (works),Name of Consultant/ PMC,Name of Contractor,Physical Progress in Percentage,Financial Progress in Percentage,Date of Completion as per Tender,Expected Date of Completion,Provisions,Land Status,Remarks,Branch\n";

    // Add project data
    projects.forEach((project) => {
      csvContent += `${project.slNo || ""},${project.projectName || ""},${
        project.nodalDepartment || ""
      },${project.division || ""},${project.district || ""},${
        project.lac || ""
      },${project.fundSource || ""},${project.aaNo || ""},${
        project.estimatedValue || ""
      },${project.pmcWorkOrderDate || ""},${project.worksWorkOrderDate || ""},${
        project.consultantName || ""
      },${project.contractorName || ""},${project.physicalProgress || ""},${
        project.financialProgress || ""
      },${project.completionDatePerTender || ""},${
        project.expectedCompletionDate || ""
      },${project.provisions || ""},${project.landStatus || ""},${
        project.remarks || ""
      },${project.branch || ""}\n`;
    });

    // Create download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Project_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigateTab = (direction) => {
    const currentIndex = fieldGroups.findIndex(
      (group) => group.id === activeTab
    );

    if (direction === "next") {
      if (currentIndex < fieldGroups.length - 1) {
        // Validate current tab before proceeding
        if (validateForm(activeTab)) {
          setActiveTab(fieldGroups[currentIndex + 1].id);
        }
      }
    } else {
      if (currentIndex > 0) {
        setActiveTab(fieldGroups[currentIndex - 1].id);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setFormCompletion(0);
    setActiveTab("basic");
    setIsEditMode(false);
    setCurrentProjectId(null);
  };

  // Jump to tab containing field
  const jumpToField = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationData.pages) {
      setPaginationData((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // Create a custom searchable select component
  const SearchableSelect = ({
    name,
    value,
    options,
    onValueChange,
    required,
    error,
  }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="relative">
        <Select
          value={value}
          onValueChange={(value) => {
            onValueChange({ target: { name, value } });
            setSearchQuery("");
          }}
          required={required}
          open={open}
          onOpenChange={setOpen}
        >
          <SelectTrigger
            className={
              error
                ? "border-red-300 focus:ring-red-500 bg-red-50"
                : "focus:ring-blue-500"
            }
          >
            <SelectValue placeholder={`Select ${name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 pb-0">
              <div className="flex items-center space-x-2 border rounded-md px-3 py-2 mb-2 bg-slate-50">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  className="w-full bg-transparent border-none focus:outline-none text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-[200px] overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const fieldGroups = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Enter the fundamental details about the project",
      fields: [
        {
          name: "projectName",
          label: "Name of Project",
          type: "text",
          required: true,
          help: "Enter the official name of the project as per documents",
        },
        {
          name: "nodalDepartment",
          label: "Name of Nodal Department",
          type: "text",
          required: true,
          help: "The primary department responsible for this project",
        },
        {
          name: "division",
          label: "Name of Division",
          type: "text",
          required: true,
          help: "Administrative division managing the project",
        },
        {
          name: "district",
          label: "Name of District",
          type: "text",
          required: true,
          help: "District where the project is located",
        },
        {
          name: "lac",
          label: "Name of LAC",
          type: "text",
          required: false,
          help: "Legislative Assembly Constituency",
        },
        {
          name: "branch",
          label: "Branch",
          type: "text",
          required: false,
          help: "Branch office responsible (if applicable)",
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Details",
      description: "Enter financial information about the project",
      fields: [
        {
          name: "fundSource",
          label: "Source of Fund",
          type: "text",
          required: true,
          help: "Funding source or scheme name",
        },
        {
          name: "aaNo",
          label: "AA No.",
          type: "text",
          required: true,
          help: "Administrative Approval Number",
        },
        {
          name: "estimatedValue",
          label: "Estimated Value in Cr.",
          type: "number",
          step: "0.01",
          required: true,
          help: "Total project value in Crores",
        },
        {
          name: "financialProgress",
          label: "Financial Progress in Percentage",
          type: "number",
          min: "0",
          max: "100",
          required: false,
          help: "Current financial utilization as percentage",
        },
      ],
    },
    {
      id: "execution",
      title: "Execution Details",
      description: "Enter details about project execution and contractors",
      fields: [
        {
          name: "pmcWorkOrderDate",
          label: "Work Order Date (PMC / Consultancy)",
          type: "date",
          required: false,
          help: "Date when PMC work order was issued",
        },
        {
          name: "worksWorkOrderDate",
          label: "Work Order Date (works)",
          type: "date",
          required: true,
          help: "Date when main works order was issued",
        },
        {
          name: "consultantName",
          label: "Name of Consultant/ PMC",
          type: "text",
          required: false,
          help: "Name of the project management consultant",
        },
        {
          name: "contractorName",
          label: "Name of Contractor",
          type: "text",
          required: true,
          help: "Name of the primary contractor",
        },
        {
          name: "physicalProgress",
          label: "Physical Progress in Percentage",
          type: "number",
          min: "0",
          max: "100",
          required: false,
          help: "Current physical progress as percentage",
        },
      ],
    },
    {
      id: "timeline",
      title: "Timeline & Status",
      description: "Enter project timeline and current status information",
      fields: [
        {
          name: "completionDatePerTender",
          label: "Date of Completion as per Tender",
          type: "date",
          required: true,
          help: "Contract completion date as per tender agreement",
        },
        {
          name: "expectedCompletionDate",
          label: "Expected Date of Completion",
          type: "date",
          required: false,
          help: "Realistic expected date of completion",
        },
        {
          name: "provisions",
          label: "Provisions",
          type: "text",
          required: false,
          help: "Any special provisions for this project",
        },
        {
          name: "landStatus",
          label: "Land Status",
          type: "text",
          required: false,
          help: "Current status of land acquisition (if applicable)",
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "textarea",
          required: false,
          help: "Any additional notes or observations",
        },
      ],
    },
  ];

  // Format a field value for display
  const formatValue = (name, value) => {
    if (!value) return "-";

    // Format dates
    if (name.includes("Date") && value) {
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return value;
      }
    }

    // Format percentages
    if (name.includes("Progress") && value) {
      return `${value}%`;
    }

    // Format currency
    if (name === "estimatedValue" && value) {
      return `₹${value} Cr.`;
    }

    return value;
  };

  // Format created date for display
  const formatCreatedDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-medium">Processing...</p>
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button (Mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md border-blue-200 transition-all duration-300 hover:shadow-lg"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? (
            <EyeOff className="h-5 w-5 text-blue-600" />
          ) : (
            <Eye className="h-5 w-5 text-blue-600" />
          )}
        </Button>
      </div>

      {/* Sidebar - Form Preview */}
      <div
        className={`${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 h-screen overflow-y-scroll bg-red-500 fixed md:static inset-y-0 left-0 z-20 w-80 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 shadow-lg md:shadow-md flex-shrink-0 overflow-hidden flex flex-col`}
      >
        <div className="flex items-center bg-re justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Form Preview
          </h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-600 text-white border-blue-700 px-2.5">
              {formCompletion}%
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-5">
            {fieldGroups.map((group) => {
              const filledFields = group.fields.filter(
                (field) =>
                  formData[field.name] &&
                  formData[field.name].toString().trim() !== ""
              ).length;
              const totalFields = group.fields.length;
              const percentFilled =
                totalFields > 0
                  ? Math.round((filledFields / totalFields) * 100)
                  : 0;

              return (
                <div
                  key={group.id}
                  className={`rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                    activeTab === group.id
                      ? "ring-2 ring-blue-400 shadow-md"
                      : "border border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div
                    className={`${
                      activeTab === group.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-500"
                        : "bg-gradient-to-r from-gray-100 to-gray-50 hover:from-blue-100 hover:to-blue-50"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between p-3 text-left"
                      onClick={() => jumpToField(group.id)}
                    >
                      <h3
                        className={`text-sm font-bold flex items-center ${
                          activeTab === group.id
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {group.title}
                        {activeTab === group.id && (
                          <span className="ml-2 bg-white bg-opacity-20 text-white text-xs px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <div
                            className={`text-xs font-medium ${
                              activeTab === group.id
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            {filledFields}/{totalFields}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white bg-opacity-90 shadow-sm">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{
                              background: `conic-gradient(${
                                percentFilled >= 100
                                  ? "#10B981"
                                  : percentFilled > 0
                                  ? "#3B82F6"
                                  : "#E5E7EB"
                              } ${percentFilled}%, #F3F4F6 0%)`,
                            }}
                          >
                            <span
                              className={`rounded-full bg-white w-6 h-6 flex items-center justify-center ${
                                percentFilled >= 100
                                  ? "text-green-600"
                                  : percentFilled > 0
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {percentFilled}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div
                    className={`p-3 ${
                      activeTab === group.id ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="space-y-3">
                      {group.fields.map((field) => {
                        const value = formData[field.name];
                        const hasValue =
                          value && value.toString().trim() !== "";

                        return (
                          <div key={field.name} className="text-sm group">
                            <div className="text-xs font-medium mb-1 flex items-center justify-between">
                              <span
                                className={`${
                                  hasValue ? "text-blue-700" : "text-gray-500"
                                }`}
                              >
                                {field.label}
                              </span>
                              {field.required && !hasValue && (
                                <Badge className="text-xs px-2 py-0.5 bg-red-100 text-red-600 border-red-200 font-medium">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <div
                              className={`p-2.5 rounded-lg transition-all duration-200 ${
                                hasValue
                                  ? "bg-white border border-gray-200 shadow-sm hover:shadow hover:border-blue-200"
                                  : "bg-gray-50 border border-gray-200 border-dashed"
                              } ${
                                field.required && !hasValue
                                  ? "border-red-200 bg-red-50/30"
                                  : ""
                              } ${
                                activeTab === group.id && !hasValue
                                  ? "animate-pulse"
                                  : ""
                              }`}
                              onClick={() =>
                                !hasValue &&
                                activeTab === group.id &&
                                jumpToField(group.id)
                              }
                            >
                              {hasValue ? (
                                <div
                                  className={`${
                                    field.name === "remarks"
                                      ? "line-clamp-2"
                                      : "truncate font-medium"
                                  }`}
                                >
                                  {field.name === "remarks"
                                    ? value
                                    : formatValue(field.name, value)}
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-gray-400 italic">
                                  <span>Not filled</span>
                                  {activeTab === group.id && (
                                    <span className="text-xs text-blue-500 font-medium not-italic">
                                      Click to fill
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-1.5"></span>
                Overall Completion
              </div>
              <Badge className="bg-blue-600 text-white border-blue-700">
                {formCompletion}%
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${formCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="bg-white text-red-600 border-red-200 hover:bg-red-50 shadow-sm font-medium transition-all duration-200 hover:shadow hover:scale-105"
            >
              <FileX className="mr-1.5 h-4 w-4" />
              Reset Form
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white border-none shadow-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <Save className="mr-1.5 h-4 w-4" />
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 p-4 md:p-6 overflow-auto ${
          sidebarVisible && windowWidth < 768 ? "opacity-50" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="shadow-lg border-0 overflow-hidden">
            <div
              className={`h-2.5 ${
                isEditMode
                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                  : "bg-gradient-to-r from-blue-600 to-blue-500"
              }`}
            ></div>
            <CardHeader className="pb-4 pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    {isEditMode
                      ? "Edit Project"
                      : "Project Data Collection Form"}
                    {isEditMode ? (
                      <Badge className="ml-3 bg-amber-100 text-amber-800 border-0">
                        Editing
                      </Badge>
                    ) : (
                      <Badge className="ml-3 bg-blue-100 text-blue-800 border-0">
                        New
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {isEditMode
                      ? "Update project details"
                      : "Enter project details for tracking and management"}
                  </CardDescription>
                </div>
                <div className="flex items-center p-1.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <div className="w-full max-w-[180px] bg-gray-200 rounded-full h-3 mr-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${formCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-blue-700 whitespace-nowrap">
                    {formCompletion}% complete
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              {successMessage && (
                <Alert className="mb-6 bg-green-50 border-green-200 animate-fadeIn">
                  <BadgeCheck className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert className="mb-6 bg-red-50 border-red-200 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Error</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex overflow-x-auto pb-2 mb-4">
                    <TabsList className="inline-flex h-10 bg-gray-100/80 p-1 rounded-lg">
                      {fieldGroups.map((group, index) => {
                        const filledFields = group.fields.filter(
                          (field) =>
                            formData[field.name] &&
                            formData[field.name].toString().trim() !== ""
                        ).length;
                        const totalFields = group.fields.length;
                        const allFilled =
                          filledFields === totalFields && totalFields > 0;
                        const anyFilled = filledFields > 0;

                        return (
                          <TabsTrigger
                            key={group.id}
                            value={group.id}
                            className="relative px-3 py-1.5 text-sm font-medium transition-all"
                          >
                            <span className="flex items-center">
                              <span
                                className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs ${
                                  allFilled
                                    ? "bg-green-100 text-green-700"
                                    : anyFilled
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {index + 1}
                              </span>
                              {group.title}
                            </span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  {fieldGroups.map((group) => (
                    <TabsContent
                      key={group.id}
                      value={group.id}
                      className="pt-2"
                    >
                      <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl text-gray-800">
                            {group.title}
                          </CardTitle>
                          <CardDescription>{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {group.fields.map((field) => (
                              <div key={field.name} className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <Label
                                    htmlFor={field.name}
                                    className="flex items-center text-sm font-medium"
                                  >
                                    {field.label}
                                    {field.required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </Label>

                                  {field.help && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            className="p-0 h-auto"
                                          >
                                            <InfoIcon className="h-4 w-4 text-gray-400" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <p>{field.help}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>

                                {field.type === "textarea" ? (
                                  <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    className={
                                      formErrors[field.name]
                                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                                        : "focus:ring-blue-500"
                                    }
                                    required={field.required}
                                  />
                                ) : field.name === "nodalDepartment" ? (
                                  <SearchableSelect
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    options={departments}
                                    onValueChange={handleChange}
                                    required={field.required}
                                    error={formErrors[field.name]}
                                  />
                                ) : field.name === "division" ? (
                                  <SearchableSelect
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    options={divisions}
                                    onValueChange={handleChange}
                                    required={field.required}
                                    error={formErrors[field.name]}
                                  />
                                ) : field.name === "district" ? (
                                  <SearchableSelect
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    options={districts}
                                    onValueChange={handleChange}
                                    required={field.required}
                                    error={formErrors[field.name]}
                                  />
                                ) : field.name === "lac" ? (
                                  <SearchableSelect
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    options={lacs}
                                    onValueChange={handleChange}
                                    required={field.required}
                                    error={formErrors[field.name]}
                                  />
                                ) : field.name === "consultantName" ? (
                                  <SearchableSelect
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    options={consultants}
                                    onValueChange={handleChange}
                                    required={field.required}
                                    error={formErrors[field.name]}
                                  />
                                ) : field.name === "contractorName" ? (
                                  <SearchableSelect
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    options={contractors}
                                    onValueChange={handleChange}
                                    required={field.required}
                                    error={formErrors[field.name]}
                                  />
                                ) : (
                                  <Input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    className={
                                      formErrors[field.name]
                                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                                        : "focus:ring-blue-500"
                                    }
                                    required={field.required}
                                    {...(field.type === "number" && {
                                      step: field.step,
                                      min: field.min,
                                      max: field.max,
                                    })}
                                  />
                                )}
                                {formErrors[field.name] && (
                                  <p className="text-red-500 text-xs mt-1 animate-pulse">
                                    {formErrors[field.name]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => navigateTab("prev")}
                              disabled={group.id === fieldGroups[0].id}
                              className="flex items-center"
                            >
                              <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                            </Button>

                            {group.id !== fieldGroups[0].id && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={resetForm}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <FileX className="mr-1 h-4 w-4" /> Reset
                              </Button>
                            )}
                          </div>

                          {group.id ===
                          fieldGroups[fieldGroups.length - 1].id ? (
                            <Button
                              type="submit"
                              className={
                                isEditMode
                                  ? "bg-amber-600 hover:bg-amber-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }
                              disabled={isLoading}
                            >
                              <Save className="mr-1 h-4 w-4" />
                              {isEditMode ? "Update Project" : "Save Project"}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => navigateTab("next")}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={isLoading}
                            >
                              Next <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex flex-col sm:flex-row justify-center gap-4 py-4">
                  <Button
                    type="submit"
                    size="lg"
                    className={
                      isEditMode
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {isEditMode ? "Update Project" : "Save Project"}
                  </Button>

                  {isEditMode && (
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      size="lg"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      <X className="mr-2 h-5 w-5" /> Cancel Editing
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="secondary" size="lg">
                        <Download className="mr-2 h-5 w-5" /> Export to CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Export Feature</DialogTitle>
                        <DialogDescription>
                          The export to CSV feature is currently available on
                          request. Please contact support to enable this
                          functionality.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Projects List */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 h-2.5"></div>
            <CardHeader className="pb-2 pt-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl text-gray-800 flex items-center">
                    Projects List
                    <Badge className="ml-2 bg-green-100 text-green-800 border-0">
                      {paginationData.total}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    View and manage all your projects
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchProjects}
                    disabled={isLoading}
                    className="bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  >
                    <RefreshCw
                      className={`mr-1 h-4 w-4 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />{" "}
                    Refresh
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="secondary" size="lg">
                        <Download className="mr-2 h-5 w-5" /> Export to CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Export Feature</DialogTitle>
                        <DialogDescription>
                          The export to CSV feature is currently available on
                          request. Please contact support to enable this
                          functionality.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              {/* <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">
                  Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="filterProjectName" className="text-xs">
                      Project Name
                    </Label>
                    <Input
                      id="filterProjectName"
                      name="projectName"
                      value={filters.projectName}
                      onChange={handleFilterChange}
                      placeholder="Search by project name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="filterDistrict" className="text-xs">
                      District
                    </Label>
                    <Select
                      name="district"
                      value={filters.district}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, district: value }))
                      }
                    >
                      <SelectTrigger id="filterDistrict" className="mt-1">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="filterDivision" className="text-xs">
                      Division
                    </Label>
                    <Select
                      name="division"
                      value={filters.division}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, division: value }))
                      }
                    >
                      <SelectTrigger id="filterDivision" className="mt-1">
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Divisions</SelectItem>
                        {divisions.map((division) => (
                          <SelectItem key={division} value={division}>
                            {division}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    disabled={isLoading}
                    className="text-gray-600"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={applyFilters}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="mr-1 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </div> */}

              {projects.length > 0 ? (
                <>
                  <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                          <TableHead className="w-[80px]">Sl. No</TableHead>
                          <TableHead>Project Name</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Department
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            District
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Est. Value (Cr.)
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Created
                          </TableHead>
                          <TableHead className="text-right w-[120px]">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow
                            key={project.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              {project.slNo || "-"}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>{project.projectName}</div>
                              <div className="text-xs text-gray-500 md:hidden mt-1">
                                {project.nodalDepartment} • {project.district}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {project.nodalDepartment || "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {project.district || "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {project.estimatedValue
                                ? `₹${project.estimatedValue}`
                                : "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-xs text-gray-500">
                              {formatCreatedDate(project.createdAt)}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                onClick={() => handleEditProject(project.id)}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => handleDeleteProject(project.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {/* Pagination */}
                  {paginationData.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(paginationData.page - 1)
                          }
                          disabled={paginationData.page === 1 || isLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(paginationData.page + 1)
                          }
                          disabled={
                            paginationData.page === paginationData.pages ||
                            isLoading
                          }
                        >
                          Next
                        </Button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                              {(paginationData.page - 1) *
                                paginationData.limit +
                                1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                              {Math.min(
                                paginationData.page * paginationData.limit,
                                paginationData.total
                              )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                              {paginationData.total}
                            </span>{" "}
                            projects
                          </p>
                        </div>
                        <div>
                          <nav
                            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                            aria-label="Pagination"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-l-md px-2"
                              onClick={() =>
                                handlePageChange(paginationData.page - 1)
                              }
                              disabled={paginationData.page === 1 || isLoading}
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>

                            {/* Page buttons */}
                            {[...Array(paginationData.pages)].map((_, i) => (
                              <Button
                                key={i}
                                variant={
                                  paginationData.page === i + 1
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className={`px-3 ${
                                  paginationData.page === i + 1
                                    ? "bg-blue-600"
                                    : ""
                                }`}
                                onClick={() => handlePageChange(i + 1)}
                                disabled={isLoading}
                              >
                                {i + 1}
                              </Button>
                            ))}

                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-r-md px-2"
                              onClick={() =>
                                handlePageChange(paginationData.page + 1)
                              }
                              disabled={
                                paginationData.page === paginationData.pages ||
                                isLoading
                              }
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No projects found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {isLoading
                      ? "Loading projects..."
                      : "There are no projects to display. Start by adding a new project using the form above."}
                  </p>
                  {!isLoading && (
                    <Button
                      onClick={() => {
                        resetFilters();
                        setActiveTab("basic");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add New Project
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={projectToDelete !== null}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDeleteProject}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-4 w-4" />
              )}
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Background overlay for mobile when sidebar is visible */}
      {sidebarVisible && windowWidth < 768 && (
        <div
          className="fixed inset-0 bg-blue-900 bg-opacity-40 backdrop-blur-sm z-10 md:hidden transition-all duration-300"
          onClick={() => setSidebarVisible(false)}
        />
      )}
    </div>
  );
};

export default ProjectForm;
