export enum HoistType {
  Host = 'h',
  Content = 'c'
}

export const assignHoistId = (hoistType: HoistType, id: string, withBrackets = true) => {

  const base = `data-mt${hoistType}-${id}`

  return withBrackets ? `[${base}]` : base
}
