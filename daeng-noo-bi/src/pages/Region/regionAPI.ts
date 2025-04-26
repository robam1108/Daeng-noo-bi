import { fetchTourAPI } from '../../api/fetcher';

export const fetchPetFriendlyPlacesByRegion = async (areaCode: number, page: number = 1) => {
  const params = {
    areaCode: String(areaCode),
    pageNo: String(page),
    numOfRows: '9',
  };

  return await fetchTourAPI('KorPetTourService', 'areaBasedList', params); 
};

export const fetchDetailImage = async (contentId: number) => {
  const params = {
    contentId: String(contentId),
  };
  return await fetchTourAPI('KorPetTourService', 'detailImage', params);
};


export const filterHighQualityImages = (urls: string[]): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!urls.length) return resolve(null);

    let checked = 0;

    for (const url of urls) {
      const img = new Image();
      img.src = url.startsWith('http') ? url.replace('http://', 'https://') : url;

      img.onload = () => {
        checked++;

        if (img.width >= 600 && img.height >= 400 && img.width <= 1200 && img.height <= 1000) {  // 원하는 해상도 기준
          resolve(img.src);  // 고화질이면 바로 리턴
        } else if (checked === urls.length) {
          resolve(null);  // 다 체크했는데 없으면 null
        }
      };

      img.onerror = () => {
        checked++;
        if (checked === urls.length) {
          resolve(null);
        }
      };
    }
  });
};