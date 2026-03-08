/**
 * Utilitários de conversão de data para o projeto CinemaMax.
 *
 * - O backend envia/recebe datas no formato "yyyy-MM-dd" (ex.: "2026-03-10")
 * - Os inputs <input type="date"> trabalham com "2026-03-10" (YYYY-MM-DD)
 * - Para exibição ao usuário usamos "10/03/2026" (dd/mm/yyyy)
 */

/**
 * Converte data de input (YYYY-MM-DD) para formato da API.
 * Retorna a data pura sem componente de horário/timezone,
 * evitando o problema de deslocamento de fuso.
 * Ex.: "2026-03-10" → "2026-03-10"
 */
export function inputDateToApi(dateYYYYMMDD: string): string {
  return dateYYYYMMDD
}

/**
 * Converte data vinda da API ("yyyy-MM-dd" ou timestamp) para formato de input (YYYY-MM-DD).
 * Ex.: "2026-03-10" → "2026-03-10"
 *      1741564800000 → "2026-03-10"
 */
export function apiDateToInput(dateFromApi: string | number | null | undefined): string {
  if (dateFromApi === null || dateFromApi === undefined || dateFromApi === '') return ''
  if (typeof dateFromApi === 'number') {
    const d = new Date(dateFromApi)
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }
  return dateFromApi.slice(0, 10)
}

/**
 * Converte data de input (YYYY-MM-DD) para exibição em pt-BR (dd/mm/yyyy).
 * Ex.: "2026-03-10" → "10/03/2026"
 */
export function inputDateToBr(dateYYYYMMDD: string): string {
  if (!dateYYYYMMDD) return ''
  const [y, m, d] = dateYYYYMMDD.split('-')
  return `${d}/${m}/${y}`
}

/**
 * Converte data da API diretamente para exibição em pt-BR.
 * Ex.: "2026-03-10" → "10/03/2026"
 *      1741564800000 → "10/03/2026"
 */
export function apiDateToBr(dateFromApi: string | number | null | undefined): string {
  const input = apiDateToInput(dateFromApi)
  return input ? inputDateToBr(input) : '—'
}

/**
 * Converte data da API para exibição longa em pt-BR.
 * Ex.: "2026-03-10" → "ter., 10 de março de 2026"
 */
export function apiDateToLongBr(dateFromApi: string | number | null | undefined): string {
  if (dateFromApi === null || dateFromApi === undefined || dateFromApi === '') return '—'
  try {
    const input = apiDateToInput(dateFromApi)
    // Parseia como UTC para evitar problemas de timezone
    const d = new Date(input + 'T00:00:00Z')
    if (isNaN(d.getTime())) return String(dateFromApi)
    return d.toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return String(dateFromApi)
  }
}
