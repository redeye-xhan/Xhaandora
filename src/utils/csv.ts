export function exportCSV(data: any[]) {
  if (!data || !data.length) return
  const keys = Object.keys(data[0])
  const rows = [keys.join(','), ...data.map((r) => keys.map((k) => JSON.stringify((r as any)[k] ?? '')).join(','))]
  const csv = rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'xhaandora-sessions.csv'
  a.click()
  URL.revokeObjectURL(url)
}
