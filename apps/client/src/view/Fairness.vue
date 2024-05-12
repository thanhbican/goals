<template>
  <section class="space-y-4 text-white">
    <h2 class="text-xl font-bold text-white">ROULETTE TECHNICAL DETAILS</h2>
    <div class="space-y-2 text-base">
      <p>
        Our system generates the result for each round by using the SHA-256 hash
        of 3 separate inputs
      </p>

      <ol class="space-y-2">
        <li>
          <span class="text-yellow-300">1 ―</span> The "public seed" is a
          concatenation of 5 pairs of random numbers, 01 to 39, generated daily.
        </li>
        <li>
          <span class="text-yellow-300">2 ―</span> The "server seed" is a
          SHA-256 hash of 16 cryptographically secure random bytes, generated at
          the same time as the public seed.
        </li>
        <li><span class="text-yellow-300">3 ―</span> Round ID</li>
      </ol>
      <p>Players can replicate any past roll by using the code below.</p>
      <pre>
        <div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium">
        const serverSeed = '0ecb9d89c9936fbc42180cc1123079db17eb8dd833a6c5f3700e62c82ae69407'
        const publicSeed = '34161117192806361336'
        const roundId = '1'
        const hash = sha256(serverSeed + '-' + publicSeed + '-' + roundId)
        const roll = parseInt(hash.substring(0, 8), 16) % 15
        if (roll === 0) { rollColor = 'green'}
        else if (roll >= 1 && roll <= 7) { rollColor = 'red' }
        else if (roll >= 8 && roll <= 14) { rollColor = 'black' }

        console.log(`Roll: ${roll}, Color: ${rollColor}`);
        </div>
      </pre>
    </div>

    <div v-if="isLoading" class="w-full flex justify-center items-center">
      <span class="loading loading-spinner text-info"></span>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th class="text-white">DATE</th>
            <th class="text-white">SERVER SEED</th>
            <th class="text-white">PUBLIC SEED</th>
            <th class="text-white">ROLLS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in gameList?.games" :key="game.id">
            <td>{{ formatDate(game.createdAt) }}</td>
            <td>{{ game.serverSeed }}</td>
            <td>{{ game.publicSeed }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="join">
      <button
        v-for="(page, index) in gameList?.totalPages"
        :key="index"
        class="join-item btn"
        :class="{ 'btn-active': page === gameList?.page }"
        @click="fetchGameList(page)"
      >
        {{ page }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getGames } from '@/api/gameApi'
import { formatDate } from '@/helper/util'
import { onMounted, ref } from 'vue'

import { GamesResponse } from '@/types/game'

const gameList = ref<GamesResponse | null>(null)
const isLoading = ref(false)

const fetchGameList = async (page: number) => {
  isLoading.value = true
  gameList.value = await getGames(page)
  isLoading.value = false
}

onMounted(async () => {
  isLoading.value = true
  gameList.value = await getGames()
  isLoading.value = false
})
</script>

<style scoped></style>
