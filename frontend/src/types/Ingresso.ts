export interface Ingresso {
    id?: string
    usuarioId?: string
    sessaoId?: string
    assentoSessaoId?: string
    tipoIngresso?: string
    valorI?: number
    valorDesconto?: number
    dataCompra?: string
}

export interface CompraIngresso {
    usuarioId: string
    sessaoId: string
    assentoIds: string[]
}
