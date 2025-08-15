// src/helpers/export.ts
export function downloadCsv(name: string, rows: Record<string, any>[]) {
  if (!rows.length) return

  // Excel-friendly: BOM + CRLF, safe filename
  const safe = name.replace(/[^\w.-]+/g, '_')
  const headers = Object.keys(rows[0])
  const body = rows.map(r => headers.map(h => csvEscape(r[h])).join(',')).join('\r\n')
  const csv = '\uFEFF' + headers.join(',') + '\r\n' + body

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = safe
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function csvEscape(x: any) {
  const s = (x ?? '').toString()
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}