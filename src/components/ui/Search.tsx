// components/ui/Search.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  suggestions?: string[];
}

export const Search: React.FC<SearchProps> = ({
  placeholder = "搜索...",
  onSearch,
  className = "",
  suggestions = [],
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }

    if (onSearch) {
      onSearch(value);
    }
  };

  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    setIsFocused(false);
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setIsFocused(false);
  };

  // 处理点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full py-2 px-4 pl-10 bg-indigo-900/30 border border-indigo-800/30 text-indigo-100 placeholder-indigo-400/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
          />

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-indigo-400/70"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 text-indigo-300/70 hover:text-indigo-100"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* 搜索建议 */}
      {isFocused && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-gradient-to-b from-indigo-950/90 to-black/90 border border-indigo-800/30 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-indigo-100 hover:bg-indigo-800/30 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
