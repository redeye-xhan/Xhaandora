export function playBell(volume = 0.7) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 880
    g.gain.value = volume
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      o.stop()
      ctx.close()
    }, 300)
  } catch (e) {
    
    const audio = new Audio('/bell.mp3')
    audio.volume = volume
    audio.play().catch(() => {})
  }
}

export function playStart(volume = 0.6) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    
    o.frequency.value = 660
    g.gain.value = volume
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      o.frequency.value = 880
    }, 80)
    setTimeout(() => {
      o.stop()
      ctx.close()
    }, 220)
  } catch (e) {
    const audio = new Audio('/start.mp3')
    audio.volume = volume
    audio.play().catch(() => {})
  }
}

export function playStop(volume = 0.5) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    
    o.frequency.value = 440
    g.gain.value = volume
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      o.frequency.value = 330
    }, 120)
    setTimeout(() => {
      o.stop()
      ctx.close()
    }, 380)
  } catch (e) {
    const audio = new Audio('/stop.mp3')
    audio.volume = volume
    audio.play().catch(() => {})
  }
}
