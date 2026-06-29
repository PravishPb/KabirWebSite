import React from 'react';
import Icon from './Icon';
import './EventSearch.css';

export default function EventSearch({ value, onChange, placeholder = 'Search events...' }) {
  return (
    <div className="event-search-wrapper">
      <div className="event-search-input-container">
        <Icon name="search" className="event-search-icon" size={20} />
        <input
          type="text"
          className="event-search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="event-search-clear-btn"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
