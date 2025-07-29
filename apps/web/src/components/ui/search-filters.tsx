"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignFilters, CampaignCategory } from "@/types/campaign";
import { CAMPAIGN_CATEGORIES, SEARCH } from "@/lib/constants";
import { debounce } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface SearchFiltersProps {
  filters: CampaignFilters;
  onFiltersChange: (filters: CampaignFilters) => void;
  className?: string;
  showCategoryFilter?: boolean;
  showAdvancedFilters?: boolean;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  className,
  showCategoryFilter = true,
  showAdvancedFilters = false,
}: SearchFiltersProps) {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onFiltersChange({ ...filters, searchQuery: query });
    }, SEARCH.debounceMs),
    [filters, onFiltersChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.length >= SEARCH.minQueryLength || query.length === 0) {
      debouncedSearch(query);
    }
  };

  const handleCategoryChange = (category: CampaignCategory | "All") => {
    onFiltersChange({ ...filters, selectedCategory: category });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      selectedCategory: "All",
    });
  };

  const hasActiveFilters = filters.searchQuery || filters.selectedCategory !== "All";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Category Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            defaultValue={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {showCategoryFilter && (
          <select
            value={filters.selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value as CampaignCategory | "All")}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground min-w-[150px]"
          >
            <option value="All">All Categories</option>
            {CAMPAIGN_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.searchQuery}"
              <button
                onClick={() => onFiltersChange({ ...filters, searchQuery: "" })}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.selectedCategory !== "All" && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.selectedCategory}
              <button
                onClick={() => onFiltersChange({ ...filters, selectedCategory: "All" })}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced Filters</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Min Funding</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minFunding || ""}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  minFunding: e.target.value ? Number(e.target.value) : undefined
                })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground">Max Funding</label>
              <Input
                type="number"
                placeholder="∞"
                value={filters.maxFunding || ""}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  maxFunding: e.target.value ? Number(e.target.value) : undefined
                })}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}