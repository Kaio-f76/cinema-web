<template>
  <div class="-mx-6 -mt-10">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-32">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Carregando filme...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="px-4 sm:px-8 pt-8">
      <div class="max-w-5xl mx-auto bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg">
        {{ erro }}
      </div>
    </div>

    <!-- Conteúdo -->
    <div v-if="!loading && filme">

      <!-- Hero / Banner fullwidth -->
      <div class="relative w-full h-[50vh] sm:h-[55vh] lg:h-[60vh] overflow-hidden">
        <img
          v-if="filme.imagemUrl"
          :src="filme.imagemUrl"
          :alt="filme.nome"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div v-else class="absolute inset-0" :style="{ background: getGradient(filme.genero) }"></div>
        <div v-if="!filme.imagemUrl" class="absolute inset-0 flex items-center justify-center opacity-20">
          <Film class="w-20 h-20 sm:w-28 sm:h-28 text-white" />
        </div>

        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#0A0D0C] via-[#0A0D0C]/30 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#0A0D0C]/60 to-transparent"></div>

        <!-- Botão Voltar -->
        <button
          @click="router.back()"
          class="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-black/70 transition group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span class="text-sm hidden sm:inline">Voltar</span>
        </button>

        <!-- Badge classificação -->
        <div
          class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg"
          :style="{ backgroundColor: getClassificacaoColor(filme.classificacao) }"
        >
          {{ filme.classificacao || 'L' }}
        </div>
      </div>

      <!-- Conteúdo principal -->
      <div class="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">

        <!-- Título -->
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2" style="font-family: 'Poppins', sans-serif;">
          {{ filme.nome }}
        </h1>

        <!-- Tags -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
          <span v-if="filme.genero" class="text-xs border border-[#2FA36A] text-[#2FA36A] rounded-lg px-3 py-1">
            {{ filme.genero }}
          </span>
          <span v-if="filme.duracao" class="text-xs sm:text-sm text-[#A8AAAD] flex items-center gap-1">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {{ filme.duracao }} min
          </span>
          <span v-if="filme.classificacao" class="text-xs sm:text-sm text-[#A8AAAD]">Classificação: {{ filme.classificacao }}</span>
        </div>

        <!-- Preço -->
        <p class="text-[#2FA36A] text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
          R$ {{ (filme.valorFilme ?? 0).toFixed(2) }}
        </p>

        <!-- Descrição -->
        <div v-if="filme.descricao" class="mb-5 sm:mb-6">
          <h3 class="text-xs sm:text-sm font-semibold text-[#A8AAAD] uppercase tracking-wider mb-1.5">Sinopse</h3>
          <p class="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">{{ filme.descricao }}</p>
        </div>

        <!-- Grid de informações -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div v-if="filme.diretor" class="bg-[#131516] border border-[#252829] rounded-xl p-3 sm:p-4">
            <p class="text-[10px] sm:text-xs text-[#A8AAAD] uppercase tracking-wider mb-0.5">Diretor</p>
            <p class="text-sm sm:text-base font-semibold">{{ filme.diretor }}</p>
          </div>

          <div v-if="filme.elenco" class="bg-[#131516] border border-[#252829] rounded-xl p-3 sm:p-4">
            <p class="text-[10px] sm:text-xs text-[#A8AAAD] uppercase tracking-wider mb-0.5">Elenco</p>
            <p class="text-sm sm:text-base font-semibold">{{ filme.elenco }}</p>
          </div>

          <div v-if="filme.distribuidor" class="bg-[#131516] border border-[#252829] rounded-xl p-3 sm:p-4">
            <p class="text-[10px] sm:text-xs text-[#A8AAAD] uppercase tracking-wider mb-0.5">Distribuidora</p>
            <p class="text-sm sm:text-base font-semibold">{{ filme.distribuidor }}</p>
          </div>

          <div v-if="filme.dataLancamento" class="bg-[#131516] border border-[#252829] rounded-xl p-3 sm:p-4">
            <p class="text-[10px] sm:text-xs text-[#A8AAAD] uppercase tracking-wider mb-0.5">Lançamento</p>
            <p class="text-sm sm:text-base font-semibold">{{ formatarDataLonga(filme.dataLancamento) }}</p>
          </div>
        </div>

        <!-- Sessões disponíveis -->
        <div class="pb-8">
          <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style="font-family: 'Poppins', sans-serif;">
            Sessões Disponíveis
          </h3>

          <div v-if="carregandoSessoes" class="text-center py-6">
            <div class="inline-block w-6 h-6 border-3 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
            <p class="text-[#A8AAAD] mt-2 text-sm">Carregando sessões...</p>
          </div>

          <div v-else-if="sessoes.length === 0" class="bg-[#131516] border border-[#252829] rounded-xl p-5 sm:p-6 text-center">
            <p class="text-[#A8AAAD] text-sm sm:text-base">Nenhuma sessão disponível para este filme.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <router-link
              v-for="sessao in sessoes"
              :key="sessao.id"
              :to="`/ingressos/${sessao.id}`"
              class="bg-[#131516] border border-[#252829] rounded-xl p-3 sm:p-4 hover:border-[#2FA36A] transition flex items-center justify-between group"
            >
              <div>
                <p class="text-sm sm:text-base font-semibold">{{ formatarDataLonga(sessao.data) }}</p>
                <p class="text-xs sm:text-sm text-[#A8AAAD]">{{ sessao.horarioFilme }} · {{ sessao.sala?.nome || 'Sala' }}</p>
              </div>
              <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA36A] group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- Filme não encontrado -->
    <div v-if="!loading && !filme && !erro" class="text-center py-32">
      <Film class="w-14 h-14 sm:w-16 sm:h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Filme não encontrado.</p>
      <router-link to="/" class="text-[#2FA36A] text-sm mt-4 inline-block hover:underline">Voltar ao início</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Film, Clock, ArrowLeft, ChevronRight } from 'lucide-vue-next'
import filmeService from '../services/filmeService'
import sessaoService from '../services/sessaoService'
import type { Filme } from '../types/Filme'
import type { Sessao } from '../types/Sessao'
import { apiDateToBr, apiDateToLongBr } from '../utils/date-utils'

const route = useRoute()
const router = useRouter()

const filme = ref<Filme | null>(null)
const sessoes = ref<Sessao[]>([])
const loading = ref(true)
const erro = ref<string | null>(null)
const carregandoSessoes = ref(false)

const getGradient = (genero?: string): string => {
  const gradients: Record<string, string> = {
    'Ação': 'linear-gradient(135deg, #7f1d1d, #b91c1c)',
    'Aventura': 'linear-gradient(135deg, #78350f, #d97706)',
    'Comédia': 'linear-gradient(135deg, #365314, #65a30d)',
    'Drama': 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
    'Ficção Científica': 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    'Terror': 'linear-gradient(135deg, #450a0a, #991b1b)',
    'Romance': 'linear-gradient(135deg, #831843, #ec4899)',
    'Suspense': 'linear-gradient(135deg, #1f2937, #6b7280)',
  }
  return gradients[genero || ''] || 'linear-gradient(135deg, #1a1a2e, #16213e)'
}

const getClassificacaoColor = (classificacao?: string): string => {
  const cores: Record<string, string> = {
    'L': '#16a34a', '10': '#3b82f6', '12': '#f59e0b',
    '14': '#f97316', '16': '#ef4444', '18': '#7c3aed',
  }
  return cores[classificacao || ''] || '#6b7280'
}

const formatarData = (data?: string | number) => apiDateToBr(data)
const formatarDataLonga = (data?: string | number) => apiDateToLongBr(data)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    erro.value = 'ID do filme não informado.'
    loading.value = false
    return
  }

  try {
    filme.value = await filmeService.buscarPorId(id)
  } catch (e: any) {
    erro.value = e.response?.data?.message || 'Erro ao carregar filme.'
  } finally {
    loading.value = false
  }

  // Busca sessões em paralelo
  if (filme.value?.id) {
    carregandoSessoes.value = true
    try {
      sessoes.value = await sessaoService.buscarPorFilme(filme.value.id)
    } catch {
      // silencioso
    } finally {
      carregandoSessoes.value = false
    }
  }
})
</script>
