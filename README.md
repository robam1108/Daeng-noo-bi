<h1 align=center>
 댕누비 (Daeng-Noo-Bi)
</h1>
<div align=center>
    <img src="https://github.com/robam1108/img/blob/main/daeng-noo-bi.gif"><br/>
배포주소 : https://daeng-noo-bi.vercel.app/
</div>

## 🐾 프로젝트 소개

댕누비는 반려동물과 함께하는 관광지를 소개하는 웹사이트입니다. 한국관광공사의 공공 API를 활용하여 사용자들이 손쉽게 반려동물 친화적 관광지 정보를 얻고, 여행 계획을 세울 수 있도록 도와줍니다.

* 개발자: <a target="_blank" href="https://github.com/orinery">orinery</a> | <a target="_blank" href="https://github.com/robam1108">robam</a>
* 상세 일정 및 업무 분배: <a href="https://www.notion.so/Daeng-Noo-bi-1df07f340efa8014b73dd0463e528c67?pvs=4" target="_blank">노션 링크</a>
* 개발 기간: 2025.04.24 ~ 2025.05.20

---

## 🛠 개발 환경

* 운영체제: Windows 11
* IDE: VS Code
* 버전 관리: GitHub
* 배포 환경: Vercel, Firebase

---

## 🧩 기술 스택

### Frontend

[![My Skills](https://skillicons.dev/icons?i=react,vite,typescript,scss)](https://skillicons.dev)

### Backend

[![My Skills](https://skillicons.dev/icons?i=firebase,vercel)](https://skillicons.dev)

### API

<img src="https://img.shields.io/badge/한국관광공사API-2F80ED.svg?style=for-the-badge&logo=visual-studio-code&logoColor=22ABF3" /> 
<img src="https://img.shields.io/badge/지도API-03C75A.svg?style=for-the-badge&logo=naver&logoColor=black" /> 
<img src="https://img.shields.io/badge/블로그API-FFCD00.svg?style=for-the-badge&logo=kakao&logoColor=20232a" />

---

## 🌟 주요 기능

### 공통 기능

* 로그인 상태에 따른 메뉴 구성
* 검색 및 필터링 기능
* 로딩 및 에러 처리

### 메인 페이지

* 광고용 배너 컴포넌트
* 인기/지역/테마 카테고리 컴포넌트를 통한 빠른 페이지 이동 기능

### 인기 페이지

* 관광지 찜 인기순으로 정렬 및 표시
* 관광지별 블로그 후기 연동

### 지역/테마 페이지

* 관광지 리스트 컴포넌트
* 상세페이지 연결 기능

### 상세 페이지

* 관광지 상세 정보 출력
* 공유하기 기능
* 찜하기 기능
* 지도 API를 이용한 위치 표시

### 로그인/회원가입

* 소셜 로그인 및 이메일 로그인
* 회원가입 및 이메일 인증
* 로그인 상태 유지 기능

### 찜목록 페이지

* 찜목록 관리

### 회원정보 수정

* 회원정보 수정 기능

---

## 🗂 프로젝트 아키텍쳐

```
DAENG-NOO-BI
├── api/                       # 서버리스/백엔드 API 라우트 (Vercel 등)
├── functions/                 # Firebase Functions 백엔드 코드
├── public/                    # 정적 파일 (favicon, index.html 등)
└── src/
    ├── assets/                # 이미지, 폰트 등 정적 리소스
    ├── features/              # 주요 기능별 페이지 및 해당 컴포넌트
    │   ├── Detail/            # 관광지 상세 페이지
    │   ├── EditProfile/       # 회원정보 수정
    │   ├── Favorites/         # 찜목록
    │   ├── Home/              # 메인(홈) 화면
    │   ├── Login/             # 로그인
    │   ├── NotFound/          # 404 에러 페이지
    │   ├── Popular/           # 인기 관광지
    │   ├── region/            # 지역별 관광지
    │   ├── SearchResults/     # 검색 결과
    │   ├── Signup/            # 회원가입
    │   └── theme/             # 테마별 관광지
    ├── shared/                # 전역(공통) 코드
    │   ├── api/               # API 호출 함수/로직
    │   ├── components/        # 공통 UI 컴포넌트
    │   ├── constants/         # 상수/설정값
    │   ├── context/           # React Context, 전역 상태 관리
    │   ├── hooks/             # 커스텀 훅
    │   ├── utils/             # 유틸 함수
    │   ├── App.scss           # 전체 스타일
    │   ├── App.tsx            # 앱 진입점 (최상위 컴포넌트)
    │   ├── firebase.ts        # Firebase 초기화/설정
    │   └── index.scss         # 전역 스타일
```

---

