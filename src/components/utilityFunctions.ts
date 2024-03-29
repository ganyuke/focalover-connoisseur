export const asTimestamp = (time: number) => {
    const seconds: string = Math.ceil(time % 60)
      .toString()
      .padStart(2, '0')
    const minutes: string = Math.floor(time / 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }
  