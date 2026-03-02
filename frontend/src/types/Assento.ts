export interface Assento {
    id?: string
    numero: number
    fila: string
    tipo: string
    salaId?: string
}

export interface AssentoStatus {
    id: string
    numero: number
    fila: string
    tipo: string
    ocupado: boolean
}
