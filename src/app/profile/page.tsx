"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import { getUserProfile, getFavoriteRecipes, fetchRecipesByIds } from "@/lib/firestore"; 
import Image from "next/image";

interface UserProfile {
  name: string;
  bio: string;
  profileImage: string;
  followers: number;
  following: number;
  contributedRecipes: number;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
}

export default function Profile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        try {
          // Fetch user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile({
              name: userProfile.name || "Anonymous",
              bio: userProfile.bio || "Food Lover & Recipe Creator",
              profileImage: userProfile.profileImage || "/images/profile-placeholder.jpg",
              followers: userProfile.followers || 0,
              following: userProfile.following || 0,
              contributedRecipes: userProfile.contributedRecipes || 0,
            });
          }

          // Fetch saved recipes
          const recipeIds = await getFavoriteRecipes(user.uid);
          const recipes = await fetchRecipesByIds(recipeIds);
          setSavedRecipes(recipes);
        } catch (error) {
          console.error("Error loading profile data:", error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return <p className="text-center text-red-500 text-xl mt-10">Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p className="text-center text-gray-500 text-xl mt-10">Loading profile...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-20 h-20">
          <Image
            src={profile?.profileImage ?? "/images/profile-placeholder.jpg"}
            alt={`${profile?.name}'s Profile Picture`}
            layout="fill"
            objectFit="cover"
            className="rounded-full border-2 border-red-500"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{profile?.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{profile?.bio}</p>
        </div>
      </div>

      {/* Saved Recipes Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Saved Recipes</h2>
        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="relative w-full h-32">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <p className="text-lg font-medium mt-2">{recipe.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No saved recipes yet.</p>
        )}
      </div>

      {/* Recipe Contribution Stats */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Recipe Contribution Stats</h2>
        <p className="text-lg">
          Recipes Contributed: <span className="font-bold text-red-500">{profile?.contributedRecipes || 0}</span>
        </p>
      </div>

      {/* Friends & Followers */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Friends & Followers</h2>
        <div className="flex space-x-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-lg font-medium">{profile?.followers || 0} Followers</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-lg font-medium">{profile?.following || 0} Following</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="text-center">
        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
