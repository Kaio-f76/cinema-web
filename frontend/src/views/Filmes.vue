<template>
  <div class="max-w-4xl mx-auto">
    
    <h2 class="text-2xl font-bold mb-6" style="font-family: 'Poppins', sans-serif;">
      🎬 Lista de Filmes
    </h2>

    <p class="text-[#A8AAAD] mb-8">
      Bem-vindo, você está autenticado na sessão!
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div class="bg-[#131516] border border-[#252829] rounded-xl p-6 hover:bg-[#1A1C1E] transition">
        <h3 class="text-xl font-semibold">Filme 1</h3>
        <p class="text-sm text-[#A8AAAD] mt-2">Ação</p>
      </div>

      <div class="bg-[#131516] border border-[#252829] rounded-xl p-6 hover:bg-[#1A1C1E] transition">
        <h3 class="text-xl font-semibold">Filme 2</h3>
        <p class="text-sm text-[#A8AAAD] mt-2">Comédia</p>
      </div>

      <div class="bg-[#131516] border border-[#252829] rounded-xl p-6 hover:bg-[#1A1C1E] transition">
        <h3 class="text-xl font-semibold">Filme 3</h3>
        <p class="text-sm text-[#A8AAAD] mt-2">Drama</p>
      </div>

    </div>

    <button
      @click="handleLogout"
      class="mt-10 bg-[#EF4444] px-6 py-3 rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>
</template>
