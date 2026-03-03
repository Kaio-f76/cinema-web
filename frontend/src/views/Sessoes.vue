<template>
  <div class="max-w-7xl mx-auto">

    <!-- Header -->
    <div class="flex items-start justify-between mb-2">
      <div>
        <h2 class="text-3xl font-bold" style="font-family: 'Poppins', sans-serif;">
          Gerenciar Sessões
        </h2>
        <p class="text-[#A8AAAD] text-sm mt-1">Crie sessões em múltiplos dias e horários</p>
      </div>

      <button
        v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
        @click="abrirModal()"
        class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
      >
        <Plus class="w-4 h-4" />
        Nova Sessão
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap items-end gap-4 mt-6 mb-8">
      <!-- Filme -->
      <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
        <label class="text-xs text-[#A8AAAD]">Filme</label>
        <select
          v-model="filtroFilme"
          class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2FA36A]"
        >
          <option value="">Todos os filmes</option>
          <option v-for="f in filmesDisponiveis" :key="f.id" :value="f.id">{{ f.nome }}</option>
        </select>
      </div>

      <!-- Sala -->
      <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
        <label class="text-xs text-[#A8AAAD]">Sala</label>
        <select
          v-model="filtroSala"
          class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2FA36A]"
        >
          <option value="">Todas as salas</option>
          <option v-for="s in salasDisponiveis" :key="s.id" :value="s.id">{{ s.nome }}</option>
        </select>
      </div>

      <!-- Data -->
      <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
        <label class="text-xs text-[#A8AAAD]">Data</label>
        <input
          v-model="filtroData"
          type="date"
          class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2FA36A]"
        />
      </div>

      <!-- Limpar Filtros -->
      <button
        @click="limparFiltros"
        class="bg-[#1A1C1E] border border-[#252829] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#252829] transition"
      >
        Limpar Filtros
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Carregando sessões...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6 mt-2">
      {{ erro }}
      <button @click="limparErro" class="ml-4 underline">Fechar</button>
    </div>

    <!-- Lista de Cards -->
    <div v-if="!loading && sessoesFiltradas.length > 0" class="flex flex-col gap-4">
      <div
        v-for="sessao in sessoesFiltradas"
        :key="sessao.id"
        class="bg-[#131516] border border-[#252829] rounded-2xl p-6 hover:border-[#2FA36A]/30 transition"
      >
        <!-- Topo do card -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold">{{ sessao.filme?.nome ?? 'Filme não definido' }}</h3>
            <div class="flex items-center gap-4 mt-1.5 text-sm text-[#A8AAAD]">
              <span class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4 text-[#6366f1]" />
                {{ formatarData(sessao.data) }}
              </span>
              <span class="flex items-center gap-1.5">
                <Clock class="w-4 h-4 text-[#A8AAAD]" />
                {{ sessao.horarioFilme }}
              </span>
              <span class="flex items-center gap-1.5">
                <Building2 class="w-4 h-4 text-[#A8AAAD]" />
                {{ sessao.sala?.nome ?? 'Sala não definida' }}
              </span>
            </div>
          </div>

          <!-- Ações Admin -->
          <div v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'" class="flex gap-2">
            <button
              @click="abrirModal(sessao)"
              class="px-4 py-1.5 bg-[#2FA36A] rounded-lg text-sm font-semibold hover:bg-[#3BB77C] transition"
            >
              Editar
            </button>
            <button
              @click="confirmarExclusao(sessao)"
              class="px-4 py-1.5 bg-[#EF4444] rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Excluir
            </button>
          </div>
        </div>

        <!-- Estatísticas -->
        <div class="grid grid-cols-4 gap-4 border-t border-[#252829] pt-4">
          <div>
            <p class="text-xs text-[#A8AAAD]">Capacidade Total</p>
            <p class="font-bold text-lg">{{ sessao.sala?.numAssentos ?? 0 }} lugares</p>
          </div>
          <div>
            <p class="text-xs text-[#A8AAAD]">Disponíveis</p>
            <p class="font-bold text-lg text-[#2FA36A]">{{ getDisponivel(sessao) }} lugares</p>
          </div>
          <div>
            <p class="text-xs text-[#A8AAAD]">Vendidos</p>
            <p class="font-bold text-lg">{{ getVendidos(sessao) }} ingressos</p>
          </div>
          <div>
            <p class="text-xs text-[#A8AAAD]">Ocupação</p>
            <p class="font-bold text-lg" :class="getOcupacao(sessao) >= 80 ? 'text-[#EF4444]' : 'text-[#2FA36A]'">
              {{ getOcupacao(sessao) }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Vazio -->
    <div v-if="!loading && sessoes.length === 0 && !erro" class="text-center py-20">
      <Clapperboard class="w-16 h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Nenhuma sessão cadastrada.</p>
    </div>

    <div v-if="!loading && sessoes.length > 0 && sessoesFiltradas.length === 0" class="text-center py-20">
      <Clapperboard class="w-16 h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Nenhuma sessão encontrada para os filtros selecionados.</p>
    </div>

    <!-- ==================== MODAL CRIAR/EDITAR ==================== -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="fecharModal"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-md">
        <h3 class="text-xl font-bold mb-6" style="font-family: 'Poppins', sans-serif;">
          {{ editando ? 'Editar Sessão' : 'Nova Sessão' }}
        </h3>

        <div v-if="erroModal" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-4 text-sm">
          {{ erroModal }}
        </div>

        <form @submit.prevent="salvarSessao" class="flex flex-col gap-4">
          <!-- Filme -->
          <div>
            <label class="text-xs text-[#A8AAAD] mb-1 block">Filme</label>
            <select
              v-model="formFilmeId"
              required
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
            >
              <option value="" disabled>Selecione um filme</option>
              <option v-for="f in filmesDisponiveis" :key="f.id" :value="f.id">{{ f.nome }}</option>
            </select>
          </div>

          <!-- Sala -->
          <div>
            <label class="text-xs text-[#A8AAAD] mb-1 block">Sala</label>
            <select
              v-model="formSalaId"
              required
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
            >
              <option value="" disabled>Selecione uma sala</option>
              <option v-for="s in salasDisponiveis" :key="s.id" :value="s.id">{{ s.nome }}</option>
            </select>
          </div>

          <!-- Data -->
          <div>
            <label class="text-xs text-[#A8AAAD] mb-1 block">Data</label>
            <input
              v-model="formData"
              type="date"
              required
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
            />
          </div>

          <!-- Horário -->
          <div>
            <label class="text-xs text-[#A8AAAD] mb-1 block">Horário</label>
            <input
              v-model="formHorario"
              type="time"
              required
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
            />
          </div>

          <div class="flex gap-4 mt-4">
            <button
              type="submit"
              :disabled="salvando"
              class="flex-1 bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition disabled:opacity-50"
            >
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="fecharModal"
              class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL EXCLUSÃO ==================== -->
    <div
      v-if="modalExclusao"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="cancelarExclusao"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-md text-center">
        <Trash2 class="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">Excluir Sessão</h3>
        <p class="text-[#A8AAAD] mb-6">
          Tem certeza que deseja excluir a sessão de
          <strong class="text-white">{{ sessaoParaExcluir?.filme?.nome }}</strong>
          no dia <strong class="text-white">{{ formatarData(sessaoParaExcluir?.data) }}</strong>
          às <strong class="text-white">{{ sessaoParaExcluir?.horarioFilme }}</strong>?
        </p>
        <div class="flex gap-4">
          <button
            @click="executarExclusao"
            :disabled="salvando"
            class="flex-1 bg-[#EF4444] py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            {{ salvando ? 'Excluindo...' : 'Excluir' }}
          </button>
          <button
            @click="cancelarExclusao"
            class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, Calendar, Clock, Building2, Trash2, Clapperboard } from 'lucide-vue-next'
import { useSessao } from '../composables/useSessao'
import { useFilme } from '../composables/useFilme'
import { useSala } from '../composables/useSala'
import { useUsuario } from '../composables/useUsuario'
import sessaoService from '../services/sessaoService'
import type { Sessao } from '../types/Sessao'
import type { Filme } from '../types/Filme'
import type { Sala } from '../types/Sala'

const { sessoes, loading, erro, listarSessoes, criarSessao, atualizarSessao, excluirSessao, limparErro } = useSessao()
const { filmes, listarFilmes } = useFilme()
const { salas, listarSalas } = useSala()
const { usuario } = useUsuario()

// Filtros
const filtroFilme = ref('')
const filtroSala = ref('')
const filtroData = ref('')

// Modal criar/editar
const modalAberto = ref(false)
const editando = ref(false)
const salvando = ref(false)
const erroModal = ref<string | null>(null)
const formFilmeId = ref('')
const formSalaId = ref('')
const formData = ref('')
const formHorario = ref('')
const sessaoEditando = ref<Sessao | null>(null)

// Modal exclusão
const modalExclusao = ref(false)
const sessaoParaExcluir = ref<Sessao | null>(null)

// Computed
const filmesDisponiveis = computed(() => filmes.value.filter(f => f.id))
const salasDisponiveis = computed(() => salas.value.filter(s => s.id))

const sessoesFiltradas = computed(() => {
  return sessoes.value.filter(s => {
    if (filtroFilme.value && s.filme?.id !== filtroFilme.value) return false
    if (filtroSala.value && s.sala?.id !== filtroSala.value) return false
    if (filtroData.value) {
      const dataSessao = formatarDataISO(s.data)
      if (dataSessao !== filtroData.value) return false
    }
    return true
  })
})

// Lifecycle
onMounted(async () => {
  await Promise.all([listarSessoes(), listarFilmes(), listarSalas()])
})

// Helpers
const formatarData = (data?: string | number) => {
  if (data === undefined || data === null || data === '') return ''
  try {
    let d: Date
    if (typeof data === 'number') {
      d = new Date(data)
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      // String date-only "yyyy-MM-dd" → parsear como UTC
      d = new Date(data + 'T00:00:00Z')
    } else {
      d = new Date(data)
    }
    if (isNaN(d.getTime())) return String(data)
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  } catch {
    return String(data)
  }
}

const formatarDataISO = (data?: string | number) => {
  if (data === undefined || data === null || data === '') return ''
  try {
    let d: Date
    if (typeof data === 'number') {
      d = new Date(data)
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      d = new Date(data + 'T00:00:00Z')
    } else {
      d = new Date(data)
    }
    if (isNaN(d.getTime())) return String(data)
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  } catch {
    return String(data)
  }
}

const getVendidos = (sessao: Sessao) => sessao.ingressos?.length ?? 0

const getDisponivel = (sessao: Sessao) => {
  const total = sessao.sala?.numAssentos ?? 0
  const vendidos = getVendidos(sessao)
  return Math.max(0, total - vendidos)
}

const getOcupacao = (sessao: Sessao) => {
  const total = sessao.sala?.numAssentos ?? 0
  if (total === 0) return 0
  return Math.round((getVendidos(sessao) / total) * 100)
}

const limparFiltros = () => {
  filtroFilme.value = ''
  filtroSala.value = ''
  filtroData.value = ''
}

// Modal criar/editar
const abrirModal = async (sessao?: Sessao) => {
  erroModal.value = null
  if (sessao && sessao.id) {
    editando.value = true
    sessaoEditando.value = sessao
    formFilmeId.value = sessao.filme?.id ?? ''
    formSalaId.value = sessao.sala?.id ?? ''
    formData.value = formatarDataISO(sessao.data)
    formHorario.value = sessao.horarioFilme ?? ''
  } else {
    editando.value = false
    sessaoEditando.value = null
    formFilmeId.value = ''
    formSalaId.value = ''
    formData.value = ''
    formHorario.value = ''
  }
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  editando.value = false
  sessaoEditando.value = null
  erroModal.value = null
  formFilmeId.value = ''
  formSalaId.value = ''
  formData.value = ''
  formHorario.value = ''
}

const salvarSessao = async () => {
  if (!formFilmeId.value || !formSalaId.value || !formData.value || !formHorario.value) return

  salvando.value = true
  erroModal.value = null
  try {
    const payload: Sessao = {
      data: formData.value,
      horarioFilme: formHorario.value,
      filme: { id: formFilmeId.value },
      sala: { id: formSalaId.value },
      ingressos: []
    }

    if (editando.value && sessaoEditando.value?.id) {
      await atualizarSessao(sessaoEditando.value.id, payload)
    } else {
      await criarSessao(payload)
    }
    fecharModal()
    await listarSessoes()
  } catch (e: any) {
    erroModal.value = e.response?.data || e.response?.data?.message || 'Erro ao salvar sessão'
  } finally {
    salvando.value = false
  }
}

// Modal exclusão
const confirmarExclusao = (sessao: Sessao) => {
  sessaoParaExcluir.value = sessao
  modalExclusao.value = true
}

const cancelarExclusao = () => {
  sessaoParaExcluir.value = null
  modalExclusao.value = false
}

const executarExclusao = async () => {
  if (!sessaoParaExcluir.value?.id) return

  salvando.value = true
  try {
    await excluirSessao(sessaoParaExcluir.value.id)
    cancelarExclusao()
  } catch (e) {
    // erro tratado no composable
  } finally {
    salvando.value = false
  }
}
</script>
