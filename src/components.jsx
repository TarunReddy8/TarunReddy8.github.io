// Small building blocks: scroll reveals, animated counters, 3D-tilt cards,
// and magnetic buttons — plain React hooks, no animation libraries.
import { useEffect, useRef, useState, useCallback } from 'react'

const REDUCED = typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fades/slides children in when they enter the viewport. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED) { el.classList.add('in'); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transitionDelay = `${delay}ms`
        el.classList.add('in')
        io.disconnect()
      }
    }, { threshold: 0.12 })
    io.observe(el)
    const failsafe = setTimeout(() => el.classList.add('in'), 3000)
    return () => { io.disconnect(); clearTimeout(failsafe) }
  }, [delay])
  return <Tag ref={ref} className={`reveal ${className}`} {...rest}>{children}</Tag>
}

/** Counts up to `value` when scrolled into view. */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED) { setDisplay(value); return }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const t0 = performance.now(), dur = 1500
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1)
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [value])
  return <div ref={ref} className="num">{display.toLocaleString()}{suffix}</div>
}

/** Project card with perspective tilt + cursor glow. */
export function TiltCard({ href, children }) {
  const ref = useRef(null)
  const raf = useRef(null)
  const onMove = useCallback((e) => {
    const card = ref.current
    if (!card || REDUCED) return
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    card.style.setProperty('--mx', `${x}px`)
    card.style.setProperty('--my', `${y}px`)
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      const rx = ((y / r.height) - 0.5) * -7
      const ry = ((x / r.width) - 0.5) * 7
      card.style.transform =
        `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`
      raf.current = null
    })
  }, [])
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])
  return (
    <a ref={ref} className="card tilt" href={href} target="_blank" rel="noopener noreferrer"
       onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </a>
  )
}

/** Button that leans toward the cursor. */
export function Magnetic({ as: Tag = 'a', className = '', children, ...rest }) {
  const ref = useRef(null)
  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el || REDUCED) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width / 2) / r.width
    const dy = (e.clientY - r.top - r.height / 2) / r.height
    el.style.transform = `translate(${(dx * 7).toFixed(1)}px, ${(dy * 7).toFixed(1)}px)`
  }, [])
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])
  return (
    <Tag ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </Tag>
  )
}

/** Inertial wheel scrolling + hero scroll-out parallax + nav blur, as one effect. */
export function useSmoothChrome(heroRef) {
  useEffect(() => {
    if (REDUCED) return
    const cleanups = []

    // inertial wheel glide (mouse wheels only; trackpads/touch stay native)
    if (matchMedia('(pointer: fine)').matches) {
      let target = window.scrollY, current = window.scrollY, raf = null
      const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight
      const glide = () => {
        current += (target - current) * 0.12
        if (Math.abs(target - current) < 0.5) { current = target; raf = null }
        else raf = requestAnimationFrame(glide)
        window.scrollTo({ top: current, behavior: 'instant' })
      }
      const onWheel = (e) => {
        if (e.ctrlKey) return
        e.preventDefault()
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
        target = Math.max(0, Math.min(maxScroll(), target + dy))
        if (!raf) raf = requestAnimationFrame(glide)
      }
      const onScroll = () => { if (!raf) { target = window.scrollY; current = window.scrollY } }
      addEventListener('wheel', onWheel, { passive: false })
      addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => { removeEventListener('wheel', onWheel); removeEventListener('scroll', onScroll) })
    }

    // hero scroll-out parallax
    let ticking = false
    const onScrollHero = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const el = heroRef.current
        if (el) {
          const y = Math.min(window.scrollY, window.innerHeight)
          el.style.transform = `translate3d(0, ${(y * 0.28).toFixed(1)}px, 0)`
          el.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.85)).toFixed(3)
        }
        ticking = false
      })
    }
    addEventListener('scroll', onScrollHero, { passive: true })
    cleanups.push(() => removeEventListener('scroll', onScrollHero))

    return () => cleanups.forEach((fn) => fn())
  }, [heroRef])
}
