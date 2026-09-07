"""hedge-observatory 배치 파이프라인 골격.

토큰 경계: LLM 호출은 Stage 2의 모호 건에만, 배치 1회. 사이트는 Stage 4가
내놓은 정적 panel.json만 읽는다 — 로드당 토큰 0.

키 규칙: OpenDART 키는 코드에 절대 넣지 않는다. OPENDART_API_KEY 환경변수
또는 ~/.opendart_key(chmod 600)에서만 읽는다.

재사용: Stage 1·2는 13-Papers/python/04_esg의 opendart_pipeline.py,
derivative_parser.py, notes_probe.py 검증 코드를 이식한다.
"""
import argparse, json, os, sys

KEY = os.environ.get("OPENDART_API_KEY") or open(os.path.expanduser("~/.opendart_key")).read().strip()
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site", "src", "data")


def stage1_collect(since: str) -> list[dict]:
    """corpCode.xml 모집단 확정 + list.json 폴링 → 신규 사업보고서 rcept_no 큐.
    네트워크·토큰 0(LLM 미사용). launchd 일일 감시가 이 함수만 부른다."""
    raise NotImplementedError("port from 04_esg/opendart_pipeline.py")


def stage2_classify(queue: list[dict]) -> list[dict]:
    """document.xml에서 파생 각주 절 추출 → 정규식 사전필터 → 표 유형 태깅.
    지정 여부는 결정문 규칙 우선, 모호 건만 LLM 배치(--max-turns 상한)."""
    raise NotImplementedError("port from 04_esg/derivative_parser.py + notes_probe.py")


def stage3_normalize(rows: list[dict]) -> list[dict]:
    """유형·단위 통일 규칙. 무작위 200건 수작업 대조 표본을 함께 뽑아 오류율 보고."""
    raise NotImplementedError


def stage4_publish(panel: list[dict]) -> None:
    """site/src/data/panel.json 갱신 → git commit → gh-pages 배포는 CI가."""
    with open(os.path.join(OUT, "panel.json"), "w", encoding="utf-8") as f:
        json.dump(panel, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default="20260101")
    ap.add_argument("--stage", type=int, default=0, help="0=전체, 1..4=단일 단계")
    a = ap.parse_args()
    print(f"observatory pipeline skeleton — key loaded ({len(KEY)} chars), stage={a.stage}")
    sys.exit(0)
