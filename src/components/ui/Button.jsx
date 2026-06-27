import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

export default function Button({ variant = 'default', children, iconRight, onClick, title, className = '', type = 'button', ...props }) {
  const baseCls = {
    default: 'btn btn-default',
    alternate: 'btn btn-alt',
    secondary: 'btn btn-secondary',
    link: 'btn btn-link',
  }[variant] || 'btn btn-default';

  const cls = `${baseCls} ${className}`.trim();

  return (
    <motion.button
      type={type}
      className={cls}
      onClick={onClick}
      title={title || (typeof children === 'string' ? children : '')}
      whileHover={props.disabled ? undefined : { scale: 1.03 }}
      whileTap={props.disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        pointerEvents: props.disabled ? 'none' : 'auto',
        ...props.style
      }}
      {...props}
    >
      {children}
      {iconRight && <Icon name="chevron_right" />}
    </motion.button>
  );
}
