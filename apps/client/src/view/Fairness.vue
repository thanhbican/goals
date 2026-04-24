<template>
  <section class="space-y-4 text-white min-w-0">
    <h2 class="text-lg sm:text-xl font-bold text-white">ROULETTE TECHNICAL DETAILS</h2>
    <div class="space-y-2 text-sm sm:text-base leading-6 min-w-0">
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
      <p>
        Players can replicate any past roll by using the code below and can use
        this
        <a
          class="text-yellow-300"
          href="https://emn178.github.io/online-tools/sha256.html"
          target="_blank"
          rel="noopener"
          >website</a
        >
        to test sha256
      </p>
      <pre class="max-w-full overflow-x-auto whitespace-pre text-xs sm:text-sm rounded-md">
        <div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium p-3 w-max min-w-full">
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
    <div v-else class="max-w-full overflow-x-auto">
      <table class="table table-xs sm:table-md min-w-[720px]">
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
            <td>{{ formatDate(game.date) }}</td>
            <td class="max-w-[280px] break-all" :class="{ 'text-yellow-300': !game.serverSeed }">
              {{
                game.serverSeed
                  ? game.serverSeed
                  : 'Please wait until the end of today'
              }}
            </td>
            <td class="break-all">{{ game.publicSeed }}</td>
            <td>
              <RouterLink :to="`/history/rounds/${game.id}`"
                >Click here for all rounds</RouterLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="gameList && gameList.totalPages > 1" class="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
      <button
        class="btn btn-sm sm:btn-md"
        :disabled="gameList.page <= 1"
        @click="goToPage(gameList.page - 1)"
      >
        Prev
      </button>
      <button
        v-for="(page, index) in displayedPages"
        :key="index"
        class="btn btn-sm sm:btn-md min-w-10"
        :class="{ 'btn-active': page === gameList.page }"
        :disabled="page === '…'"
        :aria-current="page === gameList.page ? 'page' : undefined"
        @click="typeof page === 'number' && goToPage(page)"
      >
        {{ page }}
      </button>
      <button
        class="btn btn-sm sm:btn-md"
        :disabled="gameList.page >= gameList.totalPages"
        @click="goToPage(gameList.page + 1)"
      >
        Next
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getGames } from '@/api/gameApi'
import { formatDate } from '@/helper/util'
import { computed, onMounted, ref } from 'vue'

import { GamesResponse } from '@/types/game'

const gameList = ref<GamesResponse | null>(null)
const isLoading = ref(false)

const displayedPages = computed<(number | '…')[]>(() => {
  if (!gameList.value) {
    return []
  }

  const { page, totalPages } = gameList.value

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const visiblePages = Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b)

  return visiblePages.reduce<(number | '…')[]>((result, item, index) => {
    const previousPage = visiblePages[index - 1]

    if (previousPage && item - previousPage > 1) {
      result.push('…')
    }

    result.push(item)
    return result
  }, [])
})

const fetchGameList = async (page: number) => {
  isLoading.value = true
  gameList.value = await getGames(page)
  isLoading.value = false
}

const goToPage = async (page: number) => {
  if (!gameList.value || page === gameList.value.page) {
    return
  }

  await fetchGameList(page)
}

onMounted(async () => {
  isLoading.value = true
  gameList.value = await getGames()
  isLoading.value = false
})
</script>

<style scoped></style>
