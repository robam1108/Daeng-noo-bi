import React from 'react';
import { ThemeInfo, THEMES } from '../constants/themeConstants';
import './ThemeSelector.scss';

interface Props {
  selectedTheme: ThemeInfo['key'];
  onSelect: (theme: ThemeInfo['key']) => void;
}

export default function ThemeSelector({ selectedTheme, onSelect }: Props) {
  return (
    <div className="theme-selector-wrapper">
      {THEMES.map(({ key, title, className }) => (
        <button
          key={key}
          className={`theme-selector-button ${className} ${selectedTheme === key ? 'active' : ''}`}
          onClick={() => onSelect(key)}
          aria-label={title}
        >
          <div className="theme-title">{title}</div>
        </button>
      ))}
    </div>
  );
}