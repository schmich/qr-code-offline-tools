import { useEffect, useMemo, useState } from 'react'

function AckButton({ className = '', onClick, ack, children, ...props }) {
    const [showAck, setShowAck] = useState(false)

    const ackOnClick = async e => {
        try {
            await onClick(e)
            setShowAck(true)
        } catch (e) {
            alert(`Error: ${e}`)
            throw e
        }
    }

    useEffect(() => {
        if (!showAck) {
            return
        }

        const timeout = setTimeout(() => setShowAck(false), 2000)
        return () => clearTimeout(timeout)
    }, [showAck])

    return (
        <button className={`${className} ${showAck ? 'ack' : ''}`} onClick={ackOnClick} {...props}>
            {showAck ? ack : children}
        </button>
    )
}

export default function CodeResult({ mode, text, svg, imageBlob, error, createdAt }) {
    const modeAttr = useMemo(() => error ? 'error' : mode, [mode, error])

    const modeText = useMemo(() => {
        if (error) {
            if (mode == 'decode') {
                return 'Decode Error'
            } else {
                return 'Encode Error'
            }
        } else if (mode == 'decode') {
            return '🡒 Decoded QR to Text'
        } else {
            return '🡐 Encoded Text to QR'
        }
    }, [mode, error])

    const svgTabUrl = useMemo(() => {
        if (!svg) {
            return null
        }

        const svgCopy = svg.cloneNode(true)
        svgCopy.setAttribute('width', '100dvw')
        svgCopy.setAttribute('height', '100dvh')

        const html = `<html><style>body { margin: 0; padding: 0 }</style><body>${svgCopy.outerHTML}</body></html>`
        const blob = new Blob([html], { type: 'text/html' })
        return URL.createObjectURL(blob)
    }, [svg])

    const imageUrl = useMemo(() => {
        if (!imageBlob) {
            return null
        }

        return URL.createObjectURL(imageBlob)
    }, [imageBlob])

    const copyText = async () => await navigator.clipboard.writeText(text)
    const copySVG = async () => await navigator.clipboard.writeText(svg.outerHTML)
    const copyPNG = async () => {
        const image = new ClipboardItem({ 'image/png': imageBlob })
        await navigator.clipboard.write([image])
    }

    const svgUrl = useMemo(() => {
        if (!svg) {
            return null
        }

        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
        return URL.createObjectURL(blob)
    }, [svg])

    const textUrl = useMemo(() => {
        if (!text) {
            return null
        }

        const blob = new Blob([text], { type: 'text/plain' })
        return URL.createObjectURL(blob)
    }, [text])

    return (
        <div className="result">
            <div className="qr">
                <img src={imageUrl}/>
            </div>
            <div className="details">
                <div className="summary">
                    <div className="badge" data-mode={modeAttr}>{modeText}</div>
                    <div className="timestamp">at {new Date(createdAt).toLocaleTimeString()}</div>
                </div>
                {!error && (
                    <div className="actions">
                        <div>
                            <label>svg</label>
                            <AckButton className="action" onClick={copySVG} ack="✓ Copied">Copy</AckButton>
                            <a className="action" href={svgTabUrl} target="_blank">New Tab</a>
                            <a className="action" href={svgUrl} download="qr.svg">Download</a>
                        </div>
                        <div>
                            <label>png</label>
                            <AckButton className="action" onClick={copyPNG} ack="✓ Copied">Copy</AckButton>
                            <a className="action" href={imageUrl} target="_blank">New Tab</a>
                            <a className="action" href={imageUrl} download="qr.png">Download</a>
                        </div>
                        <div>
                            <label>text</label>
                            <AckButton className="action" onClick={copyText} ack="✓ Copied">Copy</AckButton>
                            <a className="action" href={textUrl} target="_blank">New Tab</a>
                            <a className="action" href={textUrl} download="qr.txt">Download</a>
                        </div>
                    </div>
                )}
                {text && <pre className="text">{text}</pre>}
                {error && <div className="error">{error.toString()}</div>}
            </div>
        </div>
    )
}