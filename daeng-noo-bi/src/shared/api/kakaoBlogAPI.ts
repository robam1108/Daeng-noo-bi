// src/api/kakaoBlogAPI.ts
export interface BlogPost {
  title:    string;  // 글 제목 (HTML 태그 제거)
  url:      string;  // 글 URL
  blogname: string;  // 블로그 이름
  datetime: string;  // 작성 일시 (ISO 형태)
  thumbnail?: string; 
}

/**
 * 카카오 블로그 검색 REST API 호출
 * @param query 검색어
 * @param size  가져올 글 개수 (기본 3)
 */
export async function fetchBlogPosts(
  query: string,
  size = 3
): Promise<BlogPost[]> {
  const url = new URL("https://dapi.kakao.com/v2/search/blog");
  url.searchParams.set("query", query);
  url.searchParams.set("size", String(size));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Kakao Blog API 에러: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return (json.documents as any[]).map((doc) => ({
    title:    doc.title.replace(/<[^>]+>/g, ""), 
    url:      doc.url,
    blogname: doc.blogname,
    datetime: doc.datetime,
    thumbnail: doc.thumbnail,
  }));
}
