// utils/throttle.ts
// API 요청 빈도 줄이기 
export function throttle(func: () => void, limit: number) {
  let inThrottle: boolean;

  return function () {
    if (!inThrottle) {
      func();
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}