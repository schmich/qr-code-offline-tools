import * as cheerio from 'cheerio'
import { Buffer } from 'node:buffer'

async function cspHash(content) {
    const buf = new TextEncoder().encode(content)
    const hashBuf = await crypto.subtle.digest('SHA-256', buf)
    const hash = new Uint8Array(hashBuf)
    const base64 = Buffer.from(hash).toString('base64')
    return `'sha256-${base64}'`
}

async function htmlInjectCSP(html) {
    const $ = cheerio.load(html)

    const scriptHash = await cspHash($('script').text())
    const styleHash = await cspHash($('style').text())

    const csp = $('<meta/>')
        .attr('http-equiv', 'Content-Security-Policy')
        .attr('content', `default-src 'none'; img-src blob:; script-src ${scriptHash}; style-src ${styleHash}`)

    $('head').prepend(csp)

    return $.html()
}

export function viteInjectCSP() {
    return {
        name: 'vite:inject-csp',
        enforce: 'post',
        async generateBundle(_, bundle) {
            for (const [name, item] of Object.entries(bundle)) {
                if (!name.match(/\.html$/i)) {
                    continue
                }

                this.info(`Inject CSP meta tags into ${name}`)
                item.source = await htmlInjectCSP(item.source)
            }
        }
    }
}