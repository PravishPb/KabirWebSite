import React from 'react';

export default function Icon({ name, size, className = '', style = {} }) {
  return (
    <span
      className={`ms ${className}`}
      style={{ fontSize: size ? `${size}px` : undefined, ...style }}
    >
      {name}
    </span>
  );
}
