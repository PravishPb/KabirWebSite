import React from 'react';
import Icon from './Icon';
import { useApp } from '../../context/AppContext';
import './BlogFilters.css';

export default function BlogFilters({ 
  filters, 
  onFilterChange // an optional callback to reset pagination on the parent, since pagination isn't in the hook
}) {
  const { lang } = useApp();
  
  const {
    searchQuery, setSearchQuery,
    selectedCategory, handleCategoryChange,
    dateOperator, setDateOperator,
    filterDate, setFilterDate,
    filterEndDate, setFilterEndDate,
    handleResetFilters,
    categories
  } = filters;

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (onFilterChange) onFilterChange();
  };

  const handleReset = () => {
    handleResetFilters();
    if (onFilterChange) onFilterChange();
  };

  return (
    <div className="blog-filters-panel">
      <div className="blog-search-wrapper">
        <Icon name="search" size={20} className="blog-search-icon" />
        <input
          type="text"
          className="blog-search-input"
          placeholder={lang === 'HI' ? 'ब्लॉग खोजें...' : 'Search blogs...'}
          value={searchQuery}
          onChange={handleChange(setSearchQuery)}
        />
        {searchQuery && (
          <button className="blog-search-clear" onClick={() => { setSearchQuery(''); if (onFilterChange) onFilterChange(); }}>
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      <div className="blog-dropdown-filters">
        <div className="blog-filter-select-wrapper">
          <label className="blog-filter-label">{lang === 'HI' ? 'श्रेणी' : 'Category'}</label>
          <select
            className="blog-filter-select"
            value={selectedCategory}
            onChange={(e) => {
              handleCategoryChange(e.target.value);
              if (onFilterChange) onFilterChange();
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? (lang === 'HI' ? 'सभी श्रेणियां' : 'All Categories') : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="blog-filter-select-wrapper">
          <label className="blog-filter-label">{lang === 'HI' ? 'तारीख फ़िल्टर' : 'Date Filter'}</label>
          <select
            className="blog-filter-select"
            value={dateOperator}
            onChange={(e) => {
              setDateOperator(e.target.value);
              if (e.target.value === 'All') {
                setFilterDate('');
                setFilterEndDate('');
              }
              if (onFilterChange) onFilterChange();
            }}
          >
            <option value="All">{lang === 'HI' ? 'सभी तारीखें' : 'All Dates'}</option>
            <option value="After">{lang === 'HI' ? 'के बाद' : 'After'}</option>
            <option value="Before">{lang === 'HI' ? 'से पहले' : 'Before'}</option>
            <option value="On">{lang === 'HI' ? 'को' : 'On'}</option>
            <option value="Between">{lang === 'HI' ? 'के बीच' : 'Between'}</option>
          </select>
        </div>

        {dateOperator !== 'All' && dateOperator !== 'Between' && (
          <div className="blog-filter-select-wrapper">
            <label className="blog-filter-label">{lang === 'HI' ? 'तारीख चुनें' : 'Select Date'}</label>
            <input
              type="date"
              className="blog-date-input"
              value={filterDate}
              onChange={handleChange(setFilterDate)}
            />
          </div>
        )}

        {dateOperator === 'Between' && (
          <>
            <div className="blog-filter-select-wrapper">
              <label className="blog-filter-label">{lang === 'HI' ? 'प्रारंभ तिथि' : 'Start Date'}</label>
              <input
                type="date"
                className="blog-date-input"
                value={filterDate}
                onChange={handleChange(setFilterDate)}
              />
            </div>
            <div className="blog-filter-select-wrapper">
              <label className="blog-filter-label">{lang === 'HI' ? 'अंतिम तिथि' : 'End Date'}</label>
              <input
                type="date"
                className="blog-date-input"
                value={filterEndDate}
                onChange={handleChange(setFilterEndDate)}
              />
            </div>
          </>
        )}

        <button
          className="blog-reset-btn"
          onClick={handleReset}
          title={lang === 'HI' ? 'सभी फ़िल्टर साफ़ करें' : 'Reset all filters'}
        >
          <Icon name="restart_alt" size={18} />
          <span>{lang === 'HI' ? 'साफ़ करें' : 'Reset'}</span>
        </button>
      </div>
    </div>
  );
}
