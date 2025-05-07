import ThemeSelector from "../../theme/components/ThemeSelector/ThemeSelector"
import { ThemeKey, themeMap } from "../../theme/constants/themeConstants"
import { useState } from "react"
const ThemespotList = () => {
    const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("nature");

    return (
        <div className="ThemespotList">
            <ThemeSelector selectedTheme={selectedTheme} onSelect={setSelectedTheme} />
        </div>
    )
}

export default ThemespotList