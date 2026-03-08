<template>
  <div>
    <!-- HERO SECTION -->
    <div class="relative w-full h-screen overflow-hidden select-none">

    <!-- FUNDO IMAGEM DO FILME -->
    <transition :name="transicao" mode="out-in">
      <div
        :key="filmeAtualIndex"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url('${filmeAtual.poster}')` }"
      ></div>
    </transition>

    <!-- SOBREPOSIÇÃO ESCURA -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- CONTEÚDO DO FILME -->
    <div
      v-if="filmes.length > 0"
      class="relative z-10 flex items-center justify-between h-full px-16"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd"
    >

      <!-- SETA ESQUERDA -->
      <button
        @click="anteriorFilme"
        class="text-5xl text-white hover:text-[#2FA36A] transition-transform transform active:scale-90"
      >
        &#10094;
      </button>

      <!-- CARD DO FILME -->
      <transition :name="transicao" mode="out-in">
        <div
          :key="filmeAtualIndex"
          class="flex flex-col justify-center gap-4 max-w-xl text-left text-white bg-black/30 p-6 rounded-2xl transform transition-transform duration-500"
        >
          <!-- EM DESTAQUE -->
          <div class="flex items-center gap-2 w-max bg-[#2FA36A]/30 border border-[#2FA36A] rounded-lg px-3 py-1 text-sm font-semibold text-[#2FA36A]">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.152c.969 0 1.371 1.24.588 1.81l-3.36 2.443a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.36-2.443a1 1 0 00-1.176 0l-3.36 2.443c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.073 9.382c-.783-.57-.38-1.81.588-1.81h4.152a1 1 0 00.95-.69l1.286-3.955z"
              />
            </svg>
            Em destaque
          </div>

          <!-- NOME DO FILME -->
          <h2 class="text-3xl font-bold uppercase">{{ filmeAtual.nome }}</h2>

          <!-- CLASSIFICAÇÃO E DURAÇÃO -->
          <div class="flex items-center gap-4 text-sm text-[#A8AAAD]">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-[#2FA36A]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.152c.969 0 1.371 1.24.588 1.81l-3.36 2.443a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.36-2.443a1 1 0 00-1.176 0l-3.36 2.443c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.073 9.382c-.783-.57-.38-1.81.588-1.81h4.152a1 1 0 00.95-.69l1.286-3.955z"
                />
              </svg>
              {{ filmeAtual.classificacao }}
            </div>
            <span>•</span>
            <div>{{ filmeAtual.duracao }}min</div>
          </div>

          <!-- RESUMO -->
          <p class="text-sm max-h-[4.5rem] overflow-hidden">
            {{ filmeAtual.descricao }}
          </p>

          <!-- GÊNEROS -->
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="genero in filmeAtual.generos"
              :key="genero"
              class="text-xs text-white border border-white rounded-lg px-2 py-1"
            >
              {{ genero }}
            </span>
          </div>

          <!-- BOTÕES -->
          <div class="flex gap-4 mt-4">
            <!-- Comprar Ingresso -->
            <router-link
              :to="usuario ? '/filmes' : '/login'"
              class="flex items-center gap-2 bg-[#2FA36A] border border-white text-white px-4 py-2 rounded-lg hover:bg-[#3BB77C] transition-transform transform active:scale-95"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4l12 8-12 8z"/>
              </svg>
              Comprar Ingresso
            </router-link>

            <!-- Saiba Mais -->
            <router-link
              :to="usuario ? `/filmes/${filmes[filmeAtualIndex]?.id}` : '/login'"
              class="bg-gray-600 border border-white text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-transform transform active:scale-95"
            >
              Saiba mais
            </router-link>
          </div>

        </div>
      </transition>

      <!-- SETA DIREITA -->
      <button
        @click="proximoFilme"
        class="text-5xl text-white hover:text-[#2FA36A] transition-transform transform active:scale-90"
      >
        &#10095;
      </button>

    </div>

    <!-- LOADING -->
    <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
      <div class="inline-block w-10 h-10 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- SEM FILMES -->
    <div v-if="!loading && filmes.length === 0" class="absolute inset-0 z-20 flex items-center justify-center">
      <p class="text-[#A8AAAD] text-lg">Nenhum filme cadastrado.</p>
    </div>

    <!-- BARRINHAS DE PROGRESSO -->
    <div v-if="filmes.length > 0" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
      <div
        v-for="(f, index) in filmes"
        :key="index"
        class="w-8 h-1 rounded-full border border-white transition-colors duration-500 cursor-pointer"
        :class="filmeAtualIndex === index ? 'bg-[#2FA36A]' : 'bg-black'"
        @click="filmeAtualIndex = index"
      ></div>
    </div>
    </div>

    <!-- LISTAGEM DE FILMES -->
    <section v-if="!loading && filmes.length > 0" class="max-w-7xl mx-auto px-6 py-12">
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-1" style="font-family: 'Poppins', sans-serif;">
        Confira os filmes em cartaz
        </h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <router-link
          v-for="filme in filmes"
          :key="filme.id"
          :to="usuario ? `/filmes/${filme.id}` : '/login'"
          class="group cursor-pointer block"
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
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-2.625 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25c0 .621.504 1.125 1.125 1.125M18 10.875c0 .621-.504 1.125-1.125 1.125m0 0v1.5c0 .621.504 1.125 1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
              </svg>
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
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {{ filme.duracao }}min
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <span class="bg-[#2FA36A] px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                Ver Detalhes
              </span>
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
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsuario } from '../composables/useUsuario'
import { useFilme } from '../composables/useFilme'
import type { Filme } from '../types/Filme'

const { usuario } = useUsuario()
const { filmes, loading, listarFilmes } = useFilme()

const filmeAtualIndex = ref(0)
const transicao = ref('slide-left')

const filmeAtual = computed<Filme & { poster: string; generos: string[] }>(() => {
  const f = filmes.value[filmeAtualIndex.value]
  if (!f) {
    return { nome: '', poster: '', generos: [], duracao: 0, classificacao: '', descricao: '' } as any
  }
  return {
    ...f,
    poster: f.imagemUrl ? `/filmes/${f.imagemUrl}` : 'https://picsum.photos/1920/1080?random=' + filmeAtualIndex.value,
    generos: f.genero ? [f.genero] : []
  }
})

// Navegação
const proximoFilme = () => {
  if (filmes.value.length === 0) return
  transicao.value = 'slide-left'
  filmeAtualIndex.value = (filmeAtualIndex.value + 1) % filmes.value.length
}

const anteriorFilme = () => {
  if (filmes.value.length === 0) return
  transicao.value = 'slide-right'
  filmeAtualIndex.value = (filmeAtualIndex.value - 1 + filmes.value.length) % filmes.value.length
}

onMounted(() => {
  listarFilmes()
})

// Helpers visuais
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.6s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Botões e setas com animação de clique */
button {
  cursor: pointer;
}
button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-in-out;
}
button:hover {
  transition: transform 0.2s ease-in-out;
}
</style>
