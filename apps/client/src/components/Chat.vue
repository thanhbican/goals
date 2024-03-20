<script setup lang="ts">
import { ref } from 'vue';
import { socket } from '../services/socket';


const chatValue = ref('')

const onChat = async () => {
  const payload = {
    content: chatValue.value
  }
  const res = await socket.emitWithAck("chat:send", payload);
  console.log(res.status)
  // socket.emit('chat:send', {
  //   content: chatValue.value
  // })
}

socket.on('chat:sent', (message) => {
  console.log(message)
})
// const onReceive = () => {

// }
</script>
<template>
  <section class="section-chat">
    <div class="wrapper">
      <h1>1 online</h1>

      <ul class="chat-list">
        <li>Sam: abc</li>
      </ul>

      <div>
        <input type="text" placeholder="Type message" className="input w-full max-w-xs" />
      </div>
    </div>
  </section>
</template>

<style lang="sass">
// .section-chat
//   padding: 0 2rem
//   border-right: 1px solid #000
</style>
