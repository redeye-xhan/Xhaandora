'use client'

import './Particles.css'
import React, { useEffect, useRef } from 'react'
import { Renderer, Camera, Program, Geometry, Mesh, Transform } from 'ogl'

interface ParticleProps {
  particleColors?: string[]
  particleCount?: number
  particleSpread?: number
  speed?: number
  particleBaseSize?: number
  moveParticlesOnHover?: boolean
  alphaParticles?: boolean
  disableRotation?: boolean
  pixelRatio?: number
}

const hexToRgb = (hex: string): number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [1, 1, 1]
}

export default function Particles({
  particleColors = ['#00f5d4', '#4cc9f0', '#90dbf4'],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = true,
  alphaParticles = false,
  disableRotation = false,
  pixelRatio = 1,
}: ParticleProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    
    if (initialized.current) return
    initialized.current = true

    
    if (typeof window === 'undefined' || !containerRef.current) return

    
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      depth: false,
    })

    
    const gl = renderer.gl
    if (!gl || !(gl instanceof WebGL2RenderingContext || gl instanceof WebGLRenderingContext)) {
      console.warn('WebGL not supported')
      return
    }

    if (!gl.canvas) {
      console.error('WebGL canvas failed to initialize')
      return
    }

    renderer.setSize(window.innerWidth, window.innerHeight)
    const canvas = gl.canvas as HTMLCanvasElement

    containerRef.current.appendChild(canvas)
    rendererRef.current = renderer

    
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'

    
    const camera = new Camera(gl)
    camera.position.z = 5

    
    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(particleCount * 3) },
      color: { size: 3, data: new Float32Array(particleCount * 3) },
      size: { size: 1, data: new Float32Array(particleCount) },
    })

    const positions = geometry.attributes.position.data as Float32Array
    const colors = geometry.attributes.color.data as Float32Array
    const sizes = geometry.attributes.size.data as Float32Array

    
    for (let i = 0; i < particleCount; i++) {
      const colorIndex = i % particleColors.length
      const color = hexToRgb(particleColors[colorIndex])

      positions[i * 3] = (Math.random() - 0.5) * particleSpread * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * particleSpread * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * particleSpread

      colors[i * 3] = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]

      sizes[i] = Math.random() * particleBaseSize + particleBaseSize * 0.5
    }

    
    let program: Program
    try {
      program = new Program(gl, {
        vertex: `
          attribute vec3 position;
          attribute vec3 color;
          attribute float size;

          uniform mat4 uMatrix;
          uniform float uTime;
          uniform vec2 uMouse;

          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec3 pos = position;
            
            
            float dist = distance(pos.xy, uMouse * 5.0);
            float force = exp(-dist * 0.5) * 0.3;
            pos.xy += normalize(uMouse - pos.xy) * force;

            gl_Position = uMatrix * vec4(pos, 1.0);
            gl_PointSize = size;

            vColor = color;
            vAlpha = ${alphaParticles ? '0.5 + 0.5 * sin(uTime + float(gl_VertexID) * 0.1)' : '0.8'};
          }
        `,
        fragment: `
          precision highp float;

          uniform sampler2D uTexture;
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = (0.5 - dist) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        uniforms: {
          uMatrix: { value: camera.projectionMatrix },
          uTime: { value: 0 },
          uMouse: { value: [0, 0] },
        },
        transparent: true,
        depthTest: false,
      })
    } catch (err) {
      console.error('Particles shader failed:', err)
      return
    }

    
    const scene = new Transform()

    
    const mesh = new Mesh(gl, { geometry, program })
    mesh.setParent(scene)
    meshRef.current = mesh

    
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }

    
    const handleResize = () => {
      if (!gl.canvas) return
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.perspective({
        aspect: window.innerWidth / window.innerHeight,
      })
    }

    if (moveParticlesOnHover) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    window.addEventListener('resize', handleResize)

    
    function animate(t: number) {
      
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1

      
      program.uniforms.uTime.value = t * 0.001

      
      if (program.uniforms.uMouse) {
        program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y]
      }

      
      if (!disableRotation) {
        mesh.rotation.x += 0.001
        mesh.rotation.y += 0.002
      }

      
      renderer.render({ scene, camera })
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      
      try {
        const loseContextExt = gl.getExtension('WEBGL_lose_context')
        if (loseContextExt) {
          loseContextExt.loseContext()
        }
      } catch (e) {
        console.warn('WebGL context loss error:', e)
      }

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [
    particleColors,
    particleCount,
    particleSpread,
    speed,
    particleBaseSize,
    moveParticlesOnHover,
    alphaParticles,
    disableRotation,
    pixelRatio,
  ])

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
