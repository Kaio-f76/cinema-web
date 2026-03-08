export interface Filme {
    id?: string
    nome: string
    descricao?: string
    dataLancamento?: string
    genero?: string
    diretor?: string
    elenco?: string
    classificacao?: string
    distribuidor?: string
    duracao?: number
    valorFilme?: number
    sessoes?: Array<{ id?: string; data?: string; horarioFilme?: string }>
    imagemUrl?: string // campo local (frontend-only)
}
