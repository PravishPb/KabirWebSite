import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function ChevronLink({ children, onClick, to }) {
  if (to) {
    return (
      <Link className="link-row" to={to}>
        {children} <Icon name="chevron_right" size={18} />
      </Link>
    );
  }
  return (
    <a
      className="link-row"
      href="#"
      onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
    >
      {children} <Icon name="chevron_right" size={18} />
    </a>
  );
}
