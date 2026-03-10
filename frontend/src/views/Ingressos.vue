<template>
  <div class="max-w-7xl mx-auto">

    <!-- Botão Voltar -->
    <button
      @click="voltar"
      class="flex items-center gap-2 text-[#A8AAAD] hover:text-white transition mb-6 group"
    >
      <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span class="text-sm font-medium">Voltar para Filmes</span>
    </button>

    <!-- ==================== STEPPER ==================== -->
    <div class="flex items-center justify-center mb-10">
      <div class="flex items-center gap-0">
        <!-- Step 1: Filme -->
        <div class="flex items-center">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-[#2FA36A] text-white">
              <Check class="w-5 h-5" />
            </div>
            <span class="text-sm font-medium text-[#2FA36A]">Filme</span>
          </div>
          <div class="w-16 h-0.5 mx-3" :class="etapa >= 1 ? 'bg-[#2FA36A]' : 'bg-[#252829]'"></div>
        </div>

        <!-- Step 2: Assentos -->
        <div class="flex items-center">
          <div class="flex items-center gap-2">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              :class="etapa >= 1 ? 'bg-[#2FA36A] text-white' : 'bg-[#252829] text-[#A8AAAD]'"
            >
              <span v-if="etapa < 2">2</span>
              <Check v-else class="w-5 h-5" />
            </div>
            <span class="text-sm font-medium" :class="etapa >= 1 ? 'text-white' : 'text-[#A8AAAD]'">Assentos</span>
          </div>
          <div class="w-16 h-0.5 mx-3" :class="etapa >= 2 ? 'bg-[#2FA36A]' : 'bg-[#252829]'"></div>
        </div>

        <!-- Step 3: Pagamento -->
        <div class="flex items-center">
          <div class="flex items-center gap-2">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              :class="etapa >= 2 ? 'bg-[#2FA36A] text-white' : 'bg-[#252829] text-[#A8AAAD]'"
            >
              <span v-if="etapa < 3">3</span>
              <Check v-else class="w-5 h-5" />
            </div>
            <span class="text-sm font-medium" :class="etapa >= 2 ? 'text-white' : 'text-[#A8AAAD]'">Pagamento</span>
          </div>
          <div class="w-16 h-0.5 mx-3" :class="etapa >= 3 ? 'bg-[#2FA36A]' : 'bg-[#252829]'"></div>
        </div>

        <!-- Step 4: Confirmação -->
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            :class="etapa >= 3 ? 'bg-[#2FA36A] text-white' : 'bg-[#252829] text-[#A8AAAD]'"
          >
            <span v-if="etapa < 3">4</span>
            <Check v-else class="w-5 h-5" />
          </div>
          <span class="text-sm font-medium" :class="etapa >= 3 ? 'text-white' : 'text-[#A8AAAD]'">Confirmação</span>
        </div>
      </div>
    </div>

    <!-- ==================== LOADING ==================== -->
    <div v-if="carregando" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Carregando sessão...</p>
    </div>

    <!-- ==================== ERRO ==================== -->
    <div v-if="erroMsg" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6">
      {{ erroMsg }}
    </div>

    <!-- ==================== ETAPA 1: SELEÇÃO DE ASSENTOS ==================== -->
    <div v-if="!carregando && sessao && etapa === 1" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- ESQUERDA: GRID DE ASSENTOS -->
      <div class="lg:col-span-2">
        <h3 class="text-xl font-bold mb-6" style="font-family: 'Poppins', sans-serif;">
          Escolha seus assentos
        </h3>

        <!-- Tela do cinema -->
        <div class="mb-8">
          <div class="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-[#2FA36A]/60 to-transparent rounded-full mb-2"></div>
          <p class="text-center text-xs text-[#A8AAAD]">TELA</p>
        </div>

        <!-- Grid de assentos -->
        <div class="flex flex-col items-center gap-2 mb-8">
          <div
            v-for="fila in filasOrdenadas"
            :key="fila"
            class="flex items-center gap-1"
          >
            <!-- Label da fila -->
            <span class="w-6 text-xs text-[#A8AAAD] text-right mr-2 font-mono">{{ fila }}</span>

            <!-- Assentos da fila -->
            <button
              v-for="assento in assentosPorFila[fila]"
              :key="assento.id"
              @click="toggleAssento(assento)"
              :disabled="assento.ocupado"
              class="w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center transition-all duration-200"
              :class="getAssentoClass(assento)"
              :title="`${fila}${assento.numero} - ${assento.tipo}${assento.ocupado ? ' (Ocupado)' : ''}`"
            >
              {{ assento.numero }}
            </button>

            <span class="w-6 text-xs text-[#A8AAAD] text-left ml-2 font-mono">{{ fila }}</span>
          </div>
        </div>

        <!-- Legenda -->
        <div class="flex items-center justify-center gap-6 text-xs text-[#A8AAAD]">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-[#1A1C1E] border border-[#252829]"></div>
            <span>Disponível</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-[#2FA36A]"></div>
            <span>Selecionado</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-[#EF4444]/40"></div>
            <span>Ocupado</span>
          </div>
        </div>
      </div>

      <!-- DIREITA: PAINEL DE RESUMO -->
      <div class="lg:col-span-1">
        <div class="bg-[#131516] border border-[#252829] rounded-2xl overflow-hidden sticky top-6">

          <!-- Banner do filme -->
          <div class="relative h-32 overflow-hidden">
            <img
              v-if="sessao.filme?.imagemUrl"
              :src="getImagemUrl(sessao.filme.imagemUrl)"
              :alt="sessao.filme.nome"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0" :style="{ background: getGradient(sessao.filme?.genero) }"></div>
            <div v-if="!sessao.filme?.imagemUrl" class="absolute inset-0 flex items-center justify-center opacity-20">
              <Film class="w-12 h-12 text-white" />
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#131516] to-transparent">
              <h4 class="font-bold text-lg">{{ sessao.filme?.nome || 'Filme' }}</h4>
              <p class="text-xs text-[#A8AAAD]">
                {{ formatarData(sessao.data) }} · {{ sessao.horarioFilme }}
              </p>
            </div>
          </div>

          <div class="p-5">
            <!-- Info da sessão -->
            <div class="flex items-center gap-2 text-sm text-[#A8AAAD] mb-4">
              <MapPin class="w-4 h-4" />
              <span>{{ sessao.sala?.nome || 'Sala' }}</span>
            </div>

            <!-- Assentos selecionados -->
            <div class="mb-4">
              <p class="text-sm font-semibold mb-2">
                Assentos Selecionados
                <span class="text-[#2FA36A] ml-1">({{ assentosSelecionados.length }})</span>
              </p>

              <div v-if="assentosSelecionados.length === 0" class="text-sm text-[#A8AAAD]">
                Selecione seus assentos no mapa
              </div>

              <div v-else class="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                <div
                  v-for="assento in assentosSelecionados"
                  :key="assento.id"
                  class="flex items-center justify-between bg-[#0D0F10] rounded-lg px-3 py-2 text-sm"
                >
                  <span class="font-mono">{{ assento.fila }}{{ assento.numero }}</span>
                  <span class="text-xs text-[#A8AAAD]">{{ assento.tipo }}</span>
                </div>
              </div>
            </div>

            <!-- Preço -->
            <div class="border-t border-[#252829] pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-[#A8AAAD]">Ingresso (×{{ assentosSelecionados.length }})</span>
                <span>R$ {{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-[#2FA36A]">R$ {{ total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Botão comprar -->
            <button
              @click="comprarIngressos"
              :disabled="assentosSelecionados.length === 0 || comprando"
              class="w-full mt-5 bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {{ comprando ? 'Processando...' : 'Continuar para Pagamento' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== ETAPA 3: CONFIRMAÇÃO ==================== -->
    <div v-if="etapa === 3" class="max-w-lg mx-auto text-center py-10">
      <div class="w-20 h-20 rounded-full bg-[#2FA36A] flex items-center justify-center mx-auto mb-6">
        <Check class="w-10 h-10 text-white" />
      </div>

      <h3 class="text-2xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">
        Compra Realizada!
      </h3>
      <p class="text-[#A8AAAD] mb-8">
        Seus ingressos foram comprados com sucesso.
      </p>

      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 text-left mb-8">
        <h4 class="font-semibold mb-3">Detalhes da compra</h4>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-[#A8AAAD]">Filme</span>
            <span>{{ sessao?.filme?.nome }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[#A8AAAD]">Sessão</span>
            <span>{{ formatarData(sessao?.data) }} · {{ sessao?.horarioFilme }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[#A8AAAD]">Sala</span>
            <span>{{ sessao?.sala?.nome }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[#A8AAAD]">Assentos</span>
            <span>{{ assentosComprados }}</span>
          </div>
          <div class="flex justify-between border-t border-[#252829] pt-2 mt-2">
            <span class="font-semibold">Total pago</span>
            <span class="text-[#2FA36A] font-bold">R$ {{ totalCompra.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <router-link
          to="/filmes"
          class="flex-1 bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition text-center"
        >
          Ver mais filmes
        </router-link>
        <router-link
          to="/"
          class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition text-center"
        >
          Voltar ao início
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Film, Check, MapPin, ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import sessaoService from '../services/sessaoService'
import ingressoService from '../services/ingressoService'
import { useUsuario } from '../composables/useUsuario'
import type { Sessao } from '../types/Sessao'
import type { AssentoStatus } from '../types/Assento'

const route = useRoute()
const router = useRouter()
const { usuario, fetchUsuario } = useUsuario()

const UPLOADS_URL = 'http://localhost:8080/uploads/'

const getImagemUrl = (url?: string): string => {
  if (!url) return ''
  return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`
}

const voltar = () => {
  if (etapa.value === 3) {
    router.push('/filmes')
  } else if (etapa.value > 1) {
    etapa.value = etapa.value - 1
  } else {
    router.push('/filmes')
  }
}

const sessao = ref<Sessao | null>(null)
const assentos = ref<AssentoStatus[]>([])
const selecionados = ref<Set<string>>(new Set())
const carregando = ref(true)
const comprando = ref(false)
const erroMsg = ref('')
const etapa = ref(1)
const totalCompra = ref(0)
const assentosComprados = ref('')

// Carregar sessão e assentos
onMounted(async () => {
  const sessaoId = route.params.sessaoId as string
  if (!sessaoId) {
    erroMsg.value = 'Sessão não especificada.'
    carregando.value = false
    return
  }

  try {
    const [sessaoData, assentosData] = await Promise.all([
      sessaoService.buscarPorId(sessaoId),
      sessaoService.listarAssentos(sessaoId)
    ])
    sessao.value = sessaoData
    assentos.value = assentosData

    // Verificar se há assentos disponíveis
    const disponiveis = assentosData.filter((a: AssentoStatus) => !a.ocupado)
    if (disponiveis.length === 0) {
      erroMsg.value = 'Sala lotada. Todos os assentos estão ocupados.'
    }

    console.log('Sessão carregada:', sessaoData)
    console.log('valorFilme:', sessaoData.filme?.valorFilme)
  } catch (e: any) {
    erroMsg.value = e.response?.data?.message || 'Erro ao carregar dados da sessão.'
  } finally {
    carregando.value = false
  }
})

// Agrupar assentos por fila
const assentosPorFila = computed(() => {
  const mapa: Record<string, AssentoStatus[]> = {}
  assentos.value.forEach(a => {
    if (!mapa[a.fila]) mapa[a.fila] = []
    mapa[a.fila].push(a)
  })
  // Ordenar por número dentro de cada fila
  Object.values(mapa).forEach(arr => arr.sort((a, b) => a.numero - b.numero))
  return mapa
})

const filasOrdenadas = computed(() => {
  return Object.keys(assentosPorFila.value).sort()
})

const assentosSelecionados = computed(() => {
  return assentos.value.filter(a => selecionados.value.has(a.id))
})

const valorIngresso = computed(() => {
  return sessao.value?.filme?.valorFilme ?? 0
})

const subtotal = computed(() => {
  return assentosSelecionados.value.length * valorIngresso.value
})

const total = computed(() => subtotal.value)

// Toggle seleção de assento
const toggleAssento = (assento: AssentoStatus) => {
  if (assento.ocupado) return

  const novoSet = new Set(selecionados.value)
  if (novoSet.has(assento.id)) {
    novoSet.delete(assento.id)
  } else {
    novoSet.add(assento.id)
  }
  selecionados.value = novoSet
}

// Classe CSS do assento
const getAssentoClass = (assento: AssentoStatus): string => {
  if (assento.ocupado) {
    return 'bg-[#EF4444]/30 border border-[#EF4444]/50 text-[#EF4444]/60 cursor-not-allowed'
  }
  if (selecionados.value.has(assento.id)) {
    return 'bg-[#2FA36A] text-white border border-[#2FA36A] shadow-lg shadow-[#2FA36A]/20 scale-105'
  }
  return 'bg-[#1A1C1E] border border-[#252829] text-[#A8AAAD] hover:bg-[#252829] hover:border-[#2FA36A]/50 cursor-pointer'
}

// Gradient do filme
const getGradient = (genero?: string): string => {
  const gradients: Record<string, string> = {
    'Ação': 'linear-gradient(135deg, #7f1d1d, #b91c1c)',
    'Aventura': 'linear-gradient(135deg, #78350f, #d97706)',
    'Comédia': 'linear-gradient(135deg, #365314, #65a30d)',
    'Drama': 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
    'Ficção Científica': 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    'Ficção': 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    'Ficcao': 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    'Terror': 'linear-gradient(135deg, #450a0a, #991b1b)',
    'Romance': 'linear-gradient(135deg, #831843, #ec4899)',
    'Suspense': 'linear-gradient(135deg, #1f2937, #6b7280)',
  }
  return gradients[genero || ''] || 'linear-gradient(135deg, #1a1a2e, #16213e)'
}

const formatarData = (data?: string): string => {
  if (!data) return ''
  try {
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return data
  }
}

// Comprar ingressos
const comprarIngressos = async () => {
  if (!usuario.value?.id || !sessao.value?.id || assentosSelecionados.value.length === 0) return

  comprando.value = true
  erroMsg.value = ''

  try {
    // Comprar e usar o retorno da API para calcular o total real pago
    const ingressosComprados = await ingressoService.comprar({
      usuarioId: usuario.value.id,
      sessaoId: sessao.value.id,
      assentoIds: assentosSelecionados.value.map(a => a.id)
    })
    console.log('Ingressos retornados:', ingressosComprados)

    // Salvar dados para confirmação
    assentosComprados.value = assentosSelecionados.value
      .map(a => `${a.fila}${a.numero}`)
      .join(', ')

    const totalReal = ingressosComprados.reduce((acc: number, ing: any) => acc + (ing.valorI ?? 0), 0)
    totalCompra.value = totalReal > 0 ? totalReal : total.value

    // Atualizar saldo do usuário
    await fetchUsuario()

    // Ir para confirmação
    etapa.value = 3
  } catch (e: any) {
    if (e.response?.status === 409) {
      erroMsg.value = 'Um ou mais assentos já foram ocupados. Tente novamente.'
      // Recarregar assentos
      try {
        assentos.value = await sessaoService.listarAssentos(sessao.value.id!)
        selecionados.value = new Set()
      } catch {}
    } else if (e.response?.status === 400) {
      erroMsg.value = e.response?.data?.message || e.response?.data || 'Saldo insuficiente ou dados inválidos.'
      setTimeout(() => router.push('/'), 1000)
      return
    } else {
      erroMsg.value = e.response?.data?.message || 'Erro ao comprar ingressos.'
    }
  } finally {
    comprando.value = false
  }
}
</script>
