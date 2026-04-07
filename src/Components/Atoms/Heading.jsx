import React from 'react';

const Heading = ({ level = 1, children, className = "", align = "center", color = "text-blue-600", spacing = "mb-6", ...props }) => {
  const Tag = `h${level}`;
  const sizeClasses = {
    1: 'text-4xl font-black italic tracking-tighter',
    2: 'text-3xl font-black tracking-tight',
    3: 'text-2xl font-bold',
    4: 'text-xl font-semibold',
  };

  return (
    <Tag className={`${sizeClasses[level]} text-${align} ${color} ${spacing} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;
