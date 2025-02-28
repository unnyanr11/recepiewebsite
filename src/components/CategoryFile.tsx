"use client";

import { useState } from "react";
import RecipeGrid from "@/components/RecipeGrid";

interface CategoryFilterProps {
  recipes: { id: string; title: string; image: string; category: string }[];
}

export default function CategoryFilter({ recipes }: CategoryFilterProps) {
  const categories = ["All", "Breakfast", "Lunch", "Dinner"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRecipes =
    selectedCategory === "All"
      ? recipes
      : recipes.filter((r) => r.category === selectedCategory);

  return (
    <>
      <div className="flex gap-4 mb-6 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              selectedCategory === cat
                ? "bg-red-600 text-white shadow-md dark:bg-red-500"
                : "bg-white hover:bg-red-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-red-500"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <RecipeGrid recipes={filteredRecipes} />
    </>
  );
}
