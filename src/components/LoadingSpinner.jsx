// src/components/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({ size = 5, color = 'border-current' }) {
  // size in rem units, default 1.25rem (5 × 0.25rem)
  return (
    <div
      className={`w-${size} h-${size} border-2 ${color} border-t-transparent rounded-full animate-spin`}
    />
  );
}