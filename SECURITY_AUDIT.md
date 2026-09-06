# K-Pop Face Test 보안 점검 기록

**점검 일시**: 2026-09-06
**대상**: 정적 Jekyll/PWA 사이트, 브라우저 결과 렌더링, Supabase 익명 댓글·투표 연동

## 이번 코드 점검에서 반영한 항목

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| 사용자/세션 결과 XSS 경계 | 개선 | 결과 데이터 allowlist·숫자 범위 검증, 댓글 답글 닉네임 DOM 렌더링, 업로드 파일 형식·크기 검증 |
| 외부 CDN 공급망 | 개선 | TensorFlow, Teachable Machine, jQuery, Supabase 버전 고정 및 정적 리소스 SRI 적용 |
| 브라우저 보안 헤더 | 저장소 설정 추가 | Netlify `_headers`, Vercel `vercel.json`에 기본 헤더와 CSP Report-Only 추가 |
| SEO 오류면 | 개선 | 공통 metadata, 서버 렌더링 noindex, canonical/OG/feed 링크 정리 |
| Supabase RLS | 확인 필요 | 저장소에 DB 정책 정의가 없어 운영 프로젝트에서 직접 확인해야 함 |
| 댓글 비밀번호 보호 | 미해결 | 현재 익명 댓글 RPC에 입력값을 전달하는 구조. 해시 저장·검증은 별도 DB 작업 필요 |
| 투표 어뷰징 방지 | 부분 개선 | 브라우저 제한은 UX용일 뿐 API 직접 호출을 막지 않음. Edge Function/rate limit은 2차 작업 |

## 운영 배포 전 필수 확인

1. Supabase에서 `kft_comments`, `kft_vote_counts`의 anon `SELECT`/`INSERT`/RPC 실행 권한과 `UPDATE`·`DELETE` 직접 권한을 확인한다.
2. 익명 댓글 비밀번호가 평문 또는 복구 가능한 형태로 저장되어 있지 않은지 확인한다. 가능하면 해시 비교 RPC로 교체한다.
3. 현재 운영 주소가 GitHub Pages + Cloudflare라면 저장소의 `_headers`와 `vercel.json`만으로는 운영 응답 헤더가 바뀌지 않는다. Cloudflare Transform Rules/Worker 또는 실제 사용 중인 호스팅 설정에 동일한 헤더를 적용한다.
4. Cloudflare에서 공개 정적 HTML에 필요한 교차 출처 정책이 없다면 `Access-Control-Allow-Origin: *`를 제거한다.
5. CSP Report-Only 로그를 확인한 뒤, 외부 스크립트·iframe·Supabase·Teachable Machine 출처를 명시한 강제 CSP로 단계적으로 전환한다.

## 현재 판단

이번 변경은 정적 프론트엔드에서 즉시 확인 가능한 XSS·공급망·metadata·헤더 설정을 다룬다. Supabase 권한과 댓글 비밀번호 저장 방식은 원격 DB 정책을 읽지 않고 안전하다고 판정하지 않는다.
