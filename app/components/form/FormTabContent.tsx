import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, FileX, Save, InfoIcon } from "lucide-react";
import { 
  consultants, 
  departments, 
  divisions, 
  districts, 
  lacs, 
  contractors 
} from "@/lib/utils"

const FormTabContent = ({
  group,
  formData,
  formErrors,
  handleChange,
  navigateTab,
  resetForm,
  fieldGroups,
  SearchableSelect,
}:any) => {
  // Get options for different field types
  const getOptions = (fieldName:any) => {
    switch (fieldName) {
      case "nodalDepartment":
        return departments;
      case "division":
        return divisions;
      case "district":
        return districts;
      case "lac":
        return lacs;
      case "consultantName":
        return consultants;
      case "contractorName":
        return contractors;
      default:
        return [];
    }
  };

  return (
    <TabsContent key={group.id} value={group.id} className="pt-2">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-gray-800">
            {group.title}
          </CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {group.fields.map((field:any) => (
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
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={
                      formErrors[field.name]
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "focus:ring-blue-500"
                    }
                    required={field.required}
                  />
                ) : ["nodalDepartment", "division", "district", "lac", "consultantName", "contractorName"].includes(field.name) ? (
                  <SearchableSelect
                    name={field.name}
                    value={formData[field.name]}
                    options={getOptions(field.name)}
                    onValueChange={handleChange}
                    required={field.required}
                    error={formErrors[field.name]}
                  />
                ) : (
                  <Input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-1 h-4 w-4" /> Save Project
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => navigateTab("next")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
export default FormTabContent;