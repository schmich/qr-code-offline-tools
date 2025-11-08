import { useEffect, useState } from 'react'
import { qrEncodeDecode } from './QR.js'
import { DownloadIcon } from './Icons.jsx'
import CodeResult from './CodeResult.jsx'
import DropZone from './DropZone.jsx'

function usePaste(handler) {
    useEffect(() => {
        document.addEventListener('paste', handler)
        return () => document.removeEventListener('paste', handler)
    }, [handler])
}

async function getDropItems(items) {
    const files = new Set()
    const texts = new Set()

    for (const item of items) {
        if (item.type.startsWith('image/')) {
            if (item instanceof File) {
                files.add(item)
            } else {
                files.add(item.getAsFile())
            }
        } else if (item.type == 'text/plain') {
            const text = await new Promise(resolve => item.getAsString(resolve))
            texts.add(text.trim())
        }
    }

    return [
        ...[...files].map(file => ({ file })),
        ...[...texts].map(text => ({ text }))
    ]
}

async function selectFiles(mimeTypes, allowMultiple) {
    return await new Promise(resolve => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', mimeTypes.join(','))

        input.addEventListener('change', e => {
            e.preventDefault()
            resolve(e.target.files)
        })

        input.addEventListener('cancel', e => {
            e.preventDefault()
            resolve(null)
        })

        if (allowMultiple) {
            input.setAttribute('multiple', 'multiple')
        }

        input.click()
    })
}

function App() {
    const [results, setResults] = useState([])

    async function processItems(items) {
        const curResults = []

        for (const item of items) {
            const result = await qrEncodeDecode(item)
            curResults.push(result)
        }

        setResults(results => [...curResults, ...results])
    }

    async function onDropItems(items) {
        const drops = await getDropItems(items)
        const text = drops.filter(d => d.text)
        const files = drops.filter(d => d.file)
        const targets = text.length > 0 ? text : files
        processItems(targets)
    }

    usePaste(async e => {
        const clipboard = e.clipboardData
        await onDropItems([...clipboard.files, ...clipboard.items])
    })

    async function onFromText() {
        const text = prompt('Text to encode as a QR code:')
        if (text === null) {
            return
        }

        const item = { text }
        processItems([item])
    }

    async function onFromFile() {
        const files = await selectFiles(['image/*'], true)
        if (!files?.length) {
            return
        }

        const items = [...files].map(file => ({ file }))
        processItems(items)
    }

    const isLocal = window.location.protocol == 'file:'

    return (
        <div className="app">
            <DropZone onDrop={onDropItems}/>
            {results.length == 0 && (
                <div className="intro">
                    <h1>QR Code Offline Tools</h1>
                    <p>Drop or paste a QR image to decode</p>
                    <p>Drop or paste text to encode</p>
                    <nav>
                        <button onClick={onFromFile}>From File</button>
                        <button onClick={onFromText}>From Text</button>
                    </nav>
                    <footer>
                        <a href="https://github.com/schmich/qr-code-offline-tools">
                            github.com/schmich/qr-code-offline-tools
                        </a>
                    </footer>
                    {!isLocal && (
                        <a href={window.location.pathname} download="qr.html" className="cta">
                            <DownloadIcon/>
                            <div>Download qr.html<br/>to use locally</div>
                        </a>
                    )}
                </div>
            )}
            {results.length > 0 && (
                <>
                    <header>
                        <h1>QR Code Offline Tools</h1>
                        <nav>
                            <button onClick={onFromFile}>From File</button>
                            <button onClick={onFromText}>From Text</button>
                        </nav>
                    </header>
                    <section className="results">
                        {results.map(result => <CodeResult key={result.createdAt} {...result}/>)}
                    </section>
                </>
            )}
        </div>
    )
}

export default App