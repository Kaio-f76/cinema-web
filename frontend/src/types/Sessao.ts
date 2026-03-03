export interface Sessao {
    id?: string
    data?: string | number
    horarioFilme?: string
    filme?: {
        id: string
        nome?: string
        duracao?: number
        genero?: string
        classificacao?: string
        valorFilme?: number
        descricao?: string
        diretor?: string
    }
    sala?: {
        id: string
        nome?: string
        numAssentos?: number
    }
    ingressos?: any[]
}
