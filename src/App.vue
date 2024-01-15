<script lang="ts">
import { ref } from 'vue'

const playbackTime = ref(0) // in seconds
const duration = ref(0) // in seconds
let audio: HTMLAudioElement | null
let songIndex = 0

const playAudio = async () => {
  // exit early if audio already exists
  if (audio) {
    return
  }

  audio = new Audio(audioUrls[songMetadata.value.audioUrl])

  audio.onloadedmetadata = () => {
    if (audio) duration.value = audio.duration
  }

  audio.ontimeupdate = () => {
    if (audio) playbackTime.value = audio.currentTime
  }

  audio.play()

  audio.onended = () => {
    if (audio) audio.remove()
    audio = null
  }
}

const nextSong = async () => {
  if (audio) audio = null
  if (songIndex + 1 < songList.length) songIndex++
  songMetadata.value = songList[songIndex]
  console.log(songIndex, songMetadata.value)
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
    asTimestamp,
    nextSong
  },
  setup() {
    return {
      playbackTime,
      duration,
      songMetadata,
      quizMetadata,
      nextSongSeconds: ref(0),
      coverImages
    }
  }
}

type quizMeta = {
  title: string
  elapsedTime: number // in seconds
  playerCount: number
}

const quizList: quizMeta[] = [
  { title: `Quiz Name 1 - Fontaine's Waltz & Tangos`, elapsedTime: 100, playerCount: 10 }
]
let quizMetadata: quizMeta = quizList[0]

type songMeta = {
  albumTitle?: string
  coverArt: string
  artist: string
  songTitle: string
  audioUrl: string
}

const songList: songMeta[] = [
  {
    artist: 'HOYO-MiX',
    songTitle: 'Fontaine',
    albumTitle: 'Fountain of Belleau',
    coverArt: 'cover.jpg',
    audioUrl: 'Fontaine.flac'
  },
  {
    artist: 'HOYO-MiX',
    songTitle: 'Le Souvenir avec le crepuscule',
    albumTitle: 'Fountain of Belleau',
    coverArt: 'cover.jpg',
    audioUrl: 'Le Souvenir avec le crepuscule.flac'
  }
]
let songMetadata = ref(songList[songIndex])

// https://www.lichter.io/articles/nuxt3-vue3-dynamic-images/#the-importmetaglob-trick
const covers: { [key: string]: { default: string } } = import.meta.glob(
  '@/assets/images/covers/*.jpg',
  { eager: true }
)
const coverImages = Object.fromEntries(
  Object.entries(covers).map(([key, value]) => [key.split('/').pop(), value.default])
)

const audios: { [key: string]: { default: string } } = import.meta.glob('@/assets/audio/*.flac', {
  eager: true
})
const audioUrls = Object.fromEntries(
  Object.entries(audios).map(([key, value]) => [key.split('/').pop(), value.default])
)
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
          <img v-bind:src="coverImages[songMetadata.coverArt]" class="w-full" />
        </div>
        <div class="bg-brand-card rounded-lg mt-4 p-4 relative">
          <label for="waveform" class="text-gray-400 absolute bottom-2"
            >{{ asTimestamp(playbackTime) }} / {{ asTimestamp(duration) }}</label
          >
          <progress id="waveform" v-bind:max="duration" v-bind:value="playbackTime"></progress>
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
          <p class="text-lg mt-2" v-text="songMetadata.artist" id="artist"></p>
          <p class="text-gray-400" v-bind:hidden="songMetadata.albumTitle === undefined">from</p>
          <p class="text-2xl italic" v-text="songMetadata.albumTitle" id="album"></p>
        </div>
      </div>
      <div><!-- offset column --></div>
      <div class="ml-auto mx-5" @click="nextSong">
        <p class="text-gray-400">Next song in {{ nextSongSeconds }} second(s)</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#song-title::before,
#song-title::after {
  content: '"';
}

progress {
  appearance: none;
  background-image: url('@/assets/images/mask.png');
  background-color: transparent;
  background-size: contain;
  background-repeat: no-repeat;
  width: 360px;
  height: 3em;
}

/* TODO: Fix this on Webkit/Blink & make not hardcoded */
progress::-moz-progress-bar {
  background-image: url('@/assets/images/6638b0bc-b049-4399-96b0-a728e6e63761.png');
  background-color: transparent;
  background-size: 360px 100%;
  background-position: 0px -2px;
  background-repeat: no-repeat;
}
</style>
