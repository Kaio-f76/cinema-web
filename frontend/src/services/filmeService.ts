import api from "./api"
import type { Filme } from "../types/Filme"

// Remove campos que não devem ser enviados ao backend
const stripCamposLocais = (filme: Partial<Filme>): Record<string, unknown> => {
    const { imagemUrl, sessoes, id, ...rest } = filme as any
    return rest
}

// Salva/recupera imagens no localStorage
const STORAGE_KEY = 'filme-imagens'

const getImagensMap = (): Record<string, string> => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
        return {}
    }
}

const salvarImagemLocal = (id: string, imagemUrl: string) => {
    const map = getImagensMap()
    if (imagemUrl) {
        map[id] = imagemUrl
    } else {
        delete map[id]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

const aplicarImagemLocal = (filme: Filme): Filme => {
    const map = getImagensMap()
    if (filme.id && map[filme.id]) {
        filme.imagemUrl = map[filme.id]
    }
    return filme
}

const filmeService = {
    async listar(): Promise<Filme[]> {
        const response = await api.get<Filme[]>("/filmes")
        return response.data.map(aplicarImagemLocal)
    },

    async buscarPorId(id: string): Promise<Filme> {
        const response = await api.get<Filme>(`/filmes/${id}`)
        return aplicarImagemLocal(response.data)
    },

    async buscarPorNome(nome: string): Promise<Filme> {
        const response = await api.get<Filme>(`/filmes/nome/${nome}`)
        return aplicarImagemLocal(response.data)
    },

    async buscarPorGenero(genero: string): Promise<Filme[]> {
        const response = await api.get<Filme[]>(`/filmes/genero/${genero}`)
        return response.data.map(aplicarImagemLocal)
    },

    async criar(filme: Filme): Promise<Filme> {
        const imagemUrl = filme.imagemUrl
        const payload = stripCamposLocais(filme)
        console.log('POST /filmes payload:', JSON.stringify(payload))
        try {
            const response = await api.post<Filme>("/filmes", payload)
            const criado = response.data
            if (imagemUrl && criado.id) {
                salvarImagemLocal(criado.id, imagemUrl)
                criado.imagemUrl = imagemUrl
            }
            return criado
        } catch (err: any) {
            console.error('POST /filmes ERRO - status:', err.response?.status)
            console.error('POST /filmes ERRO - body:', JSON.stringify(err.response?.data))
            console.error('POST /filmes ERRO - headers:', JSON.stringify(err.response?.headers))
            throw err
        }
    },

    async atualizar(id: string, filme: Partial<Filme>): Promise<Filme> {
        const imagemUrl = filme.imagemUrl
        const response = await api.put<Filme>(`/filmes/${id}`, stripCamposLocais(filme))
        const atualizado = response.data
        if (imagemUrl !== undefined) {
            salvarImagemLocal(id, imagemUrl || '')
            atualizado.imagemUrl = imagemUrl
        }
        return atualizado
    },

    async excluir(id: string): Promise<void> {
        await api.delete(`/filmes/${id}`)
        // Limpar imagem local
        const map = getImagensMap()
        delete map[id]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    }
}

export default filmeService
