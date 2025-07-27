"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Hash } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
  placeholder?: string;
  suggestions?: string[];
}

// Common tag suggestions
const DEFAULT_SUGGESTIONS = [
  "technology", "design", "programming", "tutorial", "tips",
  "web-development", "javascript", "react", "nextjs", "css",
  "ui-ux", "frontend", "backend", "database", "api",
  "mobile", "ios", "android", "startup", "business",
  "productivity", "creativity", "inspiration", "resources",
  "tools", "open-source", "github", "community", "learning"
];

export default function TagInput({ 
  tags, 
  onChange, 
  disabled = false,
  maxTags = 10,
  placeholder = "Add tags...",
  suggestions = DEFAULT_SUGGESTIONS
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and exclude existing tags
  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion)
    )
    .slice(0, 5); // Show max 5 suggestions

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    
    if (trimmedTag === "" || tags.includes(trimmedTag) || tags.length >= maxTags) {
      return;
    }
    
    onChange([...tags, trimmedTag]);
    setInputValue("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
        addTag(filteredSuggestions[selectedSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  };

  return (
    <div className="space-y-3">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-sm py-1 px-2 flex items-center gap-1"
            >
              <Hash className="h-3 w-3" />
              {tag}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={tags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
            disabled={disabled || tags.length >= maxTags}
            className="flex-1"
          />
          
          {inputValue.trim() && (
            <Button
              type="button"
              onClick={() => addTag(inputValue)}
              disabled={disabled || tags.length >= maxTags}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-10 shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 flex items-center gap-2 ${
                      index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <Hash className="h-3 w-3 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tag Counter and Hints */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {tags.length}/{maxTags} tags
        </span>
        {!disabled && (
          <span>
            Press Enter to add • Backspace to remove • Use arrows to navigate suggestions
          </span>
        )}
      </div>

      {/* Popular Tags */}
      {tags.length === 0 && !disabled && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Popular tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
              >
                #{suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}