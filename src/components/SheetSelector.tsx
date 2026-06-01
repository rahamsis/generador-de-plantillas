type Props = {
  sheets: string[]
  selected: string
  onSelect: (sheet: string) => void
}

export default function SheetSelector({
  sheets,
  selected,
  onSelect
}: Props) {
  if (!sheets.length) return null

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <label className="text-sm font-semibold text-gray-700">
        Seleccionar hoja
      </label>

      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full max-w-md rounded-lg border p-2 bg-white text-gray-800"
      >
        <option value="">Elegir hoja</option>

        {sheets.map((sheet) => (
          <option key={sheet} value={sheet}>
            {sheet}
          </option>
        ))}
      </select>
    </div>
  )
}