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
        const serverSeed =
        const publicSeed =
        const hash = sha256(serverSeed + '-' + publicSeed + '-' + roundId)
        const roll = parseInt(hash.substring(0, 8), 16) % 15
        if (roll === 0) { rollColor = 'green'}
        else if (roll >= 1 && roll <= 7) { rollColor = 'red' }
        else if (roll >= 8 && roll <= 14) { rollColor = 'black' }

        console.log(`Roll: ${roll}, Color: ${rollColor}`);
        </div>
      </pre>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
