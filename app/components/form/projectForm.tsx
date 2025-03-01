// @ts-nocheck
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, AlertCircle, EyeOff, Eye, Save, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import subcomponents
import ProjectFormSidebar from "./ProjectFormSidebar";
import FormTabContent from "./FormTabContent";
import ProjectsTable from "./ProjectsTable";
import DeleteProjectDialog from "./DeleteProjectDialog";
import SearchableSelect from "./SearchableSelect";


import { formatValue } from "@/lib/helpers";
import { fieldGroups } from "@/lib/utils";

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
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

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
      return;
    }

    // Add the current form data to projects array
    const newProjects = [
      ...projects,
      { ...formData, slNo: (projects.length + 1).toString() },
    ];
    setProjects(newProjects);

    // Reset form
    setFormData({ ...initialFormData, slNo: (projects.length + 1).toString() });

    // Show success message
    setSuccessMessage("Project added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);

    // Reset to first tab
    setActiveTab("basic");

    // Clear all errors
    setFormErrors({});

    // Reset form completion
    setFormCompletion(0);
  };

  const handleDeleteProject = (index) => {
    setProjectToDelete(index);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete !== null) {
      // Remove the project
      const updatedProjects = projects.filter(
        (_, idx) => idx !== projectToDelete
      );

      // Renumber the remaining projects
      const renumberedProjects = updatedProjects.map((proj, idx) => ({
        ...proj,
        slNo: (idx + 1).toString(),
      }));

      setProjects(renumberedProjects);
      setProjectToDelete(null);

      // Show success message
      setSuccessMessage("Project deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
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
      csvContent += `${project.slNo},${project.projectName},${project.nodalDepartment},${project.division},${project.district},${project.lac},${project.fundSource},${project.aaNo},${project.estimatedValue},${project.pmcWorkOrderDate},${project.worksWorkOrderDate},${project.consultantName},${project.contractorName},${project.physicalProgress},${project.financialProgress},${project.completionDatePerTender},${project.expectedCompletionDate},${project.provisions},${project.landStatus},${project.remarks},${project.branch}\n`;
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
  };

  // Jump to tab containing field
  const jumpToField = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
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
      <ProjectFormSidebar
        formData={formData}
        formCompletion={formCompletion}
        fieldGroups={fieldGroups}
        activeTab={activeTab}
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
        jumpToField={jumpToField}
        formatValue={formatValue}
        resetForm={resetForm}
        handleSubmit={handleSubmit}
      />

      {/* Main content */}
      <div
        className={`flex-1 p-4 md:p-6 overflow-auto ${
          sidebarVisible && windowWidth < 768 ? "opacity-50" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2.5"></div>
            <CardHeader className="pb-4 pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    Project Data Collection Form
                    <Badge className="ml-3 bg-blue-100 text-blue-800 border-0">
                      New
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Enter project details for tracking and management
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
                    <FormTabContent
                      key={group.id}
                      group={group}
                      formData={formData}
                      formErrors={formErrors}
                      handleChange={handleChange}
                      navigateTab={navigateTab}
                      resetForm={resetForm}
                      fieldGroups={fieldGroups}
                      SearchableSelect={SearchableSelect}
                    />
                  ))}
                </Tabs>

                <div className="flex flex-col sm:flex-row justify-center gap-4 py-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-5 w-5" /> Save Project
                  </Button>

                  <Button
                    type="button"
                    onClick={generateExcel}
                    disabled={projects.length === 0}
                    variant={projects.length === 0 ? "outline" : "secondary"}
                    size="lg"
                    className={projects.length === 0 ? "opacity-50" : ""}
                  >
                    <Download className="mr-2 h-5 w-5" /> Export to CSV
                    {projects.length > 0 && (
                      <Badge className="ml-2 bg-blue-200 text-blue-800">
                        {projects.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Projects List */}
          {projects.length > 0 && (
            <ProjectsTable
              projects={projects}
              handleDeleteProject={handleDeleteProject}
              generateExcel={generateExcel}
            />
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteProjectDialog
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteProject}
      />

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
