import imageCompression from 'browser-image-compression';

// 이미지 URL을 압축해서 새로운 URL로 만들어주는 함수
export async function compressImageFromUrl(imageUrl: string): Promise<string> {
  try {
    // 1. fetch해서 blob으로 변환
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();

    // 2. blob을 File로 변환
    const file = new File([blob], 'image.jpg', { type: blob.type });

    // 3. 압축 옵션 설정
    const options = {
      maxSizeMB: 0.5, // 최대 0.5MB
      maxWidthOrHeight: 1200, // 가로 세로 최대 1200px
      useWebWorker: true,
    };

    // 4. 압축
    const compressedFile = await imageCompression(file, options);

    // 5. 압축된 파일을 Blob URL로 변환
    const compressedUrl = URL.createObjectURL(compressedFile);

    return compressedUrl;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    return imageUrl; // 실패하면 원본 URL 그대로 사용
  }
}