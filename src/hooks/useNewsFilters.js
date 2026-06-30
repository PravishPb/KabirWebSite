import { useState, useMemo } from 'react';

export function useNewsFilters(newsItems) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return newsItems;
    const q = searchQuery.toLowerCase();
    return newsItems.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const bodyMatch = (item.body_text || '').toLowerCase().includes(q);
      return titleMatch || bodyMatch;
    });
  }, [newsItems, searchQuery]);

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredNews,
    handleResetSearch
  };
}
