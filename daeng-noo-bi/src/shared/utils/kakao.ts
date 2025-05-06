// src/shared/utils/kakao.ts
declare global {
  interface Window {
    Kakao: any;
  }
}

// kakao.ts

let kakaoInitPromise: Promise<void> | null = null;

export const initKakao = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.reject("서버에서는 실행되지 않습니다.");

  if (kakaoInitPromise) return kakaoInitPromise;

  kakaoInitPromise = new Promise((resolve, reject) => {
    const waitForKakao = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
          console.log("✅ Kakao SDK 초기화 완료");
        }
        resolve();
      } else {
        console.warn("⌛ Kakao SDK 로딩 대기 중...");
        setTimeout(waitForKakao, 100); // 100ms마다 다시 체크
      }
    };

    waitForKakao();
  });

  return kakaoInitPromise;
};


export const loginWithKakao = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      success: async () => {
        try {
          const res = await window.Kakao.API.request({
            url: "/v2/user/me",
          });
          const kakaoUid = res.id.toString();
          resolve(kakaoUid);
        } catch (err: any) {
          console.error("카카오 사용자 정보 요청 실패", err);
          reject("사용자 정보 요청 실패");
        }
      },
      fail: (err: any) => {
        console.error("카카오 로그인 실패", err);
        reject("카카오 로그인 실패");
      },
    });
  });
};
