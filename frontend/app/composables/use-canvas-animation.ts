import { type Ref, onMounted, onUnmounted } from 'vue'

export interface UseCanvasAnimationOptions {
  canvasRef: Ref<HTMLCanvasElement | null>
  isListening: Ref<boolean>
}

export function useCanvasAnimation({ canvasRef, isListening }: UseCanvasAnimationOptions) {
  let animationFrameId: number | null = null
  let time = 0

  const colors = {
    color1: [173, 231, 255], // #ade7ff
    color2: [235, 244, 255], // #ebf4ff
    color3: [0, 187, 255], // #00bbff
  }

  function noise(x: number, y: number, t: number): number {
    const sin1 = Math.sin(x * 0.02 + t * 0.5)
    const sin2 = Math.sin(y * 0.02 + t * 0.3)
    const sin3 = Math.sin((x + y) * 0.015 + t * 0.4)
    const sin4 = Math.sin(Math.sqrt(x * x + y * y) * 0.02 - t * 0.2)
    return (sin1 + sin2 + sin3 + sin4) / 4
  }

  function warp(x: number, y: number, t: number): [number, number] {
    const angle = noise(x, y, t) * Math.PI * 2
    const dist = noise(x + 100, y + 100, t + 1) * 30
    return [x + Math.cos(angle) * dist, y + Math.sin(angle) * dist]
  }

  function render() {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 280
    canvas.width = size
    canvas.height = size

    const imageData = ctx.createImageData(size, size)
    const data = imageData.data
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - centerX
        const dy = y - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > radius) {
          const idx = (y * size + x) * 4
          data[idx] = 255
          data[idx + 1] = 255
          data[idx + 2] = 255
          data[idx + 3] = 255
          continue
        }

        const [wx, wy] = warp(x, y, time)
        const n1 = noise(wx * 0.8, wy * 0.8, time * 0.5)
        const n2 = noise(wx * 1.2 + 50, wy * 1.2 + 50, time * 0.7)
        const n3 = noise(wx * 0.5 + 100, wy * 0.5 + 100, time * 0.3)

        const blend1 = (n1 + 1) / 2
        const blend2 = (n2 + 1) / 2
        const blend3 = (n3 + 1) / 2

        let r = (colors.color1[0] ?? 0) * blend1 + (colors.color2[0] ?? 0) * blend2 * 0.5 + (colors.color3[0] ?? 0) * blend3 * 0.3
        let g = (colors.color1[1] ?? 0) * blend1 + (colors.color2[1] ?? 0) * blend2 * 0.5 + (colors.color3[1] ?? 0) * blend3 * 0.3
        let b = (colors.color1[2] ?? 0) * blend1 + (colors.color2[2] ?? 0) * blend2 * 0.5 + (colors.color3[2] ?? 0) * blend3 * 0.3

        const edgeFade = 1 - Math.pow(dist / radius, 3)
        r = r * edgeFade + 255 * (1 - edgeFade)
        g = g * edgeFade + 255 * (1 - edgeFade)
        b = b * edgeFade + 255 * (1 - edgeFade)

        const idx = (y * size + x) * 4
        data[idx] = Math.min(255, Math.max(0, r))
        data[idx + 1] = Math.min(255, Math.max(0, g))
        data[idx + 2] = Math.min(255, Math.max(0, b))
        data[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    time += 0.02
    animationFrameId = requestAnimationFrame(render)
  }

  function startAnimation() {
    if (animationFrameId === null) {
      render()
    }
  }

  function stopAnimation() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  onMounted(() => {
    startAnimation()
  })

  onUnmounted(() => {
    stopAnimation()
  })
}
