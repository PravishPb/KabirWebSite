import React from 'react';
import Icon from './Icon';

export default function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return (
    <div 
      className={className} 
      style={{ 
        ...style, 
        background: gradient, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.4)'
      }} 
      role="img" 
      aria-label={alt}
    >
      <Icon name="auto_stories" size={64} />
    </div>
  );
}
