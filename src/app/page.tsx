"use client";

import { useState, useEffect } from "react";
import RecipeGrid from "@/components/RecipeGrid";
import SearchBar from "@/components/SearchBar";

const recipesData = [
  { id: "1", title: "Pancakes", image: "/images/pancakes.jpg", category: "Breakfast", diet: "Vegetarian", time: 15 },
  { id: "2", title: "Grilled Chicken", image: "/images/grilledchicken.jpg", category: "Lunch", diet: "Non-Vegetarian", time: 25 },
  { id: "3", title: "Pasta", image: "/images/pasta.jpg", category: "Dinner", diet: "Vegetarian", time: 20 },
  { id: "4", title: "Burger", image: "/images/burger.jpg", category: "Lunch", diet: "Non-Vegetarian", time: 30 },
  { id: "5", title: "Salad", image: "/images/salad.jpg", category: "Dinner", diet: "Vegan", time: 10 },
];

export default function HomePage() {
  const [filteredRecipes, setFilteredRecipes] = useState(recipesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDiet, setFilterDiet] = useState("all");
  const [filterTime, setFilterTime] = useState("all");

  useEffect(() => {
    let updatedRecipes = recipesData.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (filterCategory !== "all") {
      updatedRecipes = updatedRecipes.filter((recipe) => recipe.category === filterCategory);
    }
    if (filterDiet !== "all") {
      updatedRecipes = updatedRecipes.filter((recipe) => recipe.diet === filterDiet);
    }
    if (filterTime !== "all") {
      const maxTime = parseInt(filterTime, 10);
      updatedRecipes = updatedRecipes.filter((recipe) => recipe.time <= maxTime);
    }

    // Apply sorting
    if (sortOption === "alphabetical") {
      updatedRecipes = [...updatedRecipes].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "category") {
      updatedRecipes = [...updatedRecipes].sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredRecipes(updatedRecipes);
  }, [searchQuery, sortOption, filterCategory, filterDiet, filterTime]);

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-red-700 dark:text-black-400">
          🍽 Find Your Next Favorite Recipe
        </h1>
      </div>

      {/* Search Bar & Sorting in one row */}
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={setSearchQuery} />

        {/* Sorting Dropdown */}
        
      </div>

      {/* Filters & Upload button in one row */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          {/* Category Filter */}
          <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>

          {/* Diet Filter */}
          <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            value={filterDiet}
            onChange={(e) => setFilterDiet(e.target.value)}
          >
            <option value="all">All Diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
          </select>

          {/* Cooking Time Filter */}
          <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
          >
            <option value="all">Any Time</option>
            <option value="10">≤ 10 mins</option>
            <option value="20">≤ 20 mins</option>
            <option value="30">≤ 30 mins</option>
          </select>
        </div>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="category">Category</option>
          </select>


        {/* Upload Button (Already in SearchBar component) */}
        
      </div>

      {/* Recipe Grid updates dynamically */}
      <RecipeGrid recipes={filteredRecipes} />
    </main>
  );
}
