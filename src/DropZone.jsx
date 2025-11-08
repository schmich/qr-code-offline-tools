import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function DropZone({ onDrop }) {
    const [isActive, setIsActive] = useState(false)
    const [mode, setMode] = useState(null)

    function onDragEnter(e) {
        e.preventDefault()
        setIsActive(true)

        const transfer = e.dataTransfer
        const items = [...transfer.files, ...transfer.items]

        if (items.some(item => item.type == 'text/plain')) {
            setMode('encode')
        } else if (items.some(item => item.type.startsWith('image/'))) {
            setMode('decode')
        } else {
            setMode('unsupported')
        }
    }

    function onDragLeave(e) {
        e.preventDefault()
        setIsActive(false)
    }

    function onDragOver(e) {
        e.preventDefault()
    }

    function onDropOuter(e) {
        e.preventDefault()

        const transfer = e.dataTransfer
        const items = transfer.files.length > 0 ? transfer.files : transfer.items
        onDrop([...items])

        setIsActive(false)
    }

    useEffect(() => {
        document.addEventListener('dragenter', onDragEnter)
        return () => {
            document.removeEventListener('dragenter', onDragEnter)
        }
    }, [])

    const dropzone = (
        <div className={`dropzone ${isActive ? 'active' : ''} ${mode}`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDropOuter}>
            {isActive && (
                <div className="target">
                    {mode == 'encode' && <>
                        <h2>Drop to Encode</h2>
                        <h3>Text 🡒 QR</h3>
                    </>}
                    {mode == 'decode' && <>
                        <h2>Drop to Decode</h2>
                        <h3>QR 🡒 Text</h3>
                    </>}
                    {mode == 'unsupported' && <>
                        <h2>Unsupported file or data format</h2>
                    </>}
                </div>
            )}
        </div>
    )

    return createPortal(dropzone, document.body)
}