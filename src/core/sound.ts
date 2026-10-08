/**
 * Plays a clean, pleasant two-tone notification chime for greeting bubble popups.
 * Handles browser audio autoplay restrictions by resuming suspended AudioContexts.
 */
let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return null
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
        sharedAudioCtx = new AudioContextClass()
    }
    return sharedAudioCtx
}

export function playNotificationChime(): boolean {
    try {
        const ctx = getAudioContext()
        if (!ctx) return false

        const play = () => {
            const now = ctx.currentTime
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = "sine"
            osc.connect(gain)
            gain.connect(ctx.destination)

            // Warm, clear 2-tone melodic chime: D5 (587.33 Hz) -> A5 (880 Hz)
            osc.frequency.setValueAtTime(587.33, now)
            osc.frequency.setValueAtTime(880, now + 0.08)

            gain.gain.setValueAtTime(0.22, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)

            osc.start(now)
            osc.stop(now + 0.38)
        }

        if (ctx.state === "suspended") {
            ctx.resume().then(() => play()).catch(() => {})
        } else {
            play()
        }

        return true
    } catch {
        return false
    }
}
