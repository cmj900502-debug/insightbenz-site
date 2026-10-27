/*
 * ▼ 사이트 개인 정보 설정 — 이 파일이 담당자 정보의 단일 원본입니다.
 *   build/build.py 가 이 파일을 읽어 HTML에 값을 직접 넣습니다(값을 바꾼 뒤 `python3 build/build.py` 로 다시 생성).
 *   빈 문자열("")인 항목: 링크·버튼(카카오톡·유튜브·블로그·이메일·외부 폼)은 화면에서 숨겨지고,
 *   주소는 표시하지 않으며, 프로필 사진 자리에는 경력 요약 카드가 표시됩니다.
 *   재생성 없이 값만 바꿔도 site.js가 이름·연락처 등의 텍스트와 링크를 채웁니다.
 */
window.SITE_CONFIG = {
  siteName:   "차민재 팀장 | 메르세데스-벤츠 모터원 고양전시장", // 페이지 제목(<title>)·OG에 쓰는 사이트 이름
  shortName:  "차민재 팀장",           // 헤더 로고 옆 짧은 이름
  name:       "차민재",                // 이름
  title:      "팀장",                  // 직함
  branch:     "모터원 고양전시장",      // 전시장/지점
  dealer:     "메르세데스-벤츠 공식 딜러",     // 딜러사 표기 (전시장명 앞에 붙음: 메르세데스-벤츠 공식 딜러 모터원 고양전시장)
  address:    "",   // [전시장 주소] — 비워두면 표시하지 않음
  phone:      "010-4921-5059",         // 연락처 (tel:01049215059 로 연결)
  kakaoUrl:   "https://open.kakao.com/o/szZ4Y5Ci", // 카카오톡 1:1 상담(오픈채팅) — 비우면 카카오톡 버튼 숨김
  kakaoChannelUrl: "", // [카카오 채널 링크] (리포트 구독용) — 비우면 숨김
  youtubeUrl: "",   // [유튜브 링크] — 비우면 숨김
  blogUrl:    "",   // [블로그 링크] — 비우면 숨김
  formUrl:    "",   // [상담 신청서 링크] (외부 폼을 쓸 경우, 비우면 사이트 내 상담 폼 사용)
  email:      "",   // [이메일] — 비우면 숨김
  photo:      "assets/img/rep/rep.jpg",   // 프로필 사진 경로 예: "assets/img/profile.jpg" (사이트 루트 기준) — 비우면 이니셜 ‘차’ 아바타 표시
  siteUrl:    "https://insightbenz.co.kr/", // 사이트 주소 — canonical·og:url·og:image(assets/img/og-image.jpg)·sitemap.xml·robots.txt 생성
  naverVerification:  "1da62e5718414d47232250f9f36690f2ef79d9ef",   // [네이버 서치어드바이저 content 값] — 채우면 홈 <head> 에 <meta name="naver-site-verification"> 추가
  googleVerification: ""    // [구글 서치콘솔 content 값] — 채우면 홈 <head> 에 <meta name="google-site-verification"> 추가
};
