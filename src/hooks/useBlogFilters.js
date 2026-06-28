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

  const { minDate, maxDate } = React.useMemo(() => {
    if (!posts || posts.length === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      return { minDate: '2015-01-01', maxDate: todayStr };
    }
    
    let minTime = Infinity;
    let maxTime = -Infinity;
    
    posts.forEach(p => {
      const dateStr = p.published_at || p.created_at;
      if (dateStr) {
        const time = new Date(dateStr).getTime();
        if (!isNaN(time)) {
          if (time < minTime) minTime = time;
          if (time > maxTime) maxTime = time;
        }
      }
    });
    
    // Default fallback dates if no valid dates found
    const minD = minTime === Infinity ? '2015-01-01' : new Date(minTime).toISOString().split('T')[0];
    const maxD = maxTime === -Infinity ? new Date().toISOString().split('T')[0] : new Date(maxTime).toISOString().split('T')[0];
    
    return { minDate: minD, maxDate: maxD };
  }, [posts]);

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
    filteredPosts,
    minDate,
    maxDate
  };
}
