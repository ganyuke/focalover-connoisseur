<script lang="ts">
import { ref } from 'vue'

const playbackTime = ref(0) // in seconds
const duration = ref(0) // in seconds
let cancelId: number | null = null

const playAudio = async () => {
  let sound = await import('@/assets/audio/Fontaine.flac')
  const audio = new Audio(sound.default)
  audio.onloadedmetadata = () => {
    duration.value = audio.duration
  }

  audio.onplaying = () => {
    if (cancelId) clearInterval(cancelId)
    playbackTime.value = audio.currentTime
    cancelId = setInterval(() => playbackTime.value++, 1000)
  }

  audio.onpause = () => {
    if (cancelId) clearInterval(cancelId)
  }

  /*audio.ontimeupdate = () => {
    playbackTime.value = audio.currentTime
  }*/

  audio.play()
}

const asTimestamp = (time: number) => {
  const seconds: string = Math.ceil(time % 60)
    .toString()
    .padStart(2, '0')
  const minutes: string = Math.floor(time / 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default {
  methods: {
    playAudio,
    asTimestamp
  },
  setup() {
    return {
      playbackTime,
      duration,
      songMetadata,
      quizMetadata
    }
  }
}

type quizMeta = {
  title: string
  elapsedTime: number // in seconds
  playerCount: number
}

const quizMetadata: quizMeta = {
  title: `Quiz Name 1 - Fontaine's Waltz & Tangos'`,
  elapsedTime: 100,
  playerCount: 10
}

type songMeta = {
  albumTitle?: string
  artist: string
  songTitle: string
}

const songMetadata: songMeta = {
  artist: 'HOYO-MiX',
  songTitle: 'Fontaine',
  albumTitle: 'Fountain of Bellau'
}
</script>

<template>
  <div class="max-w-[50em] sm:mx-auto my-20 mx-4">
    <div class="my-4">
      <h1 class="font-black text-white text-4xl my-3 uppercase" v-text="quizMetadata.title"></h1>
      <p class="font-black text-gray-500 text-lg">
        <span v-text="asTimestamp(quizMetadata.elapsedTime)"></span> -
        <span v-text="quizMetadata.playerCount"></span> players
      </p>
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <div class="from-[#7dcefc] to-[#8dbc85] bg-gradient-to-b rounded-lg p-4" @click="playAudio">
          <img src="./assets/images/cover.jpg" class="w-full" />
        </div>
        <div class="bg-brand-card rounded-lg mt-4 p-4">
          <img src="./assets/images/6638b0bc-b049-4399-96b0-a728e6e63761.png" class="bg-cover" />

          <progress v-bind:max="duration" v-bind:value="playbackTime"></progress>
        </div>
      </div>
      <div class="bg-brand-card rounded-lg">
        <div class="my-4">
          <h2 class="font-black text-3xl text-center text-white uppercase">Name that song!</h2>
          <form class="text-center my-3 w-full">
            <input
              type="text"
              id="name"
              name="name"
              required
              class="bg-[#393c48] text-center text-white h-16 text-2xl"
            />
          </form>
        </div>
        <div class="text-center font-light my-3">
          <h2 class="font-black text-3xl text-center text-white my-3">Song information</h2>
          <p class="text-5xl" v-text="songMetadata.songTitle" id="song-title"></p>
          <p class="text-lg" v-text="songMetadata.artist" id="artist"></p>
          <p class="text-gray-400" v-bind:hidden="songMetadata.albumTitle === undefined">from</p>
          <p class="text-2xl italic" v-text="songMetadata.albumTitle" id="album"></p>
          <!-- <progress id="fprogress {
  appearance: none;
  background: url('/src/assets/images/mask.png') #cccccc !important;
}

progress:after {
  width: 100%;
  background-color: aliceblue;
  height: 100%;
  /* mask-image: url('/src/assets/images/mask.png'); */
}ile" v-bind:max="duration" v-bind:value="playbackTime">
            {{ playbackTime }}%
          </progress> -->

          <!-- {{ asTimestamp(playbackTime) }} / {{ asTimestamp(duration) }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#song-title::before,
#song-title::after {
  content: '"';
}

/*
progress {
  appearance: none;
  background-image: url('/src/assets/images/mask.png');
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 3em;
}

progress::-moz-progress-bar {
  width: 100%;
  height: 3em;
  background-image: url('/src/assets/images/6638b0bc-b049-4399-96b0-a728e6e63761.png');
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
}*/
</style>
