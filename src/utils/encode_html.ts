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

export function EscapeHTML (string) {
  return String(string).replace(/[&<>"'`=\/]/g, s => {
    return entityMap[s]
  })
}
