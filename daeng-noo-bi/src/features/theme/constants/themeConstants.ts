// src/constants/themeConstants.ts

/**
 * 테마 키 타입 정의
 * 각 키는 아래 THEMES 배열의 key와 일치해야 합니다.
 */
export type ThemeKey =
  | 'nature'         // 자연
  | 'culture'        // 인문(문화/예술/역사)
  | 'adventure'      // 레포츠
  | 'shopping'       // 쇼핑
  | 'food'           // 음식
  | 'accommodation'; // 숙박

/**
 * 테마 정보를 담는 인터페이스
 */
export interface ThemeInfo {
  key: ThemeKey;    // 내부에서 사용하는 식별자
  title: string;    // UI에 보여줄 한글 제목
  code: string;     // API 호출 시 사용할 categoryCode (exclude 'C01')
  className: string; // CSS/SCSS 모듈용 클래스 이름
}

/**
 * 실제 셀렉터에 보여줄 테마 리스트
 * - 'C01'(추천코스)는 제외했습니다.
 */
export const THEMES: ThemeInfo[] = [
  {
    key: 'nature',
    title: '자연',
    code: 'A01',
    className: 'theme-nature',
  },
  {
    key: 'culture',
    title: '인문(문화/예술/역사)',
    code: 'A02',
    className: 'theme-culture',
  },
  {
    key: 'adventure',
    title: '레포츠',
    code: 'A03',
    className: 'theme-adventure',
  },
  {
    key: 'shopping',
    title: '쇼핑',
    code: 'A04',
    className: 'theme-shopping',
  },
  {
    key: 'food',
    title: '음식',
    code: 'A05',
    className: 'theme-food',
  },
  {
    key: 'accommodation',
    title: '숙박',
    code: 'B02',
    className: 'theme-accommodation',
  },
];
