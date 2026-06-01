
import React, { useRef, useState } from 'react'

type Props = {
  onFileSelect: (file: File) => void
  resetKey?: number
}

export default function ExcelUploader({
  onFileSelect,
  resetKey
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
        Subir Excel
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={
          `mx-auto flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-colors duration-200 ` +
          (isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-200 bg-white')
        }
        style={{ maxWidth: 480 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4a4 4 0 018 0v4m-6 0h6" />
        </svg>

        <p className="text-sm text-gray-600">Arrastra y suelta o haz click para subir</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
          className="mt-2 rounded bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
        >
          Seleccionar archivo
        </button>

        <input
          key={resetKey}
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  )
}