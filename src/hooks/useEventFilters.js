import { useState, useMemo } from 'react';

export function useEventFilters(events) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(ev => {
      const titleMatch = (ev.title || '').toLowerCase().includes(q);
      const descMatch = (ev.description || '').toLowerCase().includes(q);
      const locMatch = (ev.location || '').toLowerCase().includes(q);
      return titleMatch || descMatch || locMatch;
    });
  }, [events, searchQuery]);

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredEvents,
    handleResetSearch
  };
}
