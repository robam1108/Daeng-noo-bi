// src/api/detailAPI.ts
import { fetchTourAPI } from "./fetcher";

export async function fetchDetailImage(
  contentId: string
): Promise<{ imageUrl?: string }> {
  // detailImage 시도
  try {
    const images = await fetchTourAPI(
      "KorPetTourService",
      "detailImage",
      { contentId }
    );
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0] as any;

      const url = first.originimgurl || first.imageUrl || first.smallimageurl;
      if (url) {
        return { imageUrl: url };
      }
    }
  } catch (e) {
    console.warn("[detailImage 에러]", e);
  }

  // detailCommon 시도
  try {
    const commons = await fetchTourAPI(
      "KorPetTourService",
      "detailCommon",
      {
        contentId,
        defaultYN: "Y",
        firstImageYN: "Y",
        introYN: "N",
      }
    );

    if (Array.isArray(commons) && commons.length > 0) {
      const first = commons[0] as any;
      const url = first.firstimage || first.originimgurl || first.imageUrl;
      if (url) {
        return { imageUrl: url };
      }
    }
  } catch (e) {
    console.warn("[detailCommon 에러]", e);
  }

  return {};
}
