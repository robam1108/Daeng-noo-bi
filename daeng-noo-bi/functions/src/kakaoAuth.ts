// functions/src/kakaoAuth.ts

import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

interface KakaoAuthData {
  kakaoUid: string;
}

export const kakaoAuth = onCall<KakaoAuthData>(async (request) => {
  const { kakaoUid } = request.data;

  if (!kakaoUid) {
    throw new Error("kakaoUid가 전달되지 않았습니다.");
  }

  const uid = `kakao:${kakaoUid}`;
  const token = await admin.auth().createCustomToken(uid);

  return { token };
});