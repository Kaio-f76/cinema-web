import type { Assento } from './Assento'

export interface Sala {
    id?: string
    nome: string
    numAssentos?: number
    sessoes?: Array<{ id?: string; data?: string; horarioFilme?: string }>
    assentos?: Assento[]
}
