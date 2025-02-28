"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const recipeSuggestions = ["Pancakes", "Grilled Chicken", "Pasta", "Salad", "Omelette", "Soup"];

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(savedSearches);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    
    if (!recentSearches.includes(searchQuery)) {
      const updatedSearches = [searchQuery, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imgUrl = URL.createObjectURL(event.target.files[0]);
      setImage(imgUrl);
    }
  };

  const handleImageSearch = () => {
    if (image) {
      window.open(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(image)}`, "_blank");
    }
  };

  useEffect(() => {
    if (query) {
      setSuggestions(recipeSuggestions.filter((recipe) => recipe.toLowerCase().includes(query.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search recipes..."
        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <span className="absolute left-3 top-2 text-gray-400 dark:text-gray-500">🔍</span>

      {suggestions.length > 0 && (
        <ul className="absolute bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 w-full shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => handleSearch(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {recentSearches.length > 0 && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <p>Recent Searches:</p>
            <button className="text-red-500 text-xs" onClick={handleClearRecentSearches}>Clear</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {recentSearches.map((search, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded cursor-pointer"
                onClick={() => handleSearch(search)}
              >
                {search}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center border border-gray-300 rounded-lg bg-white p-2 cursor-pointer dark:border-gray-700 dark:bg-gray-700 w-fit">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden"
          id="imageUpload"
        />
        <label htmlFor="imageUpload" className="cursor-pointer text-gray-600 dark:text-gray-300">📷 Upload</label>
      </div>

      {image && (
        <div className="relative mt-2 flex items-center">
          <Image src={image} alt="Selected" className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex flex-col ml-2 space-y-1">
            <button
              className="bg-white p-1 rounded-full shadow-md text-red-500"
              onClick={() => setImage(null)}
            >
              ❌
            </button>
            <button
              className="bg-white p-1 rounded-full shadow-md text-green-500"
              onClick={handleImageSearch}
            >
              ✅
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
