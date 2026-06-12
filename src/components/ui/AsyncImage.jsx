import React, { useState } from 'react';

export default function AsyncImage({ src, alt, className, style, fallbackGradient }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {/* Skeleton / Gradient Placeholder */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: fallbackGradient, 
          opacity: loaded ? 0 : 1, 
          transition: 'opacity 0.5s ease',
          zIndex: 1,
        }} 
      />
      {/* Shimmer effect over the gradient */}
      {!loaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0, bottom: 0, width: '50%',
            zIndex: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            animation: 'shimmer 1.5s infinite linear',
          }}
        />
      )}
      
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        style={{ 
          display: 'block',
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          opacity: loaded ? 1 : 0, 
          transition: 'opacity 0.5s ease',
          position: 'absolute', 
          inset: 0, 
          zIndex: 3 
        }} 
      />
    </div>
  );
}
