<script setup lang="ts">
const props = defineProps({
  coverArtUrl: { type: String, required: true },
  playbackTime: { type: Number, required: true },
  duration: { type: Number, required: true }
})

const asTimestamp = (time: number) => {
  const seconds: string = Math.ceil(time % 60)
    .toString()
    .padStart(2, '0')
  const minutes: string = Math.floor(time / 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}
</script>

<script lang="ts"></script>

<template>
  <div>
    <div class="from-[#7dcefc] to-[#8dbc85] bg-gradient-to-b rounded-lg p-4">
      <img v-bind:src="props.coverArtUrl" class="w-full" />
    </div>
    <div class="bg-brand-card rounded-lg mt-4 p-4 relative">
      <label for="waveform" class="text-gray-400 absolute bottom-2"
        >{{ asTimestamp(props.playbackTime) }} / {{ asTimestamp(props.duration) }}</label
      >
      <progress id="waveform" v-bind:max="duration" v-bind:value="playbackTime"></progress>
    </div>
  </div>
</template>
