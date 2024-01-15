<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: false }
})
</script>

<template>
  <div class="text-center font-light my-3">
    <h2 class="font-black text-3xl text-center text-white my-3">Song information</h2>
    <p class="text-5xl" v-text="props.title" id="song-title"></p>
    <p class="text-lg mt-2" v-text="props.artist" id="artist"></p>
    <p class="text-gray-400" v-bind:hidden="props.album === undefined">from</p>
    <p class="text-2xl italic" v-text="props.album" id="album"></p>
  </div>
</template>
