type Props = {
  onDownload: () => void
  disabled: boolean
}

export default function DownloadButton({
  onDownload,
  disabled
}: Props) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onDownload}
        disabled={disabled}
        className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        Descargar Excel
      </button>
    </div>
  )
}