import { ref } from 'vue'
import sessaoService from '../services/sessaoService'
import type { Sessao } from '../types/Sessao'

const sessoes = ref<Sessao[]>([])
const sessaoAtual = ref<Sessao | null>(null)
const loading = ref(false)
const erro = ref<string | null>(null)

export function useSessao() {
    const listarSessoes = async () => {
        loading.value = true
        erro.value = null
        try {
            sessoes.value = await sessaoService.listar()
        } catch (e: any) {
            erro.value = e.response?.data || e.response?.data?.message || 'Erro ao listar sessões'
            sessoes.value = []
        } finally {
            loading.value = false
        }
    }

    const buscarPorId = async (id: string) => {
        loading.value = true
        erro.value = null
        try {
            sessaoAtual.value = await sessaoService.buscarPorId(id)
        } catch (e: any) {
            erro.value = e.response?.data || 'Sessão não encontrada'
            sessaoAtual.value = null
        } finally {
            loading.value = false
        }
    }

    const buscarPorFilme = async (filmeId: string) => {
        loading.value = true
        erro.value = null
        try {
            sessoes.value = await sessaoService.buscarPorFilme(filmeId)
        } catch (e: any) {
            erro.value = e.response?.data || 'Erro ao buscar sessões por filme'
            sessoes.value = []
        } finally {
            loading.value = false
        }
    }

    const buscarPorSala = async (salaId: string) => {
        loading.value = true
        erro.value = null
        try {
            sessoes.value = await sessaoService.buscarPorSala(salaId)
        } catch (e: any) {
            erro.value = e.response?.data || 'Erro ao buscar sessões por sala'
            sessoes.value = []
        } finally {
            loading.value = false
        }
    }

    const criarSessao = async (sessao: Sessao) => {
        loading.value = true
        erro.value = null
        try {
            const nova = await sessaoService.criar(sessao)
            sessoes.value.push(nova)
            return nova
        } catch (e: any) {
            erro.value = e.response?.data || e.response?.data?.message || 'Erro ao criar sessão'
            throw e
        } finally {
            loading.value = false
        }
    }

    const atualizarSessao = async (id: string, sessao: Sessao) => {
        loading.value = true
        erro.value = null
        try {
            const atualizada = await sessaoService.atualizar(id, sessao)
            const index = sessoes.value.findIndex(s => s.id === id)
            if (index !== -1) sessoes.value[index] = atualizada
            return atualizada
        } catch (e: any) {
            erro.value = e.response?.data || e.response?.data?.message || 'Erro ao atualizar sessão'
            throw e
        } finally {
            loading.value = false
        }
    }

    const excluirSessao = async (id: string) => {
        loading.value = true
        erro.value = null
        try {
            await sessaoService.excluir(id)
            sessoes.value = sessoes.value.filter(s => s.id !== id)
        } catch (e: any) {
            erro.value = e.response?.data || e.response?.data?.message || 'Erro ao excluir sessão'
            throw e
        } finally {
            loading.value = false
        }
    }

    const limparErro = () => { erro.value = null }

    return {
        sessoes,
        sessaoAtual,
        loading,
        erro,
        listarSessoes,
        buscarPorId,
        buscarPorFilme,
        buscarPorSala,
        criarSessao,
        atualizarSessao,
        excluirSessao,
        limparErro
    }
}
