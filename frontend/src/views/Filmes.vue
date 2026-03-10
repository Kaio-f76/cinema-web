<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold mb-1" style="font-family: 'Poppins', sans-serif;">
          Todos os Filmes
        </h2>
        <p class="text-[#A8AAAD] text-sm">Escolha seu próximo filme</p>
      </div>

      <button
        v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
        @click="abrirModalFilme()"
        class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
      >
        <Plus class="w-4 h-4" />
        Novo Filme
      </button>
    </div>

    <div class="mb-6">
      <div class="relative max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8AAAD]" />
        <input
          v-model="pesquisa"
          type="text"
          placeholder="Buscar filme..."
          class="w-full bg-[#131516] border border-[#252829] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] placeholder-[#A8AAAD]/50"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-[#A8AAAD]">Gênero</label>
        <select v-model="filtroGenero" class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] min-w-[180px]">
          <option value="">Todos os gêneros</option>
          <option v-for="g in generosDisponiveis" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs text-[#A8AAAD]">Classificação</label>
        <select v-model="filtroClassificacao" class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] min-w-[140px]">
          <option value="">Todos</option>
          <option v-for="c in classificacoes" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs text-[#A8AAAD]">Ordenar por</label>
        <select v-model="ordenacao" class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] min-w-[140px]">
          <option value="nome-asc">Nome ↑</option>
          <option value="nome-desc">Nome ↓</option>
          <option value="preco-asc">Preço ↑</option>
          <option value="preco-desc">Preço ↓</option>
          <option value="duracao-asc">Duração ↑</option>
          <option value="duracao-desc">Duração ↓</option>
        </select>
      </div>
    </div>

    <p class="text-[#A8AAAD] text-sm mb-6">{{ filmesFiltrados.length }} filmes encontrados</p>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Carregando filmes...</p>
    </div>

    <div v-if="!loading && filmesFiltrados.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="filme in filmesFiltrados" :key="filme.id" @click="abrirDetalhes(filme)" class="group cursor-pointer">
        <div class="relative rounded-xl overflow-hidden aspect-[2/3] mb-3">
          <img
            v-if="filme.imagemUrl"
            :src="filme.imagemUrl"
            :alt="filme.nome"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0" :style="{ background: getGradient(filme.genero) }"></div>

          <div v-if="!filme.imagemUrl" class="absolute inset-0 flex items-center justify-center opacity-20">
            <Film class="w-16 h-16 text-white" />
          </div>

          <div class="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" :style="{ backgroundColor: getClassificacaoColor(filme.classificacao) }">
            {{ filme.classificacao || 'L' }}
          </div>

          <div v-if="filme.duracao" class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Clock class="w-3 h-3" />
            {{ filme.duracao }}min
          </div>

          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span class="bg-[#2FA36A] px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              Ver Sessões
            </span>
          </div>

          <div v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'" class="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button @click.stop="abrirModalFilme(filme)" class="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition"><Pencil class="w-3.5 h-3.5" /></button>
            <button @click.stop="confirmarExclusaoFilme(filme)" class="p-2 bg-[#EF4444]/60 backdrop-blur-sm rounded-lg hover:bg-[#EF4444]/80 transition"><Trash2 class="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <h3 class="font-semibold text-sm truncate group-hover:text-[#2FA36A] transition">{{ filme.nome }}</h3>
        <p class="text-xs text-[#A8AAAD] mt-1">
          <span v-if="filme.duracao">{{ filme.duracao }} min</span>
          <span v-if="filme.duracao && filme.genero"> · </span>
          <span v-if="filme.genero">{{ filme.genero }}</span>
        </p>
        <p class="text-[#2FA36A] font-bold text-sm mt-1">R$ {{ (filme.valorFilme ?? 0).toFixed(2) }}</p>
      </div>
    </div>

    <div v-if="filmeDetalhes" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="fecharDetalhes">
      <div class="bg-[#131516] border border-[#252829] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="relative h-48 overflow-hidden rounded-t-2xl">
          <img v-if="filmeDetalhes.imagemUrl" :src="filmeDetalhes.imagemUrl" class="absolute inset-0 w-full h-full object-cover" />
          <div v-else class="absolute inset-0" :style="{ background: getGradient(filmeDetalhes.genero) }"></div>
          <button @click="fecharDetalhes" class="absolute top-4 right-4 bg-black/50 p-2 rounded-lg hover:bg-black/70 transition"><X class="w-5 h-5" /></button>
        </div>

        <div class="p-6">
          <button @click="fecharDetalhes" class="flex items-center gap-2 text-[#A8AAAD] hover:text-white mb-4 group text-sm">
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar
          </button>
          <div class="flex items-start gap-4 mb-6">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" :style="{ backgroundColor: getClassificacaoColor(filmeDetalhes.classificacao) }">
              {{ filmeDetalhes.classificacao || 'L' }}
            </div>
            <div>
              <h3 class="text-2xl font-bold">{{ filmeDetalhes.nome }}</h3>
              <p class="text-[#A8AAAD] text-sm">{{ filmeDetalhes.genero }} · {{ filmeDetalhes.duracao }}min</p>
            </div>
          </div>
          <p class="text-[#A8AAAD] text-sm mb-6">{{ filmeDetalhes.descricao }}</p>
          
          <h4 class="text-lg font-semibold mb-4">Sessões Disponíveis</h4>
          <div v-if="sessoesFilme.length === 0" class="text-center py-6 text-[#A8AAAD]">Nenhuma sessão disponível.</div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <router-link v-for="sessao in sessoesFilme" :key="sessao.id" :to="`/ingressos/${sessao.id}`" class="bg-[#0D0F10] border border-[#252829] rounded-xl p-4 hover:border-[#2FA36A] flex items-center justify-between group">
              <div>
                <p class="font-semibold">{{ formatarData(sessao.data) }}</p>
                <p class="text-sm text-[#A8AAAD]">{{ sessao.horarioFilme }} · {{ sessao.sala?.nome }}</p>
              </div>
              <ChevronRight class="w-5 h-5 text-[#2FA36A] group-hover:translate-x-1 transition-transform" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalFilme" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="fecharModalFilme">
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-6">{{ editandoFilme ? 'Editar Filme' : 'Novo Filme' }}</h3>

        <form @submit.prevent="handleSalvarFilme" class="flex flex-col gap-4">
          <input v-model="formFilme.nome" type="text" placeholder="Nome do Filme" required class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />

          <textarea v-model="formFilme.descricao" placeholder="Descrição" rows="3" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A] resize-none"></textarea>

          <div>
            <label class="text-xs text-[#A8AAAD] mb-2 block">Gêneros</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label v-for="g in GENEROS" :key="g" class="flex items-center gap-2 bg-[#0D0F10] border rounded-lg px-3 py-2 cursor-pointer transition select-none" :class="generosSelecionados.includes(g) ? 'border-[#2FA36A] text-white' : 'border-[#252829] text-[#A8AAAD]'">
                <input type="checkbox" :value="g" v-model="generosSelecionados" class="accent-[#2FA36A] w-4 h-4" />
                <span class="text-sm">{{ g }}</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <select v-model="formFilme.classificacao" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A] text-white">
                <option value="" disabled selected>Selecionar Classificação</option>
                <option v-for="c in classificacoes" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <input v-model.number="formFilme.valorFilme" type="number" step="0.01" placeholder="Valor (R$)" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <input v-model.number="formFilme.duracao" type="number" placeholder="Duração (min)" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
            <input v-model="formFilme.diretor" type="text" placeholder="Diretor" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
          </div>

          <input v-model="formFilme.elenco" type="text" placeholder="Elenco (ex: Ator 1, Ator 2)" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />

          <div class="grid grid-cols-2 gap-4">
            <input v-model="formFilme.distribuidor" type="text" placeholder="Distribuidor" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
            <div class="flex flex-col gap-1">
              <label class="text-xs text-[#A8AAAD]">Data de Lançamento</label>
              <input v-model="formFilme.dataLancamento" type="date" class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
            </div>
          </div>

          <div class="mt-2">
            <label class="text-xs text-[#A8AAAD] mb-2 block">Capa do Filme (Upload)</label>
            <div class="flex items-center gap-4 bg-[#0D0F10] border border-[#252829] rounded-lg p-4">
              <div class="w-20 h-28 bg-[#131516] rounded-lg overflow-hidden border border-[#252829] flex-shrink-0">
                <img v-if="previewImagem || formFilme.imagemUrl" :src="previewImagem || formFilme.imagemUrl" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center"><Film class="w-8 h-8 text-[#252829]" /></div>
              </div>
              <div class="flex-1">
                <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden" />
                <button type="button" @click="$refs.fileInput.click()" class="bg-[#252829] hover:bg-[#323536] text-white text-xs px-4 py-2 rounded-lg border border-[#3a3d40]">
                  {{ selectedFile ? 'Trocar Imagem' : 'Selecionar Arquivo' }}
                </button>
                <p v-if="selectedFile" class="text-[10px] text-[#2FA36A] mt-2 truncate max-w-[150px]">✓ {{ selectedFile.name }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 mt-4">
            <button type="submit" :disabled="salvandoFilme" class="flex-1 bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] disabled:opacity-50">
              {{ salvandoFilme ? 'Salvando...' : 'Salvar Filme' }}
            </button>
            <button type="button" @click="fecharModalFilme" class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="modalExcluirFilme" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
        <div class="w-12 h-12 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 class="w-6 h-6 text-[#EF4444]" />
        </div>
        <h3 class="text-lg font-bold mb-2">Excluir Filme</h3>
        <p class="text-[#A8AAAD] text-sm mb-6 leading-relaxed">
          Tem certeza que deseja excluir <strong class="text-white">{{ filmeParaExcluir?.nome }}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div class="flex gap-3">
          <button @click="executarExclusaoFilme" class="flex-1 bg-[#EF4444] py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition">Excluir</button>
          <button @click="cancelarExclusaoFilme" class="flex-1 bg-[#1A1C1E] border border-[#252829] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#252829] transition">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Film, Clock, Plus, Pencil, Trash2, X, ChevronRight, ArrowLeft, Search } from 'lucide-vue-next'
import { useFilme } from '../composables/useFilme'
import { useUsuario } from '../composables/useUsuario'
import sessaoService from '../services/sessaoService'
import type { Filme } from '../types/Filme'
import type { Sessao } from '../types/Sessao'
import { apiDateToBr, apiDateToLongBr } from '../utils/date-utils'
import { GENEROS } from '../constants/generos'

const { filmes, loading, listarFilmes, criarFilme, atualizarFilme, excluirFilme } = useFilme()
const { usuario } = useUsuario()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewImagem = ref<string | null>(null)

const pesquisa = ref('')
const filtroGenero = ref('')
const filtroClassificacao = ref('')
const ordenacao = ref('nome-asc')
const classificacoes = ['L', '10', '12', '14', '16', '18']

const generosDisponiveis = computed(() => {
  const generos = new Set<string>()
  filmes.value.forEach(f => {
    if (f.genero) f.genero.split(',').forEach(g => generos.add(g.trim()))
  })
  return Array.from(generos).sort()
})

const filmesFiltrados = computed(() => {
  let res = [...filmes.value]
  if (pesquisa.value) res = res.filter(f => f.nome?.toLowerCase().includes(pesquisa.value.toLowerCase()))
  if (filtroGenero.value) res = res.filter(f => f.genero?.includes(filtroGenero.value))
  if (filtroClassificacao.value) res = res.filter(f => f.classificacao === filtroClassificacao.value)
  
  const [campo, direcao] = ordenacao.value.split('-')
  res.sort((a, b) => {
    const valA = a[campo as keyof Filme] ?? '';
    const valB = b[campo as keyof Filme] ?? '';
    return direcao === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
  })
  return res
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    previewImagem.value = URL.createObjectURL(selectedFile.value)
  }
}

const modalFilme = ref(false)
const editandoFilme = ref(false)
const salvandoFilme = ref(false)
const filmeEditandoId = ref<string | null>(null)
const formFilme = ref<Partial<Filme>>({})
const generosSelecionados = ref<string[]>([])

const abrirModalFilme = (filme?: Filme) => {
  selectedFile.value = null
  previewImagem.value = null
  if (filme) {
    editandoFilme.value = true
    filmeEditandoId.value = filme.id || null
    formFilme.value = { ...filme }
    generosSelecionados.value = filme.genero ? filme.genero.split(',').map(g => g.trim()) : []
  } else {
    editandoFilme.value = false
    formFilme.value = { valorFilme: '', duracao: '', classificacao: '' }
    generosSelecionados.value = []
  }
  modalFilme.value = true
}

const fecharModalFilme = () => {
  modalFilme.value = false
  selectedFile.value = null
  previewImagem.value = null
}

const handleSalvarFilme = async () => {
  salvandoFilme.value = true
  formFilme.value.genero = generosSelecionados.value.join(',')
  
  try {
    if (editandoFilme.value && filmeEditandoId.value) {
      await atualizarFilme(filmeEditandoId.value, formFilme.value, selectedFile.value)
    } else {
      await criarFilme(formFilme.value as Filme, selectedFile.value)
    }
    fecharModalFilme()
    await listarFilmes() 
  } catch (e) {
    console.error("Erro ao salvar:", e)
  } finally {
    salvandoFilme.value = false
  }
}

const filmeDetalhes = ref<Filme | null>(null)
const sessoesFilme = ref<Sessao[]>([])
const abrirDetalhes = async (filme: Filme) => {
  filmeDetalhes.value = filme
  if (filme.id) sessoesFilme.value = await sessaoService.buscarPorFilme(filme.id)
}
const fecharDetalhes = () => { filmeDetalhes.value = null }

const modalExcluirFilme = ref(false)
const filmeParaExcluir = ref<Filme | null>(null)
const confirmarExclusaoFilme = (filme: Filme) => { filmeParaExcluir.value = filme; modalExcluirFilme.value = true }
const cancelarExclusaoFilme = () => { modalExcluirFilme.value = false }
const executarExclusaoFilme = async () => {
  if (filmeParaExcluir.value?.id) {
    await excluirFilme(filmeParaExcluir.value.id)
    cancelarExclusaoFilme()
  }
}

const getGradient = (g?: string) => 'linear-gradient(135deg, #1a1a2e, #16213e)'
const getClassificacaoColor = (c?: string) => ({ 'L': '#16a34a', '10': '#3b82f6', '12': '#f59e0b', '14': '#f97316', '16': '#ef4444', '18': '#7c3aed' }[c || 'L'])
const formatarData = (d?: any) => apiDateToBr(d)
const formatarDataLonga = (d?: any) => apiDateToLongBr(d)

onMounted(listarFilmes)
</script>