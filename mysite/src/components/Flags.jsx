import React from "react";

export const CzFlag = ({ className = "w-6 h-4" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-sm overflow-hidden shadow-xs`}>
    <rect width="640" height="480" fill="#fff"/>
    <rect width="640" height="240" y="240" fill="#d7141a"/>
    <path fill="#11457e" d="M0 0l320 240L0 480z"/>
  </svg>
);

export const EnFlag = ({ className = "w-6 h-4" }) => (
  <svg 
    viewBox="0 0 640 480" 
    className={`${className} rounded-sm overflow-hidden ring-1 ring-white/60`}
  >
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#fff" d="m0 0 640 480M640 0 0 480" stroke="#fff" strokeWidth="60"/>
    <path fill="#c8102e" d="m0 0 640 480M640 0 0 480" stroke="#c8102e" strokeWidth="40"/>
    <path fill="#fff" d="M280 0h80v480h-80zM0 200h640v80H0z"/>
    <path fill="#c8102e" d="M300 0h40v480h-40zM0 220h640v40H0z"/>
  </svg>
);