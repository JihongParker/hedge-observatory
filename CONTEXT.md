# 16-Observatory — 헤지 관측소

한국 상장사 파생상품 각주 전수 파싱 → 공개 기업 헤지 패널 + 대시보드.
13-Papers P4의 자인된 공백(강도 마진, 각주 이질성 13사 중 1사 정합)을 정면으로 뚫는 대규모 포트폴리오 프로젝트.

## 구조
- `pipeline/observatory_pipeline.py` — 4단계 배치(수집→판별→정규화→공개). LLM은 Stage 2 모호 건에만, 배치 1회. 사이트는 정적 panel.json만 읽음(로드당 토큰 0).
- `site/` — Vite+React+TS, Hong_ERP 디자인 시스템 이식(토큰 동일, 악센트 심청 #104281). 실측만 표시, 예시 목업은 화면 아키타입(아티팩트)에만.
- 완성형 화면 아키타입: claude.ai/code/artifact/b2c5519a-59cc-4de6-af9e-a2aee320e1b3

## 보안 규칙 (2026-09-04 사고 후 확정)
- OpenDART 키는 코드·리포에 절대 넣지 않는다. `OPENDART_API_KEY` 환경변수 또는 `~/.opendart_key`(chmod 600)만.
- 배경: 13-Papers 공개 리포에 키가 하드코딩되어 origin/main 5개 파일 + 히스토리 3커밋에 노출됐던 사고. 코드에서 제거 완료, **키 재발급은 사용자 액션 필요** (opendart.fss.or.kr).
- .gitignore가 .env, opendart_key* 를 커버. 새 스크립트 작성 시 이 규칙 준수.

## 재사용 계보
Stage 1·2 ← 13-Papers/python/04_esg (opendart_pipeline, derivative_parser, notes_probe, CP949 처리)
감시 ← ~/bin/intern-watch.py + launchd 패턴 (라벨 접두 `16-`)
배포 ← Hong_ERP gh-pages 방식

## 상태 (2026-09-04)
골격 생성: 파이프라인 스켈레톤(NotImplementedError 단계), 사이트 빌드 통과, Coverage 모듈이 파일럿 14사 실측 표시. 다음: Stage 2 표 유형 분류기 설계.
