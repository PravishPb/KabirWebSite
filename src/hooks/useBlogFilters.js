import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useBlogFilters(posts) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter') || 'All';

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(filter);
  const [dateOperator, setDateOperator] = React.useState('All');
  const [filterDate, setFilterDate] = React.useState('');
  const [filterEndDate, setFilterEndDate] = React.useState('');

  React.useEffect(() => {
    setSelectedCategory(filter);
  }, [filter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setDateOperator('All');
    setFilterDate('');
    setFilterEndDate('');
    navigate(location.pathname, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(location.search);
    if (cat === 'All') {
      params.delete('filter');
    } else {
      params.set('filter', cat);
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const categories = React.useMemo(() => {
    return ['All', ...new Set(posts.flatMap(p => {
      // Admin dashboard uses p.category or p.categories. We normalise them.
      if (Array.isArray(p.categories)) return p.categories;
      if (p.category) return [p.category];
      return [];
    }).filter(Boolean))];
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter(p => {
      // Normalise categories array for the filter check
      const postCats = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);

      // 1. Category Filter
      if (selectedCategory !== 'All' && !postCats.includes(selectedCategory)) {
        return false;
      }
      
      // 2. Date Filter (Dynamic Operators & Calendar Pickers)
      if (dateOperator !== 'All') {
        // Fallback: If `published_at` is missing, try `created_at` (used in Admin sometimes)
        const dateString = p.published_at || p.created_at;
        if (!dateString) return false;
        const postDate = new Date(dateString);
        postDate.setHours(0, 0, 0, 0);

        const fDate = filterDate ? new Date(filterDate) : null;
        if (fDate) fDate.setHours(0, 0, 0, 0);

        const fEndDate = filterEndDate ? new Date(filterEndDate) : null;
        if (fEndDate) fEndDate.setHours(0, 0, 0, 0);

        if (dateOperator === 'After' && fDate) {
          if (postDate <= fDate) return false;
        } else if (dateOperator === 'Before' && fDate) {
          if (postDate >= fDate) return false;
        } else if (dateOperator === 'On' && fDate) {
          if (postDate.getTime() !== fDate.getTime()) return false;
        } else if (dateOperator === 'Between' && fDate && fEndDate) {
          if (postDate < fDate || postDate > fEndDate) return false;
        }
      }
      
      // 3. Search text matching
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const excerptMatch = (p.excerpt || '').toLowerCase().includes(q);
        const contentMatch = p.content ? p.content.toLowerCase().includes(q) : false;
        if (!titleMatch && !excerptMatch && !contentMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [posts, selectedCategory, dateOperator, filterDate, filterEndDate, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    handleCategoryChange,
    dateOperator,
    setDateOperator,
    filterDate,
    setFilterDate,
    filterEndDate,
    setFilterEndDate,
    handleResetFilters,
    categories,
    filteredPosts
  };
}
