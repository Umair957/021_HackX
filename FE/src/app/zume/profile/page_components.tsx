import { useState, useEffect } from "react";
import { Plus, Trash2, Briefcase, FolderGit2 } from "lucide-react";

// Type definitions - exported for use in main page
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  currently_studying: boolean;
  grade?: string;
  description?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  currently_working: boolean;
  description?: string;
  achievements: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
  currently_working: boolean;
}

export interface JobPreferences {
  desired_positions: string[];
  preferred_locations: string[];
  remote_preference?: string;
  job_type: string[];
  expected_salary_min?: number;
  expected_salary_max?: number;
  currency?: string;
  available_from?: string;
  willing_to_relocate: boolean;
}

// Work Experience Section Component
export function ExperienceSection({ data, onChange }: { data: WorkExperience[]; onChange: (data: WorkExperience[]) => void }) {
  const addExperience = () => {
    onChange([...data, {
      company: "",
      position: "",
      location: "",   
      start_date: "",
      end_date: "",
      currently_working: false,
      description: "",
      achievements: []
    }]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addAchievement = (index: number) => {
    const updated = [...data];
    updated[index].achievements.push("");
    onChange(updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...data];
    updated[expIndex].achievements[achIndex] = value;
    onChange(updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...data];
    updated[expIndex].achievements = updated[expIndex].achievements.filter((_, i) => i !== achIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {data.map((exp, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience {index + 1}</h3>
              <button
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Example Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position *</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, "position", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={exp.location || ""}
                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={exp.start_date || ""}
                  onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={exp.end_date || ""}
                  onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                  disabled={exp.currently_working}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exp.currently_working}
                  onChange={(e) => updateExperience(index, "currently_working", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Currently working here</label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={exp.description || ""}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of your role and responsibilities"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Achievements</label>
                  <button
                    onClick={() => addAchievement(index)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="• Increased sales by 40%"
                    />
                    <button
                      onClick={() => removeAchievement(index, achIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No work experience yet. Click "Add Experience" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Skills Section Component
export function SkillsSection({ data, onChange }: { data?: Skills; onChange: (data: Skills) => void }) {
  const [formData, setFormData] = useState<Skills>(data || {
    technical: [],
    soft: [],
    tools: []
  });
  const [newSkill, setNewSkill] = useState({ technical: "", soft: "", tools: "" });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const addSkill = (category: keyof Skills) => {
    if (newSkill[category].trim()) {
      const updated = {
        ...formData,
        [category]: [...formData[category], newSkill[category].trim()]
      };
      setFormData(updated);
      setNewSkill({ ...newSkill, [category]: "" });
      onChange(updated);
    }
  };

  const removeSkill = (category: keyof Skills, index: number) => {
    const updated = {
      ...formData,
      [category]: formData[category].filter((_, i) => i !== index)
    };
    setFormData(updated);
    onChange(updated);
  };

  const skillCategories = [
    { key: "technical" as keyof Skills, label: "Technical Skills", placeholder: "e.g., React, Python, AWS" },
    { key: "soft" as keyof Skills, label: "Soft Skills", placeholder: "e.g., Leadership, Communication" },
    { key: "tools" as keyof Skills, label: "Tools & Platforms", placeholder: "e.g., Git, Docker, Jira" }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>

      {skillCategories.map((category) => (
        <div key={category.key} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.label}</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill[category.key]}
              onChange={(e) => setNewSkill({ ...newSkill, [category.key]: e.target.value })}
              onKeyPress={(e) => e.key === "Enter" && addSkill(category.key)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={category.placeholder}
            />
            <button
              onClick={() => addSkill(category.key)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData[category.key].map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(category.key, index)}
                  className="hover:text-red-600 dark:hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {formData[category.key].length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Projects Section Component
export function ProjectsSection({ data, onChange }: { data: Project[]; onChange: (data: Project[]) => void }) {
  const [newTech, setNewTech] = useState<string[]>([]);

  const addProject = () => {
    onChange([...data, {
      name: "",
      description: "",
      technologies: [],
      url: "",
      github_url: "",
      start_date: "",
      end_date: "",
      currently_working: false
    }]);
    setNewTech([...newTech, ""]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
    setNewTech(newTech.filter((_, i) => i !== index));
  };

  const addTechnology = (projIndex: number) => {
    const techValue = newTech[projIndex];
    if (techValue && techValue.trim()) {
      const updated = [...data];
      updated[projIndex].technologies.push(techValue.trim());
      onChange(updated);
      const updatedNewTech = [...newTech];
      updatedNewTech[projIndex] = "";
      setNewTech(updatedNewTech);
    }
  };

  const removeTechnology = (projIndex: number, techIndex: number) => {
    const updated = [...data];
    updated[projIndex].technologies = updated[projIndex].technologies.filter((_, i) => i !== techIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {data.map((project, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project {index + 1}</h3>
              <button
                onClick={() => removeProject(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Awesome Project"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={project.description || ""}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="What does this project do?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project URL</label>
                <input
                  type="url"
                  value={project.url || ""}
                  onChange={(e) => updateProject(index, "url", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://project.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={project.github_url || ""}
                  onChange={(e) => updateProject(index, "github_url", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://github.com/user/repo"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technologies</label>
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTech[index] || ""}
                    onChange={(e) => {
                      const updated = [...newTech];
                      updated[index] = e.target.value;
                      setNewTech(updated);
                    }}
                    onKeyPress={(e) => e.key === "Enter" && addTechnology(index)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="React, TypeScript, etc."
                  />
                  <button
                    onClick={() => addTechnology(index)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(index, techIndex)}
                        className="hover:text-red-600 dark:hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FolderGit2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No projects yet. Click "Add Project" to showcase your work.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Job Preferences Section Component
export function PreferencesSection({ data, onChange }: { data?: JobPreferences; onChange: (data: JobPreferences) => void }) {
  const [formData, setFormData] = useState<JobPreferences>(data || {
    desired_positions: [],
    preferred_locations: [],
    remote_preference: "flexible",
    job_type: [],
    expected_salary_min: undefined,
    expected_salary_max: undefined,
    currency: "USD",
    available_from: "",
    willing_to_relocate: false
  });
  const [newPosition, setNewPosition] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (field: keyof JobPreferences, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addPosition = () => {
    if (newPosition.trim()) {
      handleChange("desired_positions", [...formData.desired_positions, newPosition.trim()]);
      setNewPosition("");
    }
  };

  const removePosition = (index: number) => {
    handleChange("desired_positions", formData.desired_positions.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      handleChange("preferred_locations", [...formData.preferred_locations, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (index: number) => {
    handleChange("preferred_locations", formData.preferred_locations.filter((_, i) => i !== index));
  };

  const toggleJobType = (type: string) => {
    const updated = formData.job_type.includes(type)
      ? formData.job_type.filter((t) => t !== type)
      : [...formData.job_type, type];
    handleChange("job_type", updated);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Preferences</h2>

      {/* Desired Positions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Desired Positions</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addPosition()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Software Engineer, Product Manager"
          />
          <button
            onClick={addPosition}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.desired_positions.map((position, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
            >
              {position}
              <button
                onClick={() => removePosition(index)}
                className="hover:text-red-600 dark:hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Preferred Locations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferred Locations</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addLocation()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., San Francisco, New York, Remote"
          />
          <button
            onClick={addLocation}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.preferred_locations.map((location, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm"
            >
              {location}
              <button
                onClick={() => removeLocation(index)}
                className="hover:text-red-600 dark:hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Remote Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Remote Work Preference</label>
        <select
          value={formData.remote_preference || "flexible"}
          onChange={(e) => handleChange("remote_preference", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="remote">Remote Only</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site Only</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Job Type</label>
        <div className="flex flex-wrap gap-3">
          {["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.job_type.includes(type)}
                onChange={() => toggleJobType(type)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Expectations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Salary</label>
          <input
            type="number"
            value={formData.expected_salary_min || ""}
            onChange={(e) => handleChange("expected_salary_min", parseInt(e.target.value) || undefined)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Salary</label>
          <input
            type="number"
            value={formData.expected_salary_max || ""}
            onChange={(e) => handleChange("expected_salary_max", parseInt(e.target.value) || undefined)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="100000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
          <select
            value={formData.currency || "USD"}
            onChange={(e) => handleChange("currency", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="PKR">PKR</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>

      {/* Available From */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available From</label>
        <input
          type="date"
          value={formData.available_from || ""}
          onChange={(e) => handleChange("available_from", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Willing to Relocate */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.willing_to_relocate}
          onChange={(e) => handleChange("willing_to_relocate", e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-sm text-gray-700 dark:text-gray-300">Willing to relocate for the right opportunity</label>
      </div>
    </div>
  );
}
