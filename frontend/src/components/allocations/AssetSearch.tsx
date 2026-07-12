import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AssetSearchProps {
  onSearch: (term: string) => void;
}

export function AssetSearch({ onSearch }: AssetSearchProps) {
  const [term, setTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
        placeholder="Search assets by tag (e.g., AF-0194), name, or serial number..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button 
        type="submit"
        className="absolute inset-y-1.5 right-1.5 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        Search
      </button>
    </form>
  );
}
