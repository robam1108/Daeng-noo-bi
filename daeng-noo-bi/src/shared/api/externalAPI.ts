// src/api/externalAPI.ts

import { fetchPetFriendlyPlacesByRegion } from '../../features/region/api/regionAPI';
import { fetchPlacesByTheme } from '../../features/theme/api/themeAPI';
import { fetchDetailIntro } from '../../features/Detail/api/fetchDetailIntro';
import { fetchPlaceImage } from '../../features/Detail/api/fetchImages';
import { fetchPlaceDetail } from './petTourApi';


export const fetchRegionPlacesFromAPI = fetchPetFriendlyPlacesByRegion;

export const fetchThemePlacesFromAPI = fetchPlacesByTheme;

export const fetchPlaceDetailFromAPI = fetchPlaceDetail;

export const fetchDetailIntroFromAPI = fetchDetailIntro;

export const fetchPlaceImageFromAPI = fetchPlaceImage;
