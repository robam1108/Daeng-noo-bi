export interface RegionInfo {
  name: string;        
  code: number;        
  className: string;  
}

export const REGION_CODES: RegionInfo[] = [
  { name: '서울', code: 1, className: 'seoul' },
  { name: '인천', code: 2, className: 'incheon' },
  { name: '대전', code: 3, className: 'daejeon' },
  { name: '대구', code: 4, className: 'daegu' },
  { name: '광주', code: 5, className: 'gwangju' },
  { name: '부산', code: 6, className: 'busan' },
  { name: '울산', code: 7, className: 'ulsan' },
  { name: '세종', code: 8, className: 'sejong' },
  { name: '경기', code: 31, className: 'gyeonggi' },
  { name: '강원', code: 32, className: 'gangwon' },
  { name: '충북', code: 33, className: 'chungbuk' },
  { name: '충남', code: 34, className: 'chungnam' },
  { name: '전북', code: 35, className: 'jeonbuk' },
  { name: '전남', code: 36, className: 'jeonnam' },
  { name: '경북', code: 37, className: 'gyeongbuk' },
  { name: '경남', code: 38, className: 'gyeongnam' },
  { name: '제주', code: 39, className: 'jeju' },
];

export const regionMap: Record<number, RegionInfo> =
  REGION_CODES.reduce((acc, info) => {
    acc[info.code] = info;
    return acc;
  }, {} as Record<number, RegionInfo>);