import api from './api'

export interface RelatorioFilme {
  nomeFilme: string
  totalIngressos: number
  receitaTotal: number
  totalSessoes: number
  taxaOcupacao: number
  tipoIngressoMaisVendido: string
  totalClientesUnicos: number
}

export interface RelatorioFiltros {
  dataInicio?: string
  dataFim?: string
  genero?: string
  ordenacao?: string
}

function buildParams(filtros: RelatorioFiltros): URLSearchParams {
  const params = new URLSearchParams()
  if (filtros.dataInicio) params.set('dataInicio', filtros.dataInicio)
  if (filtros.dataFim) params.set('dataFim', filtros.dataFim)
  if (filtros.genero) params.set('genero', filtros.genero)
  if (filtros.ordenacao) params.set('ordenacao', filtros.ordenacao)
  return params
}

const relatorioService = {
  async buscar(filtros: RelatorioFiltros): Promise<RelatorioFilme[]> {
    const params = buildParams(filtros)
    const response = await api.get<RelatorioFilme[]>(`/relatorios?${params.toString()}`)
    return response.data
  },

  async exportarPdf(filtros: RelatorioFiltros): Promise<void> {
    const params = buildParams(filtros)
    const response = await api.get(`/relatorios/exportar?${params.toString()}`, {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio-filmes.pdf'
    a.click()
    URL.revokeObjectURL(url)
  },
}

export default relatorioService
