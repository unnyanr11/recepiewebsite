"use client";

import RecipeCard from "@/components/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
}

interface RecipeGridProps {
  recipes?: Recipe[]; // Allow it to be optional
}

export default function RecipeGrid({ recipes = [] }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.length > 0 ? (
        recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
      ) : (
        <div className="col-span-full text-center">
          <p className="text-red-500">No recipes available.</p>
        </div>
      )}
    </div>
  );
}
