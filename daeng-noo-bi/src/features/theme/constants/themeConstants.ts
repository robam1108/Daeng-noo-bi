export type ThemeKey =
  | 'nature'         // A01
  | 'culture'        // A02
  | 'adventure'      // A03
  | 'shopping'       // A04
  | 'food'           // A05
  | 'accommodation'; // B02

export interface ThemeInfo {
  key:       ThemeKey;
  title:     string;
  code:      string; // cat1 코드
  className: string;
}

/**
 * 셀렉터에 보여줄 테마 목록
 */
export const THEMES: ThemeInfo[] = [
  { key: 'nature',        title: '자연힐링',    code: 'A01',  className: 'nature' },
  { key: 'accommodation', title: '펫캉스',     code: 'B02', className: 'accommodation' },
  { key: 'culture',       title: '문화산책', code: 'A02', className: 'culture' },
  { key: 'shopping',      title: '쇼핑투어', code: 'A04', className: 'shopping' },
  { key: 'food',          title: '미식여행', code: 'A05', className: 'food' },
  { key: 'adventure',     title: '액티비티', code: 'A03', className: 'adventure' },
];

export const themeMap: Record<ThemeKey, ThemeInfo> = THEMES.reduce(
  (acc, theme) => {
    acc[theme.key] = theme;
    return acc;
  },
  {} as Record<ThemeKey, ThemeInfo>
);