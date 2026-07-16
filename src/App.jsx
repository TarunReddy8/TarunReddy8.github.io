import { useEffect, useRef, useState } from 'react'
import Scene from './Scene.jsx'
import { Counter, Magnetic, Reveal, TiltCard, useSmoothChrome } from './components.jsx'

const PROJECTS = [
  {
    name: 'evalsmith', idx: '01',
    url: 'https://github.com/TarunReddy8/evalsmith',
    blurb: <>CI for LLM quality. Faithfulness, relevance &amp; safety scoring with{' '}
      <b>regression gates</b> — a prompt change that drops grounding accuracy fails the
      build, with a per-case HTML report.</>,
    tags: ['LLM-as-judge', 'RAG evals', 'regression gates', 'Python'],
  },
  {
    name: 'ClaimSight', idx: '02',
    url: 'https://github.com/TarunReddy8/claimsight',
    blurb: <>Multi-agent insurance claims processing. LLM extraction with{' '}
      <b>verified citations</b>, a deterministic 9-rule policy engine, and{' '}
      <b>hash-chained audit trails</b>. Its narratives are gated by evalsmith in CI.</>,
    tags: ['multi-agent', 'document AI', 'audit trails', 'healthcare'],
  },
  {
    name: 'APSentry', idx: '03',
    url: 'https://github.com/TarunReddy8/apsentry',
    blurb: <>AP invoice screening: 3-way match plus fraud detectors — duplicates, price
      outliers via <b>vendor-history z-scores</b>, bank-detail changes. Detector
      precision/recall <b>backtested and gated at 90% in CI</b>.</>,
    tags: ['anomaly detection', '3-way match', 'backtesting', 'fintech'],
  },
  {
    name: 'Voxa', idx: '04',
    url: 'https://github.com/TarunReddy8/voxa',
    blurb: <>A fully local voice AI agent. Energy-VAD listening, whisper STT, streaming
      reasoning with native tool calls, and <b>sentence-streamed TTS that starts speaking
      while the model is still thinking</b>. Per-turn latency breakdown built in.</>,
    tags: ['voice AI', 'streaming', 'local-first', 'Ollama · Whisper · Piper'],
  },
]

const SKILLS_ROW_1 = ['Python', 'RAG', 'LangChain', 'Azure OpenAI', 'Anthropic API',
  'vector search', 'LLM evaluation', 'guardrails · Presidio', 'prompt engineering',
  'PyTorch', 'scikit-learn', 'XGBoost']
const SKILLS_ROW_2 = ['Kubernetes · EKS', 'Docker', 'MLflow', 'GitHub Actions', 'Terraform',
  'FastAPI', 'Prometheus · Grafana', 'Spark · Databricks', 'Delta Lake', 'Kafka',
  'Airflow', 'Snowflake', 'Great Expectations']
const HOT = new Set(['Python', 'RAG', 'Azure OpenAI', 'LLM evaluation', 'Docker',
  'FastAPI', 'Spark · Databricks'])

function SkillRow({ items, dir }) {
  const chips = [...items, ...items].map((skill, i) => (
    <span key={i} className={`chip ${HOT.has(skill) ? 'hot' : ''}`}>{skill}</span>
  ))
  return <div className={`marquee ${dir}`}>{chips}</div>
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  useSmoothChrome(heroRef)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Scene />
      <div className="vignette" aria-hidden="true" />

      <nav className={scrolled ? 'scrolled' : ''}>
        <a className="logo" href="#top">tarun<span>.builds</span></a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <Magnetic className="btn btn-ghost" href="https://github.com/TarunReddy8"
            target="_blank" rel="noopener noreferrer">GitHub</Magnetic>
          <Magnetic className="btn btn-primary" href="#contact">Get in touch</Magnetic>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="hero-parallax" ref={heroRef}>
            <div className="hero-float">
              <p className="hello">$ whoami — Tarun Kumar Reddy Nallagari · Buffalo, NY
                <span className="cursor">▌</span></p>
              <h1>I build <span className="grad">production AI</span> that actually ships.</h1>
              <p className="sub">AI/ML Engineer at <strong>Ally Financial</strong> — LLM &amp; RAG
                systems, evaluation pipelines, and MLOps in regulated industries. I care about the
                unglamorous parts: <strong>evals, grounding, guardrails, latency, and cost</strong>.</p>
              <div className="cta">
                <Magnetic className="btn btn-primary" href="#work">See the work ↓</Magnetic>
                <Magnetic className="btn btn-ghost"
                  href="https://www.linkedin.com/in/tarun-kumar-reddy-nallagari-27b408218/"
                  target="_blank" rel="noopener noreferrer">LinkedIn</Magnetic>
              </div>
              <div className="ticker">
                <span><span className="dot">●</span> p95 <b>&lt; 800 ms</b> @ 50K req/day</span>
                <span><span className="dot">●</span> retrieval hit-rate <b>92%</b></span>
                <span><span className="dot">●</span> LLM spend <b>−35%</b></span>
                <span><span className="dot">●</span> <b>2 TB/day</b> pipelines</span>
              </div>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true">↓</div>
        </section>

        <section id="about">
          <Reveal as="p" className="kicker">about</Reveal>
          <Reveal as="h2">Systems thinking,<br /><span className="grad">measured outcomes.</span></Reveal>
          <Reveal as="p" className="lede">Four years across banking and healthcare taught me that
            AI features live or die on the boring stuff — evaluation gates, audit trails, drift
            monitors, cost controls. So that&apos;s what I build, and I ship it in the open.</Reveal>
          <div className="stats">
            {[
              { value: 4, suffix: '+', label: 'years building ML & data systems' },
              { value: 4, suffix: '', label: 'open-source projects, all CI-green' },
              { value: 2000, suffix: '+', label: 'agents served by my RAG assistant' },
              { value: 70, suffix: '%', label: 'faster incident detection via observability' },
            ].map((stat, i) => (
              <Reveal key={stat.label} className="stat" delay={i * 75}>
                <Counter value={stat.value} suffix={stat.suffix} />
                <div className="lbl">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="work">
          <Reveal as="p" className="kicker">selected work</Reveal>
          <Reveal as="h2">Build → evaluate → <span className="grad">ship.</span></Reveal>
          <Reveal as="p" className="lede">Four open-source systems that work together — each one
            solves a real business problem and proves a different discipline.</Reveal>
          <div className="cards">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.name} delay={i * 75}>
                <TiltCard href={project.url}>
                  <span className="idx">{project.idx}</span>
                  <h3>{project.name} <span className="arrow">↗</span>{' '}
                    <span className="pill">CI passing</span></h3>
                  <p>{project.blurb}</p>
                  <div className="tags">
                    {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills">
          <Reveal as="p" className="kicker">toolbox</Reveal>
          <Reveal as="h2">The stack I <span className="grad">ship with.</span></Reveal>
          <Reveal className="marquee-wrap" aria-label="Skills">
            <SkillRow items={SKILLS_ROW_1} dir="m1" />
            <SkillRow items={SKILLS_ROW_2} dir="m2" />
          </Reveal>
        </section>

        <section id="experience">
          <Reveal as="p" className="kicker">experience</Reveal>
          <Reveal as="h2">Where I&apos;ve <span className="grad">shipped.</span></Reveal>
          <div className="timeline">
            <Reveal className="titem">
              <span className="when">Jul 2025 — present</span>
              <h3>AI/ML Engineer · Ally Financial</h3>
              <div className="where">New York, NY</div>
              <p>Built a RAG knowledge assistant for <b>2,000+ customer-care agents</b> on Azure
                OpenAI — guardrails, eval harness, and monitoring that passed a bank&apos;s model
                risk office. Cut agent handle time <b>14%</b>, LLM spend <b>~35%</b>, and kept p95
                under <b>800 ms</b> at 50K requests/day.</p>
            </Reveal>
            <Reveal className="titem" delay={75}>
              <span className="when">Jan 2024 — Jun 2025</span>
              <h3>MS, Data Science · University at Buffalo, SUNY</h3>
              <div className="where">Buffalo, NY</div>
              <p>Graduate work in machine learning and data systems.</p>
            </Reveal>
            <Reveal className="titem" delay={150}>
              <span className="when">Mar 2021 — Dec 2023</span>
              <h3>Data Engineer · Optum (UnitedHealth Group)</h3>
              <div className="where">Bengaluru, India</div>
              <p>PySpark pipelines processing <b>2+ TB/day</b> of claims on Databricks; migrated
                100+ Hive workloads (<b>60% faster, ~40% cheaper</b>); near-real-time Kafka
                ingestion; HIPAA-grade PHI controls across Delta Lake and Snowflake.</p>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="contact">
          <Reveal as="p" className="kicker" style={{ justifyContent: 'center' }}>contact</Reveal>
          <Reveal as="h2">Let&apos;s build something<br />
            <span className="grad">that ships.</span></Reveal>
          <Reveal>
            <Magnetic className="email-cta" href="mailto:ntarunreddywork@gmail.com">
              ntarunreddywork@gmail.com</Magnetic>
          </Reveal>
          <Reveal className="socials" delay={75}>
            <a href="https://github.com/TarunReddy8" target="_blank"
              rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/tarun-kumar-reddy-nallagari-27b408218/"
              target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="tel:+17164150536">716-415-0536</a>
          </Reveal>
        </section>
      </main>

      <footer>
        <div>© 2026 Tarun Kumar Reddy Nallagari · Buffalo, NY</div>
        <div className="mono">React + Three.js · GPU-rendered 3D · no trackers · built for 120 Hz</div>
      </footer>
    </>
  )
}
