import * as XLSX from 'xlsx-js-style'

export const readExcel = async (file: File) => {
  const buffer = await file.arrayBuffer()

  const workbook = XLSX.read(buffer, {
    type: 'array'
  })

  return workbook
}

export const getSheetNames = (workbook: XLSX.WorkBook) => {
  return workbook.SheetNames
}

export const getSheetData = (
  workbook: XLSX.WorkBook,
  sheetName: string
) => {
  const worksheet = workbook.Sheets[sheetName]

  return XLSX.utils.sheet_to_json(worksheet)
}

const normalizeHeader = (
  text: string
) => {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-z0-9]/g,
      ''
    )
}

const toUpper = (value: any) =>
  value
    ? String(value)
      .trim()
      .toUpperCase()
    : 'Sin informacion'

const formatDate = (
  value: any
) => {
  if (
    value == null ||
    value === '' ||
    value === 'Sin informacion'
  ) {
    return 'Sin informacion'
  }

  // Fecha serial de Excel
  if (typeof value === 'number') {
    const date =
      XLSX.SSF.parse_date_code(
        value
      )

    if (!date) {
      return 'Sin informacion'
    }

    const day = String(
      date.d
    ).padStart(2, '0')

    const month = String(
      date.m
    ).padStart(2, '0')

    const year =
      date.y

    return `${day}/${month}/${year}`
  }

  // Si ya viene como texto
  return String(value).trim()
}

const formatMoney = (
  value: any
) => {
  if (
    value == null ||
    value === '' ||
    value === 'Sin informacion'
  ) {
    return 'Sin informacion'
  }

  const cleanValue = String(value)
    .replace('S/', '')
    .replace(/\s/g, '')
    .replace(/,/g, '')

  const number = Number(cleanValue)

  if (isNaN(number)) {
    return 'Sin informacion'
  }

  return number.toFixed(2)
}

const buildTxt = (
  cuenta: string,
  importe: any
) => {
  cuenta = String(cuenta ?? '')
    .trim()

  if (
    !cuenta.startsWith('0')
  ) {
    return 'Cuenta incorrecta'
  }

  const cuentaSin0 =
    cuenta.substring(1)

  const importeNumber =
    Number(importe ?? 0)

  const importeTxt =
    Math.round(
      importeNumber * 100
    ).toString()

  const fijo =
    '341' +
    cuentaSin0

  const totalSinZeros =
    fijo.length +
    importeTxt.length

  const zerosNeeded =
    28 - totalSinZeros

  const relleno =
    '0'.repeat(
      Math.max(
        0,
        zerosNeeded
      )
    )

  return (
    fijo +
    relleno +
    importeTxt
  )
}

export const filterColumns = (
  data: any[],
  requiredHeaders: string[]
) => {
  if (!data.length) return []

  const firstRow = data[0]

  const normalizedMap:
    Record<string, string> = {}

  Object.keys(firstRow).forEach(
    (key) => {
      normalizedMap[
        normalizeHeader(key)
      ] = key
    }
  )

  return data.map((row) => {
    const newRow: any = {}

    requiredHeaders.forEach(
      (requiredHeader) => {
        const normalizedRequired =
          normalizeHeader(
            requiredHeader
          )

        const originalColumn =
          normalizedMap[
          normalizedRequired
          ]

        if (
          originalColumn &&
          row[originalColumn] != null &&
          row[originalColumn] !== ''
        ) {
          newRow[
            requiredHeader
          ] =
            row[originalColumn]
        } else {
          newRow[
            requiredHeader
          ] =
            'Sin informacion'
        }
      }
    )

    return newRow
  })
}

export const transformPayrollData =
  (data: any[]) => {
    const rows: any[] = []
    const invalidCells: string[] =
      []

    data.forEach(
      (row, index) => {
        const newRow: any = {}

        const excelRow =
          index + 2

        const dni =
          String(
            row['DNI'] ?? ''
          ).trim()

        const cuenta =
          String(
            row[
            'Nro Cuenta Bancaria'
            ] ?? ''
          ).trim()

        const fechaInicio =
          String(
            formatDate(row[
              'Armada (Fecha de Inicio)'
            ]) ?? 'Sin Informacion'
          ).trim()

        const fechaFin =
          String(
            formatDate(
              row[
              'Armada (Fecha de Fin)'
              ]
            ) ?? 'Sin Informacion'
          ).trim()

        const importeBruto =
          formatMoney(
            row[
            'Importe Bruto'
            ]) ?? 'Sin informacion'


        const importeNeto =
          formatMoney(
            row[
            'Importe Bruto'
            ]) ?? 'Sin informacion'

        const meta =
          row['Meta'] ===
            'Sin informacion'
            ? ''
            : row['Meta']


        const TXT =
          buildTxt(
            cuenta,
            row[
            'Importe Bruto'
            ]
          )

        newRow['N°'] =
          index + 1

        newRow['ODPE'] =
          toUpper(
            row['ODPE']
          )

        newRow['DNI'] =
          dni

        newRow[
          'Apellido paterno'
        ] = toUpper(
          row[
          'Apellido paterno'
          ]
        )

        newRow[
          'Apellido materno'
        ] = toUpper(
          row[
          'Apellido materno'
          ]
        )

        newRow['nombre'] =
          toUpper(
            row['nombre']
          )

        newRow['Cargo'] =
          toUpper(
            row['Cargo']
          )

        newRow[
          'Armada (Fecha de Inicio)'
        ] = fechaInicio

        newRow[
          'Armada (Fecha de Fin)'
        ] = fechaFin

        newRow['Meta'] = meta

        newRow[
          'Nro Cuenta Bancaria'
        ] = cuenta

        newRow[
          'Importe Bruto'
        ] = importeBruto


        newRow[
          'Total Descuentos y Retenciones'
        ] = 0

        newRow[
          'Importe Neto a Pagar S/.'
        ] = importeNeto

        newRow['TXT'] = TXT

        if (
          dni.length !== 8
        ) {
          invalidCells.push(
            `C${excelRow}`
          )
        }

        if (
          cuenta.length !==
          11 ||
          !cuenta.startsWith(
            '04'
          )
        ) {
          invalidCells.push(
            `K${excelRow}`
          )
        }

        if (fechaInicio === 'Sin informacion') {
          invalidCells.push(
            `H${excelRow}`
          )
        }

        if (fechaFin === 'Sin informacion') {
          invalidCells.push(
            `I${excelRow}`
          )
        }

        if (importeBruto === 'Sin informacion') {
          invalidCells.push(
            `L${excelRow}`
          )
        }

        if (importeNeto === 'Sin informacion') {
          invalidCells.push(
            `N${excelRow}`
          )
        }

        if (meta === '') {
          invalidCells.push(
            `J${excelRow}`
          )
        }

        if (TXT === 'Cuenta incorrecta') {
          invalidCells.push(
            `O${excelRow}`
          )
        }

        rows.push(newRow)
      }
    )

    return {
      rows,
      invalidCells
    }
  }

export const downloadExcel = (
  data: any[],
  fileName: string,
  invalidCells: string[] = []
) => {
  const worksheet =
    XLSX.utils.json_to_sheet(data)

  // Obtener encabezados
  const headers =
    Object.keys(data[0] || {})

  // Encabezados en negrita
  headers.forEach(
    (_, index) => {
      const cellAddress =
        XLSX.utils.encode_cell({
          r: 0,
          c: index
        })

      if (
        worksheet[cellAddress]
      ) {
        worksheet[
          cellAddress
        ].s = {
          font: {
            bold: true
          }
        }
      }
    }
  )

  invalidCells.forEach(
    (cellAddress) => {
      if (
        worksheet[
        cellAddress
        ]
      ) {
        worksheet[
          cellAddress
        ].s = {
          fill: {
            fgColor: {
              rgb: 'FF0000'
            }
          }
        }
      }
    }
  )

  const workbook =
    XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Resultado'
  )

  XLSX.writeFile(
    workbook,
    fileName
  )
}