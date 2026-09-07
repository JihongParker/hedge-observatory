"""hedge-observatory 배치 파이프라인 — 실행 진입점.

Stage 1–2: reader.py (papers 검증 코드 이식) — run_batch.py가 코호트 배치 실행
Stage 3 v1 + Stage 4: finalize.py — 비교 가능성 분류·집계 후 site/src/data/panel.json 발행

키 규칙: OPENDART_API_KEY 환경변수 또는 ~/.opendart_key(chmod 600)만. 코드에 키 금지.
토큰 경계: 사이트는 정적 panel.json만 읽음 — 로드당 토큰·API 호출 0.

사용:
  python3 run_batch.py     # 코호트 배치 (재개 안전, out/batch_fy2025.jsonl 증분)
  python3 finalize.py      # 분류·집계 → panel.json
"""
import subprocess, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
if __name__ == "__main__":
    subprocess.run([sys.executable, os.path.join(HERE, "run_batch.py")], check=True)
    subprocess.run([sys.executable, os.path.join(HERE, "finalize.py")], check=True)
