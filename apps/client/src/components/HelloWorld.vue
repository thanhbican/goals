<!-- <template>
  <div>
    <div class="roulette-wrapper">
      <div class="wheel" ref="wheel"></div>
    </div>
    <input type="number" v-model="outcome" placeholder="Enter outcome" />
    <button @click="spin">Spin</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue';

export default class Roulette extends Vue {
  outcome: number = 0;

  mounted() {
    this.initWheel();
  }

  initWheel() {
    const $wheel = this.$refs.wheel as HTMLElement;
    let row = '';

    row += "<div class='row'>";
    row += "  <div class='card red'>1</div>";
    row += "  <div class='card black'>14</div>";
    row += "  <div class='card red'>2</div>";
    row += "  <div class='card black'>13</div>";
    row += "  <div class='card red'>3</div>";
    row += "  <div class='card black'>12</div>";
    row += "  <div class='card red'>4</div>";
    row += "  <div class='card green'>0</div>";
    row += "  <div class='card black'>11</div>";
    row += "  <div class='card red'>5</div>";
    row += "  <div class='card black'>10</div>";
    row += "  <div class='card red'>6</div>";
    row += "  <div class='card black'>9</div>";
    row += "  <div class='card red'>7</div>";
    row += "  <div class='card black'>8</div>";
    row += "</div>";

    for (let x = 0; x < 29; x++) {
      $wheel.insertAdjacentHTML('beforeend', row);
    }
  }

  spin() {
    const order: number[] = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
    const position: number = order.indexOf(this.outcome);

    const rows: number = 12;
    const card: number = 75 + 3 * 2;
    let landingPosition: number = rows * 15 * card + position * card;

    const randomize: number = Math.floor(Math.random() * 75) - 75 / 2;
    landingPosition += randomize;

    const object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };

    const $wheel = this.$refs.wheel as HTMLElement;
    $wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
    $wheel.style.transitionDuration = '6s';
    $wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;

    setTimeout(() => {
      $wheel.style.transitionTimingFunction = '';
      $wheel.style.transitionDuration = '';

      const resetTo = -(position * card + randomize);
      $wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
    }, 6 * 1000);
  }
}
</script>

<style scoped>
  .roulette-wrapper {
    width: 100%;
    overflow: hidden;
  }

  .wheel {
    display: flex;
    width: 100%;
    transition: transform 0.5s ease-in-out;
  }

  .row {
    display: flex;
  }

  .card {
    width: 50px;
    height: 75px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .red {
    background-color: red;
  }

  .black {
    background-color: black;
  }

  .green {
    background-color: green;
  }
</style> -->
