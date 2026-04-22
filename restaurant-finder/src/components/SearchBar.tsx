import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (postcode: string) => void;
  isLoading?: boolean;
}

// Fixed the syntax here: Added the closing paren ) after the type definition
export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedPostcode = postcode.trim();
    if (trimmedPostcode) {
      onSearch(trimmedPostcode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter UK postcode (e.g., EC4M 7RF)"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-jet-orange transition-colors text-lg"
          disabled={isLoading}
          aria-label="UK Postcode"
        />
        <button
          type="submit"
          disabled={isLoading || !postcode.trim()}
          className="px-8 py-3 bg-jet-orange text-white font-semibold rounded-lg hover:bg-jet-orange-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Quick example postcodes */}
      <div className="mt-3 text-sm text-gray-600">
        <span className="font-medium">Try these: </span>
        {['EC4M 7RF', 'SW1A 1AA', 'M16 0RA'].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setPostcode(example)}
            className="ml-2 text-jet-orange hover:underline"
            disabled={isLoading}
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}