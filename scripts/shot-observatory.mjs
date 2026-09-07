// 청사진 §7: 라이트·다크·모바일 3벌 렌더 확인.
// 사용: node scripts/shot-observatory.mjs <serve-root-url> <out-dir>
import { chromium } from '/Users/elijahjasper/1-Projects/12-Portfolio/hong-erp/node_modules/playwright/index.mjs'
const [url, out] = process.argv.slice(2)
const b = await chromium.launch()
for (const [name, scheme, w, h] of [
  ['light', 'light', 1680, 1250], ['dark', 'dark', 1680, 1250], ['mobile', 'light', 390, 844],
]) {
  const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme })
  await pg.goto(url, { waitUntil: 'networkidle' })
  await pg.waitForTimeout(1500)
  await pg.screenshot({ path: `${out}/shot-${name}.png`, fullPage: name === 'mobile' })
  await pg.close()
}
await b.close()
console.log('3 shots written to', out)
