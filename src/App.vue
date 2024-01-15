<script lang="ts">
import { ref } from 'vue'

let audio: HTMLAudioElement | null
let songIndex = 0

type quizMeta = {
  title: string
  elapsedTime: number // in seconds
  playerCount: number
}

const quizList: quizMeta[] = [
  { title: `Quiz Name 1 - Fontaine's Waltz & Tangos`, elapsedTime: 100, playerCount: 10 }
]

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

<script setup lang="ts">
import { asTimestamp } from './components/utilityFunctions'
import VisualColumn from './components/quiz/VisualColumn.vue'
import SongInformation from './components/quiz/SongInformation.vue'
import InteractableQuestion from './components/quiz/InteractableQuestion.vue'

const playbackTime = ref(0) // in seconds
const duration = ref(0) // in seconds
const showInfo = ref(false)
const nextSongSeconds = ref(0)
const songMetadata = ref(songList[songIndex])
let quizMetadata: quizMeta = quizList[0]

const getCoverArt = (filename: string) => {
  return coverImages[filename]
}

const getAudioSrc = (filename: string) => {
  return audioUrls[filename]
}

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
  audio.onended = () => {
    if (audio) audio.remove()
    audio = null
  }
  audio.play()
}

const nextSong = async () => {
  if (audio) audio = null
  if (songIndex + 1 < songList.length) songIndex++
  songMetadata.value = songList[songIndex]
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
      <VisualColumn
        :showInfo="showInfo"
        :playback-time="playbackTime"
        :duration="duration"
        :cover-art-url="getCoverArt(songMetadata.coverArt)"
      />
      <div class="bg-brand-card rounded-lg" @click="showInfo = !showInfo">
        <InteractableQuestion />
        <SongInformation
          v-if="showInfo"
          :title="songMetadata.songTitle"
          :artist="songMetadata.artist"
          :album="songMetadata.albumTitle"
        />
      </div>
      <div><!-- offset column --></div>
      <div class="ml-auto mx-5" @click="nextSong">
        <p class="text-gray-400">Next song in {{ nextSongSeconds }} second(s)</p>
      </div>
    </div>
  </div>
</template>
