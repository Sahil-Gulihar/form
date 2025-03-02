//@ts-nocheck
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileX, Save, FileText, X } from "lucide-react";

const ProjectFormSidebar = ({
  formData,
  formCompletion,
  fieldGroups,
  activeTab,
  sidebarVisible,
  setSidebarVisible,
  jumpToField,
  formatValue,
  resetForm,
  handleSubmit,
}) => {
  return (
    <div
      className={`${
        sidebarVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform md:translate-x-0 h-screen overflow-y-scroll fixed md:static inset-y-0 left-0 z-20 w-80 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 shadow-lg md:shadow-md flex-shrink-0 overflow-hidden flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
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
                        activeTab === group.id ? "text-white" : "text-gray-700"
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
                      const hasValue = value && value.toString().trim() !== "";

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
                            {field.required && hasValue && (
                              <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-600 border-green-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Completed
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
            Save Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormSidebar;
