import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

export default function Button({ variant = 'default', children, iconRight, onClick, title, className = '' }) {
  const baseCls = {
    default: 'btn btn-default',
    alternate: 'btn btn-alt',
    secondary: 'btn btn-secondary',
    link: 'btn btn-link',
  }[variant] || 'btn btn-default';

  const cls = `${baseCls} ${className}`.trim();

  return (
    <motion.button
      className={cls}
      onClick={onClick}
      title={title || (typeof children === 'string' ? children : '')}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
      {iconRight && <Icon name="chevron_right" />}
    </motion.button>
  );
}
