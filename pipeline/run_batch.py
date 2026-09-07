"""380사 코호트 실배치: 최신 사업보고서(FY2025)를 읽어 지정·표 프로파일 패널 생성.

재개 안전: out/batch_fy2025.jsonl에 증분 기록, 재실행 시 완료 건 건너뜀.
Stage 3 v1(비교 가능성 분류)과 Stage 4(panel.json 발행)는 finalize에서 수행.
"""
import gzip, json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from reader import find_annual, fetch_doc, designation_status, note_profile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out"); os.makedirs(OUT, exist_ok=True)
LOG = os.path.join(OUT, "batch_fy2025.jsonl")
PANEL = os.path.expanduser("~/1-Projects/12-Portfolio/papers/data/results/panel_380firms.jsonl.gz")

def firms():
    seen = {}
    for line in gzip.open(PANEL, "rt"):
        r = json.loads(line)
        c = r["corp_code"]
        f = seen.setdefault(c, {"corp_code": c, "name": r["name"], "assets": 0, "ay": 0})
        if r.get("assets") and r["year"] > f["ay"]:
            f["assets"], f["ay"] = r["assets"], r["year"]
    return sorted(seen.values(), key=lambda f: -f["assets"])

def main():
    done = set()
    if os.path.exists(LOG):
        for line in open(LOG):
            try: done.add(json.loads(line)["corp_code"])
            except Exception: pass
    fs = firms()
    print(f"firms={len(fs)} done={len(done)}", flush=True)
    out = open(LOG, "a")
    for i, f in enumerate(fs):
        if f["corp_code"] in done: continue
        row = dict(f)
        try:
            rc = find_annual(f["corp_code"])
            row["rcept"] = rc
            if rc:
                doc = fetch_doc(rc)
                row["doc_chars"] = len(doc)
                ap, ev = designation_status(doc)
                ty, un = note_profile(doc)
                row.update(applied=ap, evidence=ev[:140], types=ty, units=un)
            else:
                row["error"] = "no_annual_report"
        except Exception as e:
            row["error"] = f"{type(e).__name__}: {e}"[:120]
        out.write(json.dumps(row, ensure_ascii=False) + "\n"); out.flush()
        if (i + 1) % 20 == 0:
            print(f"progress {i+1}/{len(fs)}", flush=True)
        time.sleep(0.15)
    print("BATCH DONE", flush=True)

if __name__ == "__main__":
    main()
