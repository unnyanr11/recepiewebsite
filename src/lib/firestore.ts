impo { 
  doc, getDoc, updateDoc, arrayUnion, setDoc, 
  collection, query, where, getDocs 
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";  // Ensure this path is correct

// Define the Recipe type if not already imported
interface Recipe {
  id: string;
  title: string;
  image: string;
}

// Add a recipe to favorites
export const addFavoriteRecipe = async (userId: string, recipeId: string): Promise<{ success: boolean; message: string }> => {
  try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
          await setDoc(userRef, { favorites: [recipeId] }, { merge: true });
      } else {
          await updateDoc(userRef, { favorites: arrayUnion(recipeId) });
      }

      return { success: true, message: "Recipe added to favorites!" };
  } catch (error) {
      console.error("Error adding to favorites:", error);
      return { success: false, message: "Failed to add to favorites." };
  }
};

// Get user's favorite recipes
export const getFavoriteRecipes = async (userId: string): Promise<string[]> => {
  try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      return userSnap.exists() ? userSnap.data()?.favorites ?? [] : [];
  } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
  }
};

// Add a recipe to cooking history
export const addToHistory = async (userId: string, recipeId: string): Promise<{ success: boolean; message: string }> => {
  try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { history: arrayUnion(recipeId) }, { merge: true });
      return { success: true, message: "Recipe added to cooking history!" };
  } catch (error) {
      console.error("Error adding to history:", error);
      return { success: false, message: "Failed to add to history." };
  }
};

// Get user's cooking history
export const getCookingHistory = async (userId: string): Promise<string[]> => {
  try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      return userSnap.exists() ? userSnap.data()?.history ?? [] : [];
  } catch (error) {
      console.error("Error getting history:", error);
      return [];
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
  }
};

// Fetch multiple recipes by their IDs
export const fetchRecipesByIds = async (recipeIds: string[]): Promise<Recipe[]> => {
  if (!recipeIds.length) return [];

  try {
      const recipesRef = collection(db, "recipes");
      const q = query(recipesRef, where("id", "in", recipeIds));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          image: doc.data().image,
      }));
  } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
  }
};
