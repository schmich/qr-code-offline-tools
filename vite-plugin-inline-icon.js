import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'

async function htmlInlineIcon(html, config) {
    const $ = cheerio.load(html)

    const icon = $('head link[rel="icon"][type="image/svg+xml"]')
    if (icon.length == 0) {
        return html
    }

    const href = icon.attr('href')
    const filePath = path.join(config.build.outDir, href)

    const xml = fs.readFileSync(filePath, 'utf-8')
        .replace(/[\r\n]+/g, '')
        .replace(/\s\s+/g, ' ')

    const base64 = btoa(xml)
    const inlineHref = `data:image/svg+xml;base64,${base64}`
    icon.attr('href', inlineHref)

    return $.html()
}

export function viteInlineIcon() {
    let config = null

    return {
        name: 'vite:inline-icon',
        enforce: 'post',
        configResolved(resolved) {
            config = resolved
        },
        async generateBundle(_, bundle) {
            for (const [name, item] of Object.entries(bundle)) {
                if (!name.match(/\.html$/i)) {
                    continue
                }

                this.info(`Inline icon into ${name}`)
                item.source = await htmlInlineIcon(item.source, config)
            }
        }
    }
}