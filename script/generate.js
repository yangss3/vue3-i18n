/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const fs = require('fs')
const path = require('path')

const resolve = p => path.resolve(__dirname, p)

async function main () {
  fs.copyFileSync(resolve('../lib/esm/i18n.d.ts'), resolve('../lib/i18n.d.ts'))
  fs.copyFileSync(resolve('../lib/esm/i18n.js'), resolve('../lib/i18n.esm.js'))
  fs.copyFileSync(resolve('../lib/cjs/i18n.js'), resolve('../lib/i18n.cjs.js'))

  fs.rmSync(resolve('../lib/cjs'), { recursive: true })
  fs.rmSync(resolve('../lib/esm'), { recursive: true })
}

main()
  .then(() => console.log('done'))
  .catch(e => console.error(e.stack))
