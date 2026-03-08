<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold mb-1" style="font-family: 'Poppins', sans-serif;">
          Todos os Filmes
        </h2>
        <p class="text-[#A8AAAD] text-sm">Escolha seu próximo filme</p>
      </div>

      <!-- Admin: criar filme -->
      <button
        v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
        @click="abrirModalFilme()"
        class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
      >
        <Plus class="w-4 h-4" />
        Novo Filme
      </button>
    </div>

    <!-- Pesquisa -->
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

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 mb-6">
      <!-- Gênero -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-[#A8AAAD]">Gênero</label>
        <select
          v-model="filtroGenero"
          class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] min-w-[180px]"
        >
          <option value="">Todos os gêneros</option>
          <option v-for="g in generosDisponiveis" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <!-- Classificação -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-[#A8AAAD]">Classificação</label>
        <select
          v-model="filtroClassificacao"
          class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] min-w-[140px]"
        >
          <option value="">Todos</option>
          <option v-for="c in classificacoes" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Ordenar -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-[#A8AAAD]">Ordenar por</label>
        <select
          v-model="ordenacao"
          class="bg-[#131516] border border-[#252829] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2FA36A] min-w-[140px]"
        >
          <option value="nome-asc">Nome ↑</option>
          <option value="nome-desc">Nome ↓</option>
          <option value="preco-asc">Preço ↑</option>
          <option value="preco-desc">Preço ↓</option>
          <option value="duracao-asc">Duração ↑</option>
          <option value="duracao-desc">Duração ↓</option>
        </select>
      </div>
    </div>

    <!-- Contagem -->
    <p class="text-[#A8AAAD] text-sm mb-6">{{ filmesFiltrados.length }} filmes encontrados</p>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Carregando filmes...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6">
      {{ erro }}
      <button @click="limparErro" class="ml-4 underline">Fechar</button>
    </div>

    <!-- Grid de Filmes -->
    <div v-if="!loading && filmesFiltrados.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
        v-for="filme in filmesFiltrados"
        :key="filme.id"
        @click="abrirDetalhes(filme)"
        class="group cursor-pointer"
      >
        <!-- Card poster -->
        <div class="relative rounded-xl overflow-hidden aspect-[2/3] mb-3">
          <img
            v-if="filme.imagemUrl"
            :src="`/filmes/${filme.imagemUrl}`"
            :alt="filme.nome"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0" :style="{ background: getGradient(filme.genero) }"></div>

          <!-- Film icon overlay (só sem imagem) -->
          <div v-if="!filme.imagemUrl" class="absolute inset-0 flex items-center justify-center opacity-20">
            <Film class="w-16 h-16 text-white" />
          </div>

          <!-- Classification badge -->
          <div
            class="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            :style="{ backgroundColor: getClassificacaoColor(filme.classificacao) }"
          >
            {{ filme.classificacao || 'L' }}
          </div>

          <!-- Duration badge -->
          <div v-if="filme.duracao" class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Clock class="w-3 h-3" />
            {{ filme.duracao }}min
          </div>

          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span class="bg-[#2FA36A] px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              Ver Sessões
            </span>
          </div>

          <!-- Admin actions -->
          <div v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'" class="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              @click.stop="abrirModalFilme(filme)"
              class="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition"
              title="Editar"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button
              @click.stop="confirmarExclusaoFilme(filme)"
              class="p-2 bg-[#EF4444]/60 backdrop-blur-sm rounded-lg hover:bg-[#EF4444]/80 transition"
              title="Excluir"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <h3 class="font-semibold text-sm truncate group-hover:text-[#2FA36A] transition">{{ filme.nome }}</h3>
        <p class="text-xs text-[#A8AAAD] mt-1">
          <span v-if="filme.duracao">{{ filme.duracao }} min</span>
          <span v-if="filme.duracao && filme.genero"> · </span>
          <span v-if="filme.genero">{{ filme.genero }}</span>
        </p>
        <p class="text-[#2FA36A] font-bold text-sm mt-1">
          R$ {{ (filme.valorFilme ?? 0).toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Vazio -->
    <div v-if="!loading && filmes.length > 0 && filmesFiltrados.length === 0" class="text-center py-20">
      <Film class="w-16 h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Nenhum filme encontrado para este filtro.</p>
    </div>

    <div v-if="!loading && filmes.length === 0 && !erro" class="text-center py-20">
      <Film class="w-16 h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Nenhum filme cadastrado.</p>
    </div>

    <!-- ==================== MODAL DETALHES / SESSÕES ==================== -->
    <div
      v-if="filmeDetalhes"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="fecharDetalhes"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Header gradient -->
        <div class="relative h-48 overflow-hidden rounded-t-2xl">
          <img
            v-if="filmeDetalhes.imagemUrl"
            :src="`/filmes/${filmeDetalhes.imagemUrl}`"
            :alt="filmeDetalhes.nome"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0" :style="{ background: getGradient(filmeDetalhes.genero) }"></div>
          <div v-if="!filmeDetalhes.imagemUrl" class="absolute inset-0 flex items-center justify-center opacity-20">
            <Film class="w-24 h-24 text-white" />
          </div>
          <button
            @click="fecharDetalhes"
            class="absolute top-4 right-4 bg-black/50 p-2 rounded-lg hover:bg-black/70 transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6">
          <!-- Botão Voltar -->
          <button
            @click="fecharDetalhes"
            class="flex items-center gap-2 text-[#A8AAAD] hover:text-white transition mb-4 group"
          >
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span class="text-sm">Voltar</span>
          </button>

          <!-- Film info -->
          <div class="flex items-start gap-4 mb-6">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              :style="{ backgroundColor: getClassificacaoColor(filmeDetalhes.classificacao) }"
            >
              {{ filmeDetalhes.classificacao || 'L' }}
            </div>
            <div>
              <h3 class="text-2xl font-bold" style="font-family: 'Poppins', sans-serif;">{{ filmeDetalhes.nome }}</h3>
              <p class="text-[#A8AAAD] text-sm mt-1">
                <span v-if="filmeDetalhes.genero">{{ filmeDetalhes.genero }}</span>
                <span v-if="filmeDetalhes.duracao"> · {{ filmeDetalhes.duracao }}min</span>
                <span v-if="filmeDetalhes.diretor"> · {{ filmeDetalhes.diretor }}</span>
              </p>
            </div>
          </div>

          <p v-if="filmeDetalhes.descricao" class="text-[#A8AAAD] text-sm mb-6">{{ filmeDetalhes.descricao }}</p>

          <div class="flex flex-wrap gap-4 text-sm text-[#A8AAAD] mb-6">
            <span v-if="filmeDetalhes.elenco"><strong class="text-white">Elenco:</strong> {{ filmeDetalhes.elenco }}</span>
            <span v-if="filmeDetalhes.distribuidor"><strong class="text-white">Distribuidora:</strong> {{ filmeDetalhes.distribuidor }}</span>
            <span v-if="filmeDetalhes.dataLancamento"><strong class="text-white">Lançamento:</strong> {{ formatarDataLonga(filmeDetalhes.dataLancamento) }}</span>
          </div>

          <p class="text-[#2FA36A] text-xl font-bold mb-6">R$ {{ (filmeDetalhes.valorFilme ?? 0).toFixed(2) }}</p>

          <!-- Sessions -->
          <h4 class="text-lg font-semibold mb-4" style="font-family: 'Poppins', sans-serif;">Sessões Disponíveis</h4>

          <div v-if="carregandoSessoes" class="text-center py-6">
            <div class="inline-block w-6 h-6 border-3 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
            <p class="text-[#A8AAAD] mt-2 text-sm">Carregando sessões...</p>
          </div>

          <div v-else-if="sessoesFilme.length === 0" class="text-center py-6">
            <p class="text-[#A8AAAD]">Nenhuma sessão disponível para este filme.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <router-link
              v-for="sessao in sessoesFilme"
              :key="sessao.id"
              :to="`/ingressos/${sessao.id}`"
              class="bg-[#0D0F10] border border-[#252829] rounded-xl p-4 hover:border-[#2FA36A] transition flex items-center justify-between group"
              @click="fecharDetalhes"
            >
              <div>
                <p class="font-semibold">{{ formatarData(sessao.data) }}</p>
                <p class="text-sm text-[#A8AAAD]">{{ sessao.horarioFilme }} · {{ sessao.sala?.nome || 'Sala' }}</p>
              </div>
              <ChevronRight class="w-5 h-5 text-[#2FA36A] group-hover:translate-x-1 transition-transform" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL CRIAR/EDITAR FILME (Admin) ==================== -->
    <div
      v-if="modalFilme"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="fecharModalFilme"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-6" style="font-family: 'Poppins', sans-serif;">
          {{ editandoFilme ? 'Editar Filme' : 'Novo Filme' }}
        </h3>

        <form @submit.prevent="salvarFilme" class="flex flex-col gap-4">
          <input v-model="formFilme.nome" type="text" placeholder="Nome do Filme" required
            class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />

          <textarea v-model="formFilme.descricao" placeholder="Descrição" rows="3"
            class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A] resize-none"></textarea>

          <!-- Gêneros (checkboxes) -->
          <div>
            <label class="text-xs text-[#A8AAAD] mb-2 block">Gêneros</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="g in GENEROS"
                :key="g"
                class="flex items-center gap-2 bg-[#0D0F10] border rounded-lg px-3 py-2 cursor-pointer transition select-none"
                :class="generosSelecionados.includes(g) ? 'border-[#2FA36A] text-white' : 'border-[#252829] text-[#A8AAAD] hover:border-[#3a3d40]'"
              >
                <input
                  type="checkbox"
                  :value="g"
                  v-model="generosSelecionados"
                  class="accent-[#2FA36A] w-4 h-4"
                />
                <span class="text-sm">{{ g }}</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <input v-model="formFilme.classificacao" type="text" placeholder="Classificação"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <input v-model="formFilme.diretor" type="text" placeholder="Diretor"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
            <input v-model="formFilme.elenco" type="text" placeholder="Elenco"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <input v-model.number="formFilme.duracao" type="number" placeholder="Duração (min)" min="1"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
            <input v-model.number="formFilme.valorFilme" type="number" step="0.01" placeholder="Valor (R$)" min="0"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <input v-model="formFilme.distribuidor" type="text" placeholder="Distribuidor"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />
            <div>
              <label class="text-xs text-[#A8AAAD] mb-1 block">Data de Lançamento</label>
              <input v-model="formFilme.dataLancamento" type="date"
                class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#2FA36A]" />
            </div>
          </div>

          <div>
            <label class="text-xs text-[#A8AAAD] mb-2 block">Poster do Filme</label>

            <!-- Imagem selecionada -->
            <div v-if="formFilme.imagemUrl" class="mb-3 relative inline-block">
              <img
                :src="`/filmes/${formFilme.imagemUrl}`"
                class="w-24 h-36 object-cover rounded-xl border-2 border-[#2FA36A]"
                @error="($event.target as HTMLImageElement).src=''"
              />
              <button
                type="button"
                @click="formFilme.imagemUrl = ''"
                class="absolute -top-2 -right-2 bg-[#EF4444] w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>

            <!-- Grid de imagens disponíveis -->
            <div v-if="imagensDisponiveis.length > 0">
              <p class="text-xs text-[#A8AAAD] mb-2">Selecione uma imagem de <code class="text-[#2FA36A]">public/filmes/</code>:</p>
              <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                <button
                  v-for="img in imagensDisponiveis"
                  :key="img"
                  type="button"
                  @click="formFilme.imagemUrl = img"
                  class="relative rounded-lg overflow-hidden aspect-[2/3] border-2 transition hover:scale-105"
                  :class="formFilme.imagemUrl === img ? 'border-[#2FA36A] ring-1 ring-[#2FA36A]' : 'border-[#252829] hover:border-[#A8AAAD]'"
                >
                  <img :src="`/filmes/${img}`" :alt="img" class="w-full h-full object-cover" />
                  <div v-if="formFilme.imagemUrl === img" class="absolute inset-0 bg-[#2FA36A]/20 flex items-center justify-center">
                    <Check class="w-6 h-6 text-[#2FA36A]" />
                  </div>
                </button>
              </div>
            </div>

            <div v-else class="text-xs text-[#A8AAAD] bg-[#0D0F10] border border-[#252829] rounded-lg p-3">
              Nenhuma imagem encontrada em <code class="text-[#2FA36A]">public/filmes/</code>.
              Coloque arquivos .jpg, .png ou .webp nessa pasta.
            </div>

            <!-- Input manual como fallback -->
            <input v-model="formFilme.imagemUrl" type="text" placeholder="Ou digite o nome do arquivo (ex: batman.jpg)"
              class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-2 w-full focus:outline-none focus:border-[#2FA36A] text-sm mt-3" />
          </div>

          <div class="flex gap-4 mt-4">
            <button type="submit" :disabled="salvandoFilme"
              class="flex-1 bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition disabled:opacity-50">
              {{ salvandoFilme ? 'Salvando...' : 'Salvar' }}
            </button>
            <button type="button" @click="fecharModalFilme"
              class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL EXCLUIR FILME ==================== -->
    <div
      v-if="modalExcluirFilme"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="cancelarExclusaoFilme"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-md text-center">
        <Trash2 class="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">Excluir Filme</h3>
        <p class="text-[#A8AAAD] mb-6">
          Tem certeza que deseja excluir <strong class="text-white">{{ filmeParaExcluir?.nome }}</strong>?
        </p>
        <div class="flex gap-4">
          <button @click="executarExclusaoFilme" :disabled="salvandoFilme"
            class="flex-1 bg-[#EF4444] py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50">
            {{ salvandoFilme ? 'Excluindo...' : 'Excluir' }}
          </button>
          <button @click="cancelarExclusaoFilme"
            class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Film, Clock, Plus, Pencil, Trash2, X, ChevronRight, ArrowLeft, Check, Search } from 'lucide-vue-next'
import { useFilme } from '../composables/useFilme'
import { useUsuario } from '../composables/useUsuario'
import sessaoService from '../services/sessaoService'
import type { Filme } from '../types/Filme'
import type { Sessao } from '../types/Sessao'
import { apiDateToBr, apiDateToLongBr } from '../utils/date-utils'
import { GENEROS } from '../constants/generos'

const { filmes, loading, erro, listarFilmes, criarFilme, atualizarFilme, excluirFilme, limparErro } = useFilme()
const { usuario } = useUsuario()

// Imagens disponíveis em public/filmes/
const imagensDisponiveis = computed(() => {
  const arquivos = import.meta.glob('/public/filmes/*.{jpg,jpeg,png,webp,gif}', { eager: true })
  return Object.keys(arquivos).map(path => path.split('/').pop() || '').filter(Boolean)
})

// Filtros
const pesquisa = ref('')
const filtroGenero = ref('')
const filtroClassificacao = ref('')
const ordenacao = ref('nome-asc')

const classificacoes = ['L', '10', '12', '14', '16', '18']

const generosDisponiveis = computed(() => {
  const generos = new Set<string>()
  filmes.value.forEach(f => {
    if (f.genero) {
      f.genero.split(',').map(g => g.trim()).filter(Boolean).forEach(g => generos.add(g))
    }
  })
  return Array.from(generos).sort()
})

const filmesFiltrados = computed(() => {
  let resultado = [...filmes.value]

  if (pesquisa.value) {
    const termo = pesquisa.value.toLowerCase()
    resultado = resultado.filter(f => f.nome?.toLowerCase().includes(termo))
  }
  if (filtroGenero.value) {
    resultado = resultado.filter(f =>
      f.genero?.split(',').map(g => g.trim()).includes(filtroGenero.value)
    )
  }
  if (filtroClassificacao.value) {
    resultado = resultado.filter(f => f.classificacao === filtroClassificacao.value)
  }

  const [campo, direcao] = ordenacao.value.split('-')
  resultado.sort((a, b) => {
    let valA: any, valB: any
    if (campo === 'nome') { valA = a.nome?.toLowerCase() || ''; valB = b.nome?.toLowerCase() || '' }
    else if (campo === 'preco') { valA = a.valorFilme ?? 0; valB = b.valorFilme ?? 0 }
    else if (campo === 'duracao') { valA = a.duracao ?? 0; valB = b.duracao ?? 0 }
    else { valA = a.nome?.toLowerCase() || ''; valB = b.nome?.toLowerCase() || '' }

    if (valA < valB) return direcao === 'asc' ? -1 : 1
    if (valA > valB) return direcao === 'asc' ? 1 : -1
    return 0
  })

  return resultado
})

// Detalhes / Sessões
const filmeDetalhes = ref<Filme | null>(null)
const sessoesFilme = ref<Sessao[]>([])
const carregandoSessoes = ref(false)

const abrirDetalhes = async (filme: Filme) => {
  filmeDetalhes.value = filme
  sessoesFilme.value = []
  if (filme.id) {
    carregandoSessoes.value = true
    try {
      sessoesFilme.value = await sessaoService.buscarPorFilme(filme.id)
    } catch (e) {
      console.error('Erro ao buscar sessões:', e)
    } finally {
      carregandoSessoes.value = false
    }
  }
}

const fecharDetalhes = () => {
  filmeDetalhes.value = null
  sessoesFilme.value = []
}

// Modal Criar/Editar
const modalFilme = ref(false)
const editandoFilme = ref(false)
const salvandoFilme = ref(false)
const filmeEditandoId = ref<string | null>(null)
const formFilme = ref<Partial<Filme>>({})
const generosSelecionados = ref<string[]>([])

const abrirModalFilme = (filme?: Filme) => {
  if (filme) {
    editandoFilme.value = true
    filmeEditandoId.value = filme.id || null
    formFilme.value = { ...filme }
    generosSelecionados.value = filme.genero
      ? filme.genero.split(',').map(g => g.trim()).filter(Boolean)
      : []
  } else {
    editandoFilme.value = false
    filmeEditandoId.value = null
    formFilme.value = {}
    generosSelecionados.value = []
  }
  modalFilme.value = true
}

const fecharModalFilme = () => {
  modalFilme.value = false
  editandoFilme.value = false
  filmeEditandoId.value = null
  formFilme.value = {}
}

const salvarFilme = async () => {
  salvandoFilme.value = true
  formFilme.value.genero = generosSelecionados.value.join(',')
  try {
    if (editandoFilme.value && filmeEditandoId.value) {
      await atualizarFilme(filmeEditandoId.value, formFilme.value)
    } else {
      await criarFilme(formFilme.value as Filme)
    }
    fecharModalFilme()
  } catch (e) {
    // erro tratado no composable
  } finally {
    salvandoFilme.value = false
  }
}

// Excluir filme
const modalExcluirFilme = ref(false)
const filmeParaExcluir = ref<Filme | null>(null)

const confirmarExclusaoFilme = (filme: Filme) => {
  filmeParaExcluir.value = filme
  modalExcluirFilme.value = true
}

const cancelarExclusaoFilme = () => {
  filmeParaExcluir.value = null
  modalExcluirFilme.value = false
}

const executarExclusaoFilme = async () => {
  if (!filmeParaExcluir.value?.id) return
  salvandoFilme.value = true
  try {
    await excluirFilme(filmeParaExcluir.value.id)
    cancelarExclusaoFilme()
  } catch (e) {
    // erro tratado
  } finally {
    salvandoFilme.value = false
  }
}

// Helpers
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
    'Outro': 'linear-gradient(135deg, #1a1a2e, #16213e)',
  }
  return gradients[genero || ''] || 'linear-gradient(135deg, #1a1a2e, #16213e)'
}

const getClassificacaoColor = (classificacao?: string): string => {
  const cores: Record<string, string> = {
    'L': '#16a34a',
    '10': '#3b82f6',
    '12': '#f59e0b',
    '14': '#f97316',
    '16': '#ef4444',
    '18': '#7c3aed',
  }
  return cores[classificacao || ''] || '#6b7280'
}

const formatarData = (data?: string | number) => apiDateToBr(data)
const formatarDataLonga = (data?: string | number) => apiDateToLongBr(data)

onMounted(() => {
  listarFilmes()
})
</script>
