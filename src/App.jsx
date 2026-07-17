import { useEffect, useRef, useState } from 'react'
import Scene from './Scene.jsx'
import { Counter, Magnetic, Reveal, TiltCard, useSmoothChrome } from './components.jsx'

const PROJECTS = [
  {
    name: 'evalsmith', idx: '01',
    url: 'https://github.com/TarunReddy8/evalsmith',
    tagline: 'CI for LLM quality — because you can’t ship what you can’t measure.',
    points: [
      <>Scores LLM/RAG output on <b>faithfulness, relevance &amp; safety</b> — LLM-as-judge or
        offline heuristics.</>,
      <>Commit a baseline; any prompt or model change that drops quality <b>fails the build</b>.</>,
      <>Emits a <b>per-case HTML report</b> pinpointing exactly which answers regressed.</>,
    ],
    tags: ['LLM-as-judge', 'RAG evals', 'regression gates', 'Python'],
  },
  {
    name: 'ClaimSight', idx: '02',
    url: 'https://github.com/TarunReddy8/claimsight',
    tagline: 'Multi-agent claims processing with an audit trail you can trust.',
    points: [
      <>Turns raw claim documents into an <b>audit-ready decision packet</b>.</>,
      <>LLM extraction with <b>verified citations</b> — hallucinated quotes get caught.</>,
      <>Deterministic 9-rule policy engine + <b>hash-chained tamper-evident trail</b>.</>,
      <>Its LLM narratives are <b>gated by evalsmith in CI</b> — the tools reference each other.</>,
    ],
    tags: ['multi-agent', 'document AI', 'audit trails', 'healthcare'],
  },
  {
    name: 'APSentry', idx: '03',
    url: 'https://github.com/TarunReddy8/apsentry',
    tagline: 'Invoice fraud screening, with detector quality proven — not assumed.',
    points: [
      <><b>3-way match</b>: invoice vs purchase order vs goods receipt.</>,
      <>Fraud detectors: exact &amp; fuzzy duplicates, <b>price outliers via z-scores</b>,
        bank-detail changes, threshold gaming.</>,
      <>Precision/recall <b>measured on a labeled population and gated at 90% in CI</b>.</>,
    ],
    tags: ['anomaly detection', '3-way match', 'backtesting', 'fintech'],
  },
]

const EXPERIENCE = [
  {
    when: 'Jul 2025 — present',
    role: 'AI/ML Engineer',
    org: 'Ally Financial',
    points: [
      <>Built a <b>RAG knowledge assistant for 2,000+ customer-care agents</b> on Azure OpenAI.</>,
      <>Shipped the guardrails, eval harness &amp; monitoring that got it past a
        <b> bank’s model risk office</b>.</>,
      <>Cut agent handle time <b>14%</b> and LLM spend <b>~35%</b>; hold p95 under
        <b> 800 ms at 50K requests/day</b>.</>,
    ],
  },
  {
    when: 'Jan 2024 — Jun 2025',
    role: 'MS, Data Science',
    org: 'University at Buffalo, SUNY',
    points: [
      <>Moved up the stack — from <b>moving data</b> to <b>reasoning over it</b>.</>,
      <>Deepened machine learning, LLMs, and data-systems foundations.</>,
    ],
  },
  {
    when: 'Mar 2021 — Dec 2023',
    role: 'Data Engineer',
    org: 'Optum (UnitedHealth Group)',
    points: [
      <>PySpark pipelines processing <b>2+ TB/day</b> of medical &amp; pharmacy claims on
        Databricks.</>,
      <>Migrated 100+ legacy Hive workloads — <b>60% faster, ~40% cheaper</b>.</>,
      <>Near-real-time <b>Kafka ingestion</b> and <b>HIPAA-grade PHI controls</b> across
        Delta Lake &amp; Snowflake.</>,
      <>Learned what “production” truly costs — the instinct behind every project above.</>,
    ],
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
              <p className="hello">$ whoami — Tarun Kumar Reddy Nallagari
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
              { value: 3, suffix: '', label: 'open-source projects, all CI-green' },
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
          <Reveal as="p" className="lede">Three open-source systems — each one solves a real
            business problem and proves a different discipline.</Reveal>
          <div className="cards">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.name} delay={i * 75}>
                <TiltCard href={project.url}>
                  <span className="idx">{project.idx}</span>
                  <h3>{project.name} <span className="arrow">↗</span>{' '}
                    <span className="pill">CI passing</span>
                    {project.demo && (
                      <span className="pill demo" role="link" tabIndex={0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation();
                          window.open(project.demo, '_blank', 'noopener'); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') {
                          e.preventDefault(); e.stopPropagation();
                          window.open(project.demo, '_blank', 'noopener'); } }}>
                        ▶ Live demo</span>
                    )}</h3>
                  <p className="tagline">{project.tagline}</p>
                  <ul className="points">
                    {project.points.map((point, j) => <li key={j}>{point}</li>)}
                  </ul>
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
            {EXPERIENCE.map((job, i) => (
              <Reveal key={job.org} className="titem" delay={i * 75}>
                <span className="when">{job.when}</span>
                <h3>{job.role} · {job.org}</h3>
                <ul className="points">
                  {job.points.map((point, j) => <li key={j}>{point}</li>)}
                </ul>
              </Reveal>
            ))}
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
        <div>© 2026 Tarun Kumar Reddy Nallagari</div>
        <div className="mono">React + Three.js · GPU-rendered 3D · no trackers · built for 120 Hz</div>
      </footer>
    </>
  )
}
