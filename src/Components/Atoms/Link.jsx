import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ href = "#", children, className = "", isExternal = false, ...props }) => {
  const commonClasses = `text-blue-600 hover:text-blue-800 font-black transition-all hover:translate-x-1 inline-block ${className}`;

  if (isExternal) {
    return <a href={href} className={commonClasses} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  }

  return (
    <RouterLink to={href} className={commonClasses} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
