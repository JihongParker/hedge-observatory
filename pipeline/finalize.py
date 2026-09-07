"""Stage 3 v1 + Stage 4: 배치 결과를 분류·집계해 site/src/data/panel.json 발행."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(HERE, "out", "batch_fy2025.jsonl")
DEST = os.path.join(HERE, "..", "site", "src", "data", "panel.json")

def table_status(r):
    if r.get("error") or not r.get("rcept"): return "missing_doc"
    ty = r.get("types") or []
    un = set(r.get("units") or [])
    if not ty: return "no_table"
    if len(ty) == 1 and un <= {"KRW_mn"}: return "comparable"
    if len(ty) == 1: return "single_unit_check"
    return "hetero"

def main():
    rows = {}
    for line in open(LOG):
        r = json.loads(line); rows[r["corp_code"]] = r  # 마지막 기록 우선
    rows = sorted(rows.values(), key=lambda r: -(r.get("assets") or 0))
    out_rows, agg, tab = [], {"applied": 0, "not_applied": 0, "unresolved": 0, "error": 0}, \
        {"comparable": 0, "single_unit_check": 0, "hetero": 0, "no_table": 0, "missing_doc": 0}
    for r in rows:
        if r.get("error"): agg["error"] += 1
        elif r.get("applied") is True: agg["applied"] += 1
        elif r.get("applied") is False: agg["not_applied"] += 1
        else: agg["unresolved"] += 1
        ts = table_status(r); tab[ts] += 1
        out_rows.append({
            "name": r["name"],
            "assets_tn": round((r.get("assets") or 0) / 1e12, 1),
            "applied": (True if r.get("applied") is True else False if r.get("applied") is False else None),
            "table": ts,
        })
    doc = {"as_of": "2026-09-07", "source": "OpenDART 사업보고서 (FY2025) 라이브 배치",
           "n": len(out_rows), "agg": agg, "tables": tab, "rows": out_rows}
    json.dump(doc, open(DEST, "w"), ensure_ascii=False, indent=1)
    print(json.dumps({"n": len(out_rows), "agg": agg, "tables": tab}, ensure_ascii=False))

if __name__ == "__main__":
    main()
