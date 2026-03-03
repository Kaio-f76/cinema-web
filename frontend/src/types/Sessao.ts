import type { Ingresso } from './Ingresso'
import type { Assento } from './Assento'

export interface Sessao {
    id?: string
    data?: string
    horarioFilme?: string
    filme?: {
        id: string
        nome?: string
        descricao?: string
        dataLancamento?: string
        genero?: string
        diretor?: string
        elenco?: string
        classificacao?: string
        distribuidor?: string
        duracao?: number
        valorFilme?: number
        imagemUrl?: string
    }
    sala?: {
        id: string
        nome?: string
        numAssentos?: number
        assentos?: Assento[]
    }
    ingressos?: Ingresso[]
}
