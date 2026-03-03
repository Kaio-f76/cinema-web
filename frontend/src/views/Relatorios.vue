<template>
  <div class="max-w-7xl mx-auto">

    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold" style="font-family: 'Poppins', sans-serif;">
          Relatórios
        </h2>
        <p class="text-[#A8AAAD] text-sm mt-1">Análise de desempenho dos filmes</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 mb-8">
      <div class="flex items-center gap-2 mb-5">
        <Filter class="w-5 h-5 text-[#2FA36A]" />
        <h3 class="font-semibold text-lg">Filtros</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Data Início -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Data Início</label>
          <input
            v-model="filtros.dataInicio"
            type="date"
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-3 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition"
          />
        </div>

        <!-- Data Fim -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Data Fim</label>
          <input
            v-model="filtros.dataFim"
            type="date"
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-3 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition"
          />
        </div>

        <!-- Gênero -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Gênero</label>
          <input
            v-model="filtros.genero"
            type="text"
            placeholder="Ex: Ação, Drama..."
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-3 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition placeholder:text-[#555]"
          />
        </div>

        <!-- Ordenação -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Ordenação</label>
          <select
            v-model="filtros.ordenacao"
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-3 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition"
          >
            <option value="">Padrão</option>
            <option value="nome_asc">Nome (A → Z)</option>
            <option value="nome_desc">Nome (Z → A)</option>
            <option value="ingressos_desc">Ingressos (maior → menor)</option>
            <option value="ingressos_asc">Ingressos (menor → maior)</option>
            <option value="receita_desc">Receita (maior → menor)</option>
            <option value="receita_asc">Receita (menor → maior)</option>
            <option value="sessoes_desc">Sessões (maior → menor)</option>
            <option value="sessoes_asc">Sessões (menor → maior)</option>
          </select>
        </div>
      </div>

      <!-- Botões de ação -->
      <div class="flex flex-wrap gap-3">
        <button
          @click="gerarRelatorio"
          :disabled="carregando"
          class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#3BB77C] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <BarChart3 class="w-4 h-4" />
          {{ carregando ? 'Gerando...' : 'Gerar Relatório' }}
        </button>

        <button
          @click="exportarPdf"
          :disabled="exportando"
          class="flex items-center gap-2 bg-[#1A1C1E] border border-[#252829] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#252829] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileDown class="w-4 h-4" />
          {{ exportando ? 'Exportando...' : 'Exportar PDF' }}
        </button>

        <button
          @click="limparFiltros"
          class="flex items-center gap-2 text-[#A8AAAD] hover:text-white px-4 py-2.5 rounded-lg transition"
        >
          <RotateCcw class="w-4 h-4" />
          Limpar
        </button>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
      <span>{{ erro }}</span>
      <button @click="erro = ''" class="underline text-sm">Fechar</button>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Gerando relatório...</p>
    </div>

    <!-- Resultado: Cards resumo -->
    <div v-if="!carregando && dados.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-[#3b82f6]/20 flex items-center justify-center">
            <Film class="w-5 h-5 text-[#3b82f6]" />
          </div>
          <span class="text-sm text-[#A8AAAD]">Total de Filmes</span>
        </div>
        <p class="text-3xl font-bold">{{ dados.length }}</p>
      </div>

      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-[#2FA36A]/20 flex items-center justify-center">
            <Ticket class="w-5 h-5 text-[#2FA36A]" />
          </div>
          <span class="text-sm text-[#A8AAAD]">Total de Ingressos</span>
        </div>
        <p class="text-3xl font-bold">{{ totalIngressos.toLocaleString('pt-BR') }}</p>
      </div>

      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-[#f59e0b]" />
          </div>
          <span class="text-sm text-[#A8AAAD]">Receita Total</span>
        </div>
        <p class="text-3xl font-bold">R$ {{ receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
      </div>
    </div>

    <!-- Gráficos -->
    <div v-if="!carregando && dados.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

      <!-- Gráfico: Taxa de Ocupação -->
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6">
        <h4 class="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-[#2FA36A]" />
          Taxa de Ocupação (%)
        </h4>
        <div class="h-64">
          <Bar :data="ocupacaoChartData" :options="barOptions" />
        </div>
      </div>

      <!-- Gráfico: Clientes Únicos -->
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6">
        <h4 class="font-semibold mb-4 flex items-center gap-2">
          <Users class="w-4 h-4 text-[#3b82f6]" />
          Clientes Únicos
        </h4>
        <div class="h-64">
          <Bar :data="clientesChartData" :options="barOptions" />
        </div>
      </div>

      <!-- Gráfico: Tipo de Ingresso Mais Vendido -->
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 lg:col-span-2">
        <h4 class="font-semibold mb-4 flex items-center gap-2">
          <Ticket class="w-4 h-4 text-[#f59e0b]" />
          Tipo de Ingresso Mais Vendido por Filme
        </h4>
        <div class="h-64 max-w-md mx-auto">
          <Doughnut :data="tipoTopChartData" :options="doughnutOptions" />
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div v-if="!carregando && dados.length > 0" class="bg-[#131516] border border-[#252829] rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-[#252829]">
              <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">#</th>
              <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Filme</th>
              <th class="text-right text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Ingressos</th>
              <th class="text-right text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Receita</th>
              <th class="text-right text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Sessões</th>
              <th class="text-right text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Ocupação (%)</th>
              <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Tipo Mais Vendido</th>
              <th class="text-right text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-4 px-6">Clientes Únicos</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in dados"
              :key="item.nomeFilme"
              class="border-b border-[#252829]/50 hover:bg-[#1A1C1E] transition"
            >
              <td class="py-4 px-6 text-[#A8AAAD] text-sm">{{ index + 1 }}</td>
              <td class="py-4 px-6">
                <span class="font-semibold">{{ item.nomeFilme }}</span>
              </td>
              <td class="py-4 px-6 text-right">
                <span class="bg-[#2FA36A]/15 text-[#2FA36A] px-3 py-1 rounded-full text-sm font-semibold">
                  {{ item.totalIngressos.toLocaleString('pt-BR') }}
                </span>
              </td>
              <td class="py-4 px-6 text-right font-semibold text-[#f59e0b]">
                R$ {{ item.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </td>
              <td class="py-4 px-6 text-right text-[#A8AAAD]">
                {{ item.totalSessoes }}
              </td>
              <td class="py-4 px-6 text-right">
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="(item.taxaOcupacao ?? 0) >= 70
                    ? 'bg-[#2FA36A]/15 text-[#2FA36A]'
                    : (item.taxaOcupacao ?? 0) >= 40
                      ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                      : 'bg-[#EF4444]/15 text-[#EF4444]'"
                >
                  {{ (item.taxaOcupacao ?? 0).toFixed(1) }}%
                </span>
              </td>
              <td class="py-4 px-6 text-left">
                <span class="bg-[#3b82f6]/15 text-[#3b82f6] px-3 py-1 rounded-full text-sm font-semibold">
                  {{ item.tipoIngressoMaisVendido || '—' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right text-[#A8AAAD] font-semibold">
                {{ (item.totalClientesUnicos ?? 0).toLocaleString('pt-BR') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vazio -->
    <div v-if="!carregando && jaBuscou && dados.length === 0" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-[#1A1C1E] flex items-center justify-center mx-auto mb-4">
        <BarChart3 class="w-10 h-10 text-[#A8AAAD]" />
      </div>
      <h3 class="text-xl font-bold mb-2">Nenhum dado encontrado</h3>
      <p class="text-[#A8AAAD]">Tente ajustar os filtros ou realizar uma busca sem filtros.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Filter, BarChart3, FileDown, RotateCcw, Film, Ticket, DollarSign, Users } from 'lucide-vue-next'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import relatorioService, { type RelatorioFilme, type RelatorioFiltros } from '../services/relatorioService'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const filtros = ref<RelatorioFiltros>({
  dataInicio: '',
  dataFim: '',
  genero: '',
  ordenacao: '',
})

const dados = ref<RelatorioFilme[]>([])
const carregando = ref(false)
const exportando = ref(false)
const erro = ref('')
const jaBuscou = ref(false)

const totalIngressos = computed(() => dados.value.reduce((acc, d) => acc + d.totalIngressos, 0))
const receitaTotal = computed(() => dados.value.reduce((acc, d) => acc + d.receitaTotal, 0))

// ---- Chart Data ----
const chartLabels = computed(() => dados.value.map(i => i.nomeFilme))

const ocupacaoChartData = computed(() => ({
  labels: chartLabels.value,
  datasets: [{
    label: 'Taxa de Ocupação (%)',
    data: dados.value.map(i => i.taxaOcupacao ?? 0),
    backgroundColor: '#2FA36A',
    borderRadius: 6,
    maxBarThickness: 40,
  }],
}))

const clientesChartData = computed(() => ({
  labels: chartLabels.value,
  datasets: [{
    label: 'Clientes Únicos',
    data: dados.value.map(i => i.totalClientesUnicos ?? 0),
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    maxBarThickness: 40,
  }],
}))

const tipoTopChartData = computed(() => {
  const agg = dados.value.reduce((acc, i) => {
    const k = i.tipoIngressoMaisVendido || 'N/A'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const cores = ['#2FA36A', '#3b82f6', '#f59e0b', '#EF4444', '#8b5cf6', '#ec4899']
  return {
    labels: Object.keys(agg),
    datasets: [{
      data: Object.values(agg),
      backgroundColor: Object.keys(agg).map((_, i) => cores[i % cores.length]),
      borderWidth: 0,
    }],
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#131516',
      borderColor: '#252829',
      borderWidth: 1,
      titleColor: '#F2F2F2',
      bodyColor: '#A8AAAD',
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    x: {
      ticks: { color: '#A8AAAD', font: { size: 11 } },
      grid: { display: false },
      border: { color: '#252829' },
    },
    y: {
      ticks: { color: '#A8AAAD', font: { size: 11 } },
      grid: { color: '#252829' },
      border: { display: false },
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: '#A8AAAD', padding: 16, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#131516',
      borderColor: '#252829',
      borderWidth: 1,
      titleColor: '#F2F2F2',
      bodyColor: '#A8AAAD',
      cornerRadius: 8,
      padding: 12,
    },
  },
  cutout: '60%',
}

// ---- Actions ----
const filtrosLimpos = (): RelatorioFiltros => {
  const f: RelatorioFiltros = {}
  if (filtros.value.dataInicio) f.dataInicio = filtros.value.dataInicio
  if (filtros.value.dataFim) f.dataFim = filtros.value.dataFim
  if (filtros.value.genero?.trim()) f.genero = filtros.value.genero.trim()
  if (filtros.value.ordenacao) f.ordenacao = filtros.value.ordenacao
  return f
}

const gerarRelatorio = async () => {
  carregando.value = true
  erro.value = ''
  try {
    dados.value = await relatorioService.buscar(filtrosLimpos())
    jaBuscou.value = true
  } catch (e: any) {
    erro.value = e.response?.data?.message || e.response?.data || 'Erro ao gerar relatório'
    dados.value = []
  } finally {
    carregando.value = false
  }
}

const exportarPdf = async () => {
  exportando.value = true
  erro.value = ''
  try {
    await relatorioService.exportarPdf(filtrosLimpos())
  } catch (e: any) {
    erro.value = e.response?.data?.message || e.response?.data || 'Erro ao exportar PDF'
  } finally {
    exportando.value = false
  }
}

const limparFiltros = () => {
  filtros.value = { dataInicio: '', dataFim: '', genero: '', ordenacao: '' }
  dados.value = []
  jaBuscou.value = false
  erro.value = ''
}
</script>
