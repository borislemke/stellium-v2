const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

export function EscapeHTML (str: string) {
  return String(str).replace(/[&<>"'`=\/]/g, s => {
    return entityMap[s]
  })
}
