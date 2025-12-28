"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FileText, Check, Star, Layout, Palette, Search } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  primary_color: string;
  layout_type: string;
  is_premium: boolean;
  is_ats_friendly: boolean;
  tags: string[];
}

interface Category {
  value: string;
  label: string;
  description: string;
}

interface TemplateSelectionProps {
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
}

export default function TemplateSelection({ onSelect, selectedTemplateId }: TemplateSelectionProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/templates/categories");
      const data = await response.json();
      if (data.categories) {
        setCategories([{ value: "all", label: "All Templates", description: "View all available templates" }, ...data.categories]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "all" 
        ? "/api/templates" 
        : `/api/templates?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "success" && data.data?.templates) {
        setTemplates(data.data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchTemplates();
  }, [selectedCategory, fetchTemplates]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Resume Template
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a professional template that best represents your style
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80" />
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`group cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${
                selectedTemplateId === template.id
                  ? "border-blue-600 shadow-lg scale-105"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md"
              }`}
            >
              {/* Template Preview */}
              <div className="relative h-80 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="text-center p-8" style={{ backgroundColor: template.primary_color + "15" }}>
                    <FileText className="w-24 h-24 mx-auto mb-4" style={{ color: template.primary_color }} />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto" />
                    </div>
                  </div>
                )}
                
                {/* Selected Indicator */}
                {selectedTemplateId === template.id && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Premium Badge */}
                {template.is_premium && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Premium
                  </div>
                )}

                {/* ATS Badge */}
                {template.is_ats_friendly && (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ATS Friendly
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4 bg-white dark:bg-gray-900">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Template Details */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Layout className="w-4 h-4" />
                    {template.layout_type}
                  </div>
                  <div className="flex items-center gap-1">
                    <Palette className="w-4 h-4" />
                    <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: template.primary_color }} />
                  </div>
                </div>

                {/* Tags */}
                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {template.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No templates found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
