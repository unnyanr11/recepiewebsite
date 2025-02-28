"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import { addFavoriteRecipe, addToHistory, getFavoriteRecipes } from "@/lib/firestore";

interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  ingredients: string[];
  steps: string[];
}

const recipesData: Recipe[] = [
  { id: "1", title: "Pancakes", image: "/images/pancakes.jpg", category: "Breakfast", ingredients: ["Flour", "Milk", "Eggs"], steps: ["Mix ingredients", "Cook on a pan", "Serve hot"] },
  { id: "2", title: "Grilled Chicken", image: "/images/grilledchicken.jpg", category: "Lunch", ingredients: ["Chicken", "Spices", "Oil"], steps: ["Marinate chicken", "Grill until cooked", "Serve with sides"] },
  { id: "3", title: "Pasta", image: "/images/pasta.jpg", category: "Dinner", ingredients: ["Pasta", "Tomato Sauce", "Cheese"], steps: ["Boil pasta", "Prepare sauce", "Mix and serve"] },
];

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [user] = useAuthState(auth);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      setRecipe(recipesData.find((r) => r.id === id) || null);
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      getFavoriteRecipes(user.uid).then((favorites) => {
        setIsFavorite(favorites.includes(id as string));
      });
    }
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user) {
      alert("Please log in to save recipes.");
      return;
    }
    const response = await addFavoriteRecipe(user.uid, id as string);
    if (response.success) setIsFavorite(true);
  };

  const handleCooked = async () => {
    if (!user) {
      alert("Please log in to track cooking history.");
      return;
    }
    await addToHistory(user.uid, id as string);
    alert("Recipe marked as cooked! ✅");
  };

  if (!recipe) {
    return <p className="text-center text-red-500 text-xl mt-10">Recipe not found!</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-red-700 dark:text-red-400">{recipe.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">{recipe.category}</p>

      {/* Recipe Image */}
      <div className="my-4">
        <Image 
          src={recipe.image} 
          alt={recipe.title} 
          width={500} 
          height={300} 
          className="rounded-lg shadow-md" 
          priority
        />
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Ingredients</h2>
        <ul className="list-disc pl-6 text-lg">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Steps</h2>
        <ol className="list-decimal pl-6 text-lg">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-6 space-x-3">
        <button 
          onClick={handleFavorite} 
          className={`px-4 py-2 rounded-md transition-all ${
            isFavorite ? "bg-green-600 text-white" : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          }`}
          aria-label="Save Recipe"
        >
          {isFavorite ? "❤️ Saved" : "💾 Save Recipe"}
        </button>

        <button 
          onClick={handleCooked} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all"
          aria-label="Mark as Cooked"
        >
          ✅ Mark as Cooked
        </button>
      </div>
    </div>
  );
}
