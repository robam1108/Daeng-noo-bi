const API_KEY = import.meta.env.VITE_TOUR_API_KEY;
// const BASE_URL = 'https://apis.data.go.kr/B551011';
const BASE_URL = '/api';

export async function fetchTourAPI(
  service: string,
  operation: string,
  params: Record<string, string>
) {
  const commonParams = {
    ...params,
    ServiceKey: API_KEY,
    MobileOS: 'ETC',
    MobileApp: 'PetTourApp',
    _type: 'json',
  };

  const queryString = new URLSearchParams(commonParams).toString();
  const url = `${BASE_URL}/${service}/${operation}?${queryString}`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('Content-Type');

    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('응답 형식 오류. HTML 또는 XML 반환됨:\n', text);
      throw new Error('API에서 JSON이 아닌 응답이 왔습니다.');
    }

    const json = await response.json();
    return json.response?.body?.items?.item ?? [];
  } catch (error) {
    console.error(`API 호출 실패: ${operation}`, error);
    throw error;
  }
}