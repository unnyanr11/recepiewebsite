"use client";

import Link from "next/link";
import Image from "next/image"; // ✅ Use Next.js Image component
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    image: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} passHref>
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        className="border rounded-lg shadow-md overflow-hidden transition-transform duration-200 cursor-pointer bg-red-500 dark:bg-red-900 hover:shadow-lg"
      >
        <Image 
          src={recipe.image} 
          alt={recipe.title} 
          width={400} 
          height={300} 
          className="w-full h-40 object-cover"
          priority
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-white dark:text-gray-200">{recipe.title}</h2>
        </div>
      </motion.div>
    </Link>
  );
}
