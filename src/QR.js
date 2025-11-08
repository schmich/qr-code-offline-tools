import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from '@zxing/browser'

const reader = new BrowserQRCodeReader()
const writer = new BrowserQRCodeSvgWriter()

export async function qrEncodeDecode({ file, text }) {
    const size = 1000

    try {
        if (file) {
            const { text, imageBlob, error } = await tryDecodeRotate(reader, file)
            if (error) {
                throw error
            }

            let svg = null
            try {
                svg = writer.write(text, size, size)
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
            } catch (e) {
                console.error(e)
            }

            return {
                mode: 'decode',
                imageBlob: svg ? await svgToImageBlob(svg) : imageBlob,
                svg,
                text,
                createdAt: Date.now()
            }
        } else if (text) {
            const svg = writer.write(text, size, size)
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

            return {
                mode: 'encode',
                imageBlob: await svgToImageBlob(svg),
                svg,
                text,
                createdAt: Date.now()
            }
        }
    } catch (e) {
        console.error(e)

        return {
            mode: file ? 'decode' : 'encode',
            error: e,
            imageBlob: file,
            createdAt: Date.now()
        }
    }
}

async function tryDecodeRotate(reader, blob) {
    let error = null

    const angles = [0, 0.5 * Math.PI, Math.PI, 1.5 * Math.PI]
    for (const angle of angles) {
        const imageBlob = angle == 0 ? blob : await rotateImageBlob(blob, angle)
        const imageUrl = URL.createObjectURL(imageBlob)

        try {
            const { text } = await reader.decodeFromImageUrl(imageUrl)
            return { text, imageBlob }
        } catch (e) {
            error ||= e
        }
    }

    return { error }
}

async function rotateImageBlob(blob, angle) {
    const image = await blobToImage(blob)

    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(angle)
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2)

    return canvasToBlob(canvas)
}

async function blobToImage(blob) {
    const url = URL.createObjectURL(blob)
    return await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
            URL.revokeObjectURL(url)
            resolve(image)
        }
        image.onerror = () => reject(new Error('failed to render svg to png'))
        image.src = url
    })
}

async function canvasToBlob(canvas) {
    return await new Promise(resolve => canvas.toBlob(resolve))
}

async function svgToImageBlob(svg) {
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const image = await blobToImage(blob)

    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0)

    return canvasToBlob(canvas)
}