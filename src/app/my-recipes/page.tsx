"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients?: string[];
  imageUrl?: string;
}

export default function MyRecipes() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🛠 Ensuring `loadUserRecipes` is stable
  const loadUserRecipes = useCallback(() => {
    if (!user) return;
    const storedFavorites = localStorage.getItem(`favorites_${user.uid}`);
    const storedHistory = localStorage.getItem(`history_${user.uid}`);
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    setHistory(storedHistory ? JSON.parse(storedHistory) : []);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setFavorites([]);
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserRecipes();
    }
  }, [user, loadUserRecipes]); // ✅ Added `loadUserRecipes` to dependencies

  useEffect(() => {
    fetch("/recipes.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAllRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes.");
        setLoading(false);
      });
  }, []);

  const saveRecipe = (recipe: Recipe, type: "favorites" | "history") => {
    if (!user) {
      setError("You must be logged in to save recipes.");
      return;
    }

    const stateSetter = type === "favorites" ? setFavorites : setHistory;
    const existingList = type === "favorites" ? favorites : history;
    const updatedList = existingList.some((r) => r.id === recipe.id)
      ? existingList.filter((r) => r.id !== recipe.id) // Remove if already exists
      : [...existingList, recipe]; // Add if not exists

    stateSetter(updatedList);
    localStorage.setItem(`${type}_${user.uid}`, JSON.stringify(updatedList));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Recipes</h1>
      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {[
            { title: "Favorites", data: favorites, type: "favorites", bgClass: "bg-blue-600 hover:bg-blue-800" },
            { title: "History", data: history, type: "history", bgClass: "bg-green-600 hover:bg-green-800" },
          ].map(({ title, data, type, bgClass }) => (
            <div key={type}>
              <h2 className="text-xl font-semibold mt-6">{title}</h2>
              {data.length === 0 ? (
                <p>No {title.toLowerCase()} found.</p>
              ) : (
                <ul>
                  {data.map((recipe) => (
                    <li key={recipe.id} className="mb-2 p-4 border rounded-lg">
                      <h2 className="text-lg font-semibold">{recipe.name}</h2>
                      <p>{recipe.description}</p>
                      <button
                        onClick={() => saveRecipe(recipe, type)}
                        className={`mt-2 px-4 py-2 text-white rounded ${bgClass}`}
                      >
                        {data.some((item) => item.id === recipe.id) ? "Remove" : `Save to ${title}`}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
