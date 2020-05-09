import React, { useEffect, useReducer, useRef } from 'react'
import { createPdf } from '~/servise/pdf'
import Button from '../atoms/Button'

require('./Preview.css')

interface Props {
  size: string
  orientation: 'portrait' | 'landscape'
  list: string[]
  cardSize: [number, number]
  className?: string
}

const pdfReducer = (prev: string | null, pdf: string | null) => {
  if (prev) {
    URL.revokeObjectURL(prev)
  }

  return pdf
}

export default ({ list, cardSize, size, orientation, className }: Props) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null)
  const [pdf, updatePdf] = useReducer(pdfReducer, null)

  useEffect(() => {
    updatePdf(null)
    createPdf({ list, cardSize, size, orientation })
      .then(updatePdf)
  }, [list, cardSize, size, orientation])

  const print = () => {
    const contentWindow = iFrameRef.current?.contentWindow

    if (!contentWindow) return

    try {
      contentWindow.print()
    } catch {
      // Firefoxでエラーになる（cross-origin関連）
      alert('印刷画面を開くことができませんでした。\nプレビュー内に印刷ボタンがある場合は、そこから印刷できます。または、ダウンロードして印刷してください。')
    }
  }

  const download = () => {
    if (!pdf) return

    // スマホの場合、新規タブで開く
    if (/iPhone|iPad|iPod|Android/.test(navigator.userAgent)) {
      open(pdf)
      return
    }

    const link = document.createElement('a')

    link.href = pdf
    link.download = `プロキシカード印刷-${pdf.slice(-8)}`
    link.click()
  }

  return (
    <div className={['Preview', className].join(' ')}>
      <iframe className="Preview-pdf" src={pdf || undefined} ref={iFrameRef} />
      <div className="Preview-footer">
        <Button onClick={print}>
          {'印刷'}
        </Button>
        <Button onClick={download}>
          {'ダウンロード'}
        </Button>
      </div>
    </div>
  )
}
