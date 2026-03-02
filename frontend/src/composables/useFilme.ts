import { ref } from 'vue'
import filmeService from '../services/filmeService'
import type { Filme } from '../types/Filme'

const filmes = ref<Filme[]>([])
const filmeAtual = ref<Filme | null>(null)
const loading = ref(false)
const erro = ref<string | null>(null)

export function useFilme() {
    const listarFilmes = async () => {
        loading.value = true
        erro.value = null
        try {
            filmes.value = await filmeService.listar()
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao listar filmes'
            filmes.value = []
        } finally {
            loading.value = false
        }
    }

    const criarFilme = async (filme: Filme) => {
        loading.value = true
        erro.value = null
        try {
            const novoFilme = await filmeService.criar(filme)
            filmes.value.push(novoFilme)
            return novoFilme
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao criar filme'
            throw e
        } finally {
            loading.value = false
        }
    }

    const atualizarFilme = async (id: string, filme: Partial<Filme>) => {
        loading.value = true
        erro.value = null
        try {
            const atualizado = await filmeService.atualizar(id, filme)
            const index = filmes.value.findIndex(f => f.id === id)
            if (index !== -1) filmes.value[index] = atualizado
            return atualizado
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao atualizar filme'
            throw e
        } finally {
            loading.value = false
        }
    }

    const excluirFilme = async (id: string) => {
        loading.value = true
        erro.value = null
        try {
            await filmeService.excluir(id)
            filmes.value = filmes.value.filter(f => f.id !== id)
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao excluir filme'
            throw e
        } finally {
            loading.value = false
        }
    }

    const limparErro = () => { erro.value = null }

    return {
        filmes,
        filmeAtual,
        loading,
        erro,
        listarFilmes,
        criarFilme,
        atualizarFilme,
        excluirFilme,
        limparErro
    }
}
