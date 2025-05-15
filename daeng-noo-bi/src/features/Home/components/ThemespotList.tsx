import ThemeSelector from "../../theme/components/ThemeSelector/ThemeSelector";
import { ThemeKey, themeMap } from "../../theme/constants/themeConstants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ThemespotList = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | null>(null);

  const handleThemeSelect = (theme: ThemeKey) => {
    setSelectedTheme(theme);
    navigate(`/theme?selected=${theme}`);
  };

  return (
    <div className="ThemespotList">
      <ThemeSelector
        selectedTheme={selectedTheme}
        onSelect={handleThemeSelect}
      />
    </div>
  );
};

export default ThemespotList;
