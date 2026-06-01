import { useState } from 'react'
import { useEffect } from 'react';
import * as XLSX from 'xlsx'

import ExcelUploader from './components/ExcelUploader'
import SheetSelector from './components/SheetSelector'
import DownloadButton from './components/DownloadButton'

import {
  readExcel,
  getSheetNames,
  getSheetData,
  filterColumns,
  downloadExcel,
  transformPayrollData
} from './services/excelService'

const App = (props) => {

  const [workbook, setWorkbook] =
    useState(null)

  const [sheetNames, setSheetNames] =
    useState([])

  const [selectedSheet, setSelectedSheet] =
    useState('')

  const handleFile = async (file) => {
    const wb = await readExcel(file)

    setWorkbook(wb)
    setSheetNames(getSheetNames(wb))
    setSelectedSheet('')
  }

  const [uploadKey, setUploadKey] =
    useState(0)

  const REQUIRED_HEADERS = [
    'N°',
    'ODPE',
    'DNI',
    'Apellido paterno',
    'Apellido materno',
    'nombre',
    'Cargo',
    'Armada (Fecha de Inicio)',
    'Armada (Fecha de Fin)',
    'Meta',
    'Nro Cuenta Bancaria',
    'Total Descuentos y Retenciones',
    'Importe Bruto'
  ]

  const handleDownload =
    () => {
      if (
        !workbook ||
        !selectedSheet
      )
        return

      const data =
        getSheetData(
          workbook,
          selectedSheet
        )

      const filtered =
        filterColumns(

          data,
          REQUIRED_HEADERS
        )

      const {
        rows,
        invalidCells
      } =
        transformPayrollData(
          filtered
        )

      downloadExcel(
        rows,
        'resultado.xlsx',
        invalidCells
      )

      // limpiar formulario
      setWorkbook(null)
      setSheetNames([])
      setSelectedSheet('')
      setUploadKey(
        prev => prev + 1
      )
    }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Procesador Excel
            </h1>
            <p className="text-blue-100 text-sm">Carga, selecciona y descarga tus archivos</p>
          </div>

          {/* Contenido con espaciado dinámico */}
          <div className="p-8 space-y-8">
            {/* Sección 1: Upload */}
            <div className="animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-800">Selecciona tu archivo</h2>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-blue-200 hover:border-purple-400 transition-colors duration-300">
                <ExcelUploader
                  onFileSelect={handleFile}
                  resetKey={uploadKey}
                />
              </div>
            </div>

            {/* Divisor */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-gray-400 text-sm font-medium">Paso 2</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Sección 2: Sheet Selector */}
            <div className="animate-fade-in animation-delay-100">
              <div className="mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-800">Elige una hoja</h2>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <SheetSelector
                  sheets={sheetNames}
                  selected={selectedSheet}
                  onSelect={setSelectedSheet}
                />
              </div>
            </div>

            {/* Sección 3: Download */}
            <div className="animate-fade-in animation-delay-200">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-1">
                <div className="bg-white rounded-lg p-6">
                  <DownloadButton
                    disabled={!selectedSheet}
                    onDownload={handleDownload}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              ✨ Creado con mucho ❤️ por Rahamsis XD
            </p>
          </div>
        </div>
      </div>

      {/* Agregar esto en tu globals.css para las animaciones */}
      <style>{`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }

    .animation-delay-100 {
      animation-delay: 0.1s;
    }

    .animation-delay-200 {
      animation-delay: 0.2s;
    }
  `}</style>
    </div>
  )
}

export default App
