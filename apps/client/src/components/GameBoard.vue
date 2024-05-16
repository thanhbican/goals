<template>
  <section class="grid grid-cols-12 gap-4">
    <div
      v-for="place in places"
      :key="place"
      class="col-span-4"
      :class="{
        // '': currentRollColor === place,
        // '':
        //   !!currentBet[place] && currentRollColor !== place,
        'opacity-50': !!!isBetEnabled && currentRollColor !== place,
      }"
    >
      <button
        class="border border-white w-full"
        :class="{
          'cursor-pointer': !!isBetEnabled,
          'cursor-not-allowed': !!!isBetEnabled,
        }"
        :disabled="!isBetEnabled"
        @click="onBet(place)"
      >
        <div
          class="flex justify-between items-center text-white p-4"
          :class="{
            'bg-red': place === 'red',
            'bg-green': place === 'green',
            'bg-black': place === 'black',
          }"
        >
          <div class="flex gap-x-2 items-center">
            <p class="border border-solid p-2">
              {{
                place === 'green'
                  ? '0'
                  : place === 'black'
                    ? '8 to 14'
                    : '1 to 7'
              }}
            </p>
            <p class="flex items-center gap-x-2">
              <span>{{ currentBet[place] ? 'Bet Placed:' : `Place bet` }}</span>
              <span v-if="currentBet[place]" class="flex items-center gap-x-2">
                <img
                  src="@/assets/money_img.svg"
                  width="16"
                  height="16"
                  alt="money icon"
                />
                <span>
                  {{ currentBet[place] }}
                </span>
              </span>
            </p>
          </div>
          <p>{{ place === 'green' ? 'WIN 14x' : 'WIN 2x' }}</p>
        </div>
      </button>

      <div class="bg-[rgba(0,0,0,.5)] text-[#c0c0c0] p-4">
        <div class="flex justify-between items-center">
          <h2>{{ betListTotal[place].length }} bets in totals</h2>
          <div class="flex items-center gap-x-2">
            <img
              src="@/assets/money_img.svg"
              width="16"
              height="16"
              alt="money icon"
            />
            <p
              :class="{
                'text-green': currentRollColor === place,
                'text-red': currentRollColor && currentRollColor !== place,
              }"
            >
              <span v-if="currentRollColor === place">+</span>
              <span v-if="currentRollColor && currentRollColor !== place"
                >-</span
              >
              <span ref="total">0</span>
            </p>
          </div>
        </div>
        <ul v-if="betList[place]?.length" class="mt-4 space-y-2">
          <li
            v-for="player in betList[place]"
            :key="player.username"
            class="flex justify-between items-center"
          >
            <h3>{{ player.username }}</h3>
            <p
              :class="{
                'text-green': currentRollColor === place,
                'text-red': currentRollColor && currentRollColor !== place,
              }"
            >
              <span v-if="currentRollColor === place">+</span>
              <span v-if="currentRollColor && currentRollColor !== place"
                >-</span
              >
              {{ player.betAmount }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { animateMoney, roundMoney } from '@/helper/util'
import { useAuthModalStore } from '@/store/authModal'
import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { computed, onMounted, ref } from 'vue'

import { BetList, BetListTotal, BetTotal, RollColor } from '@/types/game'

import { socket } from '../services/socket'

// store
const gameStore = useGameStore()
const userStore = useUserStore()
const authModalStore = useAuthModalStore()

// variable
const places = ['red', 'green', 'black'] as const
const isBetEnabled = ref(false)
const betList = ref<BetList>({
  red: [],
  green: [],
  black: [],
})
const betListTotal = ref<BetListTotal>({
  red: {
    total: 0,
    length: 0,
  },
  green: {
    total: 0,
    length: 0,
  },
  black: {
    total: 0,
    length: 0,
  },
})
const total = ref<HTMLElement[] | null>(null)
const currentRollColor = ref<RollColor | null>(null)
const isLoaded = ref(false)

// socket
socket.on(
  'game:waiting',
  ({
    betList: list,
    betListTotal: listTotal,
  }: {
    betList: BetList
    betListTotal: BetListTotal
  }) => {
    currentRollColor.value = null
    betList.value = list
    betListTotal.value = listTotal
    animationTotal()

    isBetEnabled.value = true
  }
)
socket.on('game:waiting-timer', () => {
  isBetEnabled.value = true
})
socket.on('game:rolling', () => {
  isBetEnabled.value = false
})
socket.on(
  'game:choosing-list',
  ({
    betList: list,
    betListTotal: listTotal,
  }: {
    betList: BetList
    betListTotal: BetListTotal
  }) => {
    betList.value = list
    betListTotal.value = listTotal
    animationTotal()
  }
)
socket.on(
  'game:first-load-board',
  ({
    betList: list,
    betListTotal: listTotal,
    rollColor,
  }: {
    betList: BetList
    betListTotal: BetListTotal
    rollColor: RollColor | null
  }) => {
    isLoaded.value = true
    betList.value = list
    betListTotal.value = listTotal
    currentRollColor.value = rollColor
    animationTotal()
  }
)
socket.on('game:refresh-user', async () => {
  try {
    await userStore.getUser()
  } catch (error) {
    console.error(error)
  }
})
socket.on(
  'game:result',
  ({
    rollColor,
    betListTotal: listTotal,
  }: {
    rollColor: RollColor
    betListTotal: BetListTotal
  }) => {
    currentRollColor.value = rollColor
    betListTotal.value = listTotal
    animationTotal()
  }
)

// func
const onBet = async (place: string) => {
  if (!userStore.isUserLoggedIn) {
    authModalStore.openModal()
  }
  if (gameStore.amount && gameStore.amount <= userStore.balance) {
    const betAmount = roundMoney(gameStore.amount)
    const res = await socket.emitWithAck('game:choosing', { place, betAmount })
    if (res.status === 'OK') {
      userStore.setBalance(res.data.balance)
    }
  }
}

const animationTotal = () => {
  Object.keys(betListTotal.value).forEach((place, index) => {
    if (!total.value) return

    const key = place as keyof BetListTotal
    animateMoney(total.value[index], betListTotal.value[key].total)
  })
}

// computed
const currentBet = computed(() => {
  const betPlace = {
    red: 0,
    green: 0,
    black: 0,
  }
  Object.keys(betList.value).map((place, index) => {
    const key = place as keyof BetList
    const user = betList.value[key].find(
      (user) => user.username === userStore.username
    )
    if (user) {
      betPlace[key] = user.betAmount
    }
  })
  return betPlace
})

// hook
onMounted(async () => {
  try {
    const responseGameStatus = await socket.emitWithAck('game:status')
    if (responseGameStatus.status === 'OK') {
      isBetEnabled.value = responseGameStatus.data.isBetEnabled
    }

    if (isLoaded.value) return
    const responseLoadHistory = await socket.emitWithAck(
      'game:first-load-board'
    )
    if (responseLoadHistory.status === 'OK') {
      betList.value = responseLoadHistory.data.betList
      betListTotal.value = responseLoadHistory.data.betListTotal
      currentRollColor.value = responseLoadHistory.data.currentRollColor
    }
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped></style>
