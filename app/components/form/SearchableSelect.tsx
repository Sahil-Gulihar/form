import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

const SearchableSelect = ({
  name,
  value,
  options,
  onValueChange,
  required,
  error,
}:any) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter options based on search query
  const filteredOptions = options.filter((option:any) =>
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
              filteredOptions.map((option:any) => (
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

export default SearchableSelect;
