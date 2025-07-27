import React from 'react';

const AnimatedGradientText = ({ children, className }) => (
    <span className={`inline-flex animate-text-gradient bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 bg-[200%_auto] bg-clip-text text-transparent ${className}`}>

        {children}
    </span>
);

export default AnimatedGradientText;