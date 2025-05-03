// src/api/externalAPI.ts

import { fetchPetFriendlyPlacesByRegion } from '../../features/region/api/regionAPI';
import { fetchPlacesByTheme }         from '../../features/theme/api/themeAPI';


export const fetchRegionPlacesFromAPI = fetchPetFriendlyPlacesByRegion;

export const fetchThemePlacesFromAPI = fetchPlacesByTheme;
