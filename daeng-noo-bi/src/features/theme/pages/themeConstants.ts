export type ThemeKey =
  | 'healing'
  | 'adventure'
  | 'culture'
  | 'food'
  | 'photospot';

export interface ThemeInfo {
  key: ThemeKey;      
  title: string;      
  ids: number[];      
  className: string;  
}

export const THEMES: ThemeInfo[] = [
  {
    key: 'healing',
    title: '힐링 & 휴식',
    ids: [32, 25, 12],
    className: 'healing',
  },
  {
    key: 'food',
    title: '맛집 & 카페',
    ids: [39],
    className: 'food',
  },
  {
    key: 'culture',
    title: '문화 & 역사 체험',
    ids: [14, 15],
    className: 'culture',
  },
  {
    key: 'adventure',
    title: '액티비티 & 모험',
    ids: [28, 32, 25],
    className: 'adventure',
  },

];

// 빠른 lookup을 위한 Record
export const themeMap: Record<ThemeKey, ThemeInfo> =
  THEMES.reduce((acc, theme) => {
    acc[theme.key] = theme;
    return acc;
  }, {} as Record<ThemeKey, ThemeInfo>);