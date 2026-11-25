import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Download, MapPin, ChevronDown, Mail, Sun, Moon,
  ChevronLeft, ChevronRight, Award, ArrowUp, Send, Maximize2, X,
  GraduationCap, Calendar, Briefcase, Menu
} from 'lucide-react';
import api from '../utils/api';

const GithubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ─── Starfield Background ────────────────────────────────────────────────────
function Starfield({ visible }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
    }));
    let frame;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.a += s.speed * 0.01;
        const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.a));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
    />
  );
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

// ─── Scroll Fly-Up Reveal Wrapper ────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 36, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar (Desktop Top Bar + Mobile Slide-Out Side Drawer) ─────────────────
function Navbar({ profile, activeSection, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const brand = profile?.name?.split(' ')[0] || 'Ariyan';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled || drawerOpen ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled || drawerOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled || drawerOpen ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
        }}
      >
        <div
          className="container portfolio-nav-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        >
          <a
            href="#home"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '-0.03em',
            }}
          >
            {brand}
          </a>

          <nav
            className="portfolio-nav-links desktop-only-nav"
            aria-label="Primary Navigation"
            style={{ display: 'flex', alignItems: 'center', gap: '1.65rem', fontSize: '0.875rem' }}
          >
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setDrawerOpen(o => !o)}
              aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={drawerOpen}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Side Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 140,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.aside
              key="drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              aria-label="Mobile Side Navigation"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(290px, 82vw)',
                zIndex: 150,
                background: 'var(--bg)',
                borderLeft: '1px solid var(--border)',
                padding: '1.25rem 1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.45)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem' }}>{brand}</span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = activeSection === item.id;
                    return (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * idx, duration: 0.25 }}
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                          background: isActive ? 'var(--accent-soft)' : 'transparent',
                          border: `1px solid ${isActive ? 'var(--accent-border)' : 'transparent'}`,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {item.label}
                      </motion.a>
                    );
                  })}
                </nav>
              </div>

              <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a href="#contact" onClick={() => setDrawerOpen(false)} className="btn-primary" style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                    Let&apos;s Connect
                  </a>
                  {profile?.resumeUrl && (
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={() => setDrawerOpen(false)} className="btn-ghost" style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                      <Download size={14} /> Resume
                    </a>
                  )}
                </div>
                <SocialLinks profile={profile} size="sm" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <Reveal y={28} style={{ marginBottom: '3.25rem', textAlign: align }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '0.65rem',
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontSize: 'clamp(1.9rem, 3.8vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: subtitle ? '0.75rem' : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.98rem',
            maxWidth: align === 'center' ? '560px' : 'none',
            margin: align === 'center' ? '0 auto' : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

// ─── Social Row ──────────────────────────────────────────────────────────────
const normalizeUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

function SocialLinks({ profile, size = 'md' }) {
  const dim = size === 'sm' ? '36px' : '42px';
  const links = [
    { href: normalizeUrl(profile?.github), label: 'GitHub', icon: <GithubIcon /> },
    { href: normalizeUrl(profile?.linkedin), label: 'LinkedIn', icon: <LinkedinIcon /> },
    { href: normalizeUrl(profile?.twitter), label: 'Twitter', icon: <TwitterIcon /> },
    { href: normalizeUrl(profile?.facebook), label: 'Facebook', icon: <FacebookIcon /> },
  ].filter(l => Boolean(l.href));

  if (!links.length) return null;

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {links.map(l => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="icon-btn"
          style={{ width: dim, height: dim }}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

// ─── 1. Hero ─────────────────────────────────────────────────────────────────
function Hero({ profile, apiBase }) {
  const photoSrc = profile?.photo
    ? (profile.photo.startsWith('/uploads') ? `${apiBase}${profile.photo}` : profile.photo)
    : null;

  const fullTitle = profile?.title || 'Full-Stack Developer & ML Enthusiast';
  const [leadRole, ...restRole] = fullTitle.split('&');

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7.5rem 1.5rem 4rem',
        position: 'relative',
      }}
    >
      <div
        className="hero-glow"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(99,179,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: '760px', width: '100%', textAlign: 'center', margin: '0 auto' }}>
        {photoSrc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}
          >
            <div
              style={{
                width: '124px',
                height: '124px',
                borderRadius: '50%',
                padding: '3px',
                border: '1px solid var(--accent-border)',
                background: 'var(--surface)',
              }}
            >
              <img
                src={photoSrc}
                alt={profile?.name || 'Ariyan Aftab'}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            marginBottom: '0.85rem',
          }}
        >
          {profile?.name || 'Ariyan Aftab'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          style={{
            fontSize: 'clamp(1.1rem, 2.4vw, 1.4rem)',
            fontWeight: 600,
            marginBottom: '0.9rem',
            letterSpacing: '-0.01em',
          }}
        >
          <span>{leadRole.trim()}</span>
          {restRole.length > 0 && (
            <span style={{ color: 'var(--accent)' }}> &amp; {restRole.join('&').trim()}</span>
          )}
        </motion.p>

        {profile?.location && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1.5rem',
            }}
          >
            <MapPin size={14} style={{ color: 'var(--accent)' }} />
            {profile.location}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.02rem',
            maxWidth: '580px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.75,
          }}
        >
          {profile?.bio || 'CSE undergraduate student at KUET passionate about Machine Learning, Large Language Models (LLMs), and Computer Vision. Exploring AI research, intelligent systems, and algorithmic problem solving while building full-stack applications and developing practical software engineering skills.'}
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}
        >
          <a href="#contact" className="btn-primary">
            Let&apos;s Connect
          </a>
          <a href="#projects" className="btn-ghost">
            View My Work
          </a>
          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Download size={15} /> Resume
            </a>
          )}
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
          <SocialLinks profile={profile} />
        </div>

        <motion.a
          href="#about"
          aria-label="Scroll to About section"
          className="scroll-float-btn"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--accent)',
          }}
        >
          <ChevronDown size={19} />
        </motion.a>
      </div>
    </section>
  );
}

// ─── 2. About Me (100% Admin-Controlled) ─────────────────────────────────────
function AboutSection({ profile }) {
  const quickFacts = (profile?.quickFacts || []).filter(f => f.label && f.value);
  const rawAbout = (profile?.aboutText || profile?.bio || '').trim();
  const paragraphs = rawAbout ? rawAbout.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) : [];

  return (
    <section id="about" className="section-block section-block-alt">
      <div className="container">
        <div className="about-grid" style={quickFacts.length === 0 ? { gridTemplateColumns: '1fr' } : undefined}>
          <Reveal>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '0.75rem',
              }}
            >
              About Me
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.9rem, 3.6vw, 2.65rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              Turning ideas into{' '}
              <span style={{ color: 'var(--accent)' }}>engineered reality</span>
            </h2>
            {paragraphs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.8 }}>
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                Add your bio or About Me text from the Admin Dashboard.
              </p>
            )}
          </Reveal>

          {quickFacts.length > 0 && (
            <Reveal delay={0.12} className="card" style={{ padding: '1.75rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  marginBottom: '1.25rem',
                }}
              >
                Quick Snapshot
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {quickFacts.map((fact, idx) => (
                  <div
                    key={fact._id || `${fact.label}-${idx}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '1rem',
                      paddingBottom: idx < quickFacts.length - 1 ? '1rem' : 0,
                      borderBottom: idx < quickFacts.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{fact.label}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, textAlign: 'right' }}>{fact.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── 3. Skills & Technologies (100% Admin-Controlled) ────────────────────────
function SkillsSection({ skillCategories, skills }) {
  const groups = (skillCategories || []).filter(g => g.title || g.items?.length);
  const extra = (skills || []).filter(Boolean);

  return (
    <section id="skills" className="section-block">
      <div className="container">
        <SectionHeader
          eyebrow="Expertise"
          title="Skills & Technologies"
          subtitle="Core languages, frameworks, and ML tools I use to design and ship software."
        />

        {!groups.length && !extra.length ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            No skills added yet.
          </p>
        ) : (
          <>
            {groups.length > 0 && (
              <div className="skills-grid">
                {groups.map((group, idx) => (
                  <Reveal key={group._id || `${group.title}-${idx}`} delay={idx * 0.08} className="card" style={{ padding: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: group.subtitle ? '0.35rem' : '1.1rem' }}>{group.title}</h3>
                    {group.subtitle && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{group.subtitle}</p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem' }}>
                      {(group.items || []).map(item => (
                        <div
                          key={item}
                          style={{
                            padding: '0.6rem 0.85rem',
                            borderRadius: '10px',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{item}</span>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                        </div>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {extra.length > 0 && (
              <Reveal delay={0.12} style={{ marginTop: groups.length > 0 ? '2.5rem' : 0, textAlign: 'center' }}>
                {groups.length > 0 && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Also familiar with
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '760px', margin: '0 auto' }}>
                  {extra.map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ─── 4. Experience / Work History (Stacked Full-Width Cards) ─────────────────
function ExperienceSection({ items }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="section-block section-block-alt">
      <div className="container">
        <SectionHeader
          eyebrow="Experience"
          title="Work History"
          subtitle="Roles, leadership, and mentorship experiences across engineering and academics."
        />

        {!items?.length ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            No experience entries added yet.
          </p>
        ) : (
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.map((exp, idx) => (
              <Reveal key={exp._id} delay={idx * 0.08} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    >
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{exp.role}</h3>
                        {exp.isCurrent && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--emerald)',
                              border: '1px solid rgba(52,211,153,0.35)',
                              background: 'rgba(52,211,153,0.08)',
                              padding: '0.12rem 0.55rem',
                              borderRadius: '999px',
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--accent)', fontSize: '0.92rem', fontWeight: 500, marginTop: '0.15rem' }}>
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </div>
                    <div style={{ color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      {[exp.duration, exp.type, exp.location].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.75, marginBottom: exp.technologies?.length ? '1rem' : 0 }}>
                    {exp.description}
                  </p>
                )}

                {exp.technologies?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {exp.technologies.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 5. Projects (Featured Spotlight + 3-Col Grid) ───────────────────────────
function ProjectsSection({ items, githubUrl }) {
  const featured = items?.find(p => p.featured) || null;
  const rest = featured ? items.filter(p => p._id !== featured._id) : (items || []);

  return (
    <section id="projects" className="section-block">
      <div className="container">
        <SectionHeader
          eyebrow="Portfolio"
          title="Featured Projects"
          subtitle="Selected full-stack, desktop, and machine learning projects I have built."
        />

        {!items?.length ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            No projects added yet.
          </p>
        ) : (
          <>
            {featured && (
              <Reveal className="featured-project-card">
                <div style={{ minHeight: '260px', background: 'var(--bg-3)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {featured.thumbnail ? (
                    <img src={featured.thumbnail} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.25rem', fontWeight: 800, color: 'var(--border-strong)', letterSpacing: '-0.04em' }}>
                      {featured.title}
                    </span>
                  )}
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.6rem' }}>
                    Featured Project · {featured.category}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{featured.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                    {featured.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.5rem' }}>
                    {featured.technologies?.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    {featured.githubUrl && (
                      <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                        <GithubIcon /> Source Code
                      </a>
                    )}
                    {featured.liveUrl && (
                      <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)' }}>
                        <ExternalLink size={15} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="projects-grid">
                {rest.map((proj, idx) => (
                  <Reveal key={proj._id} delay={idx * 0.08} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '165px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                      {proj.thumbnail ? (
                        <img src={proj.thumbnail} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--border-strong)' }}>
                          {proj.title[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '1.35rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.05rem' }}>{proj.title}</h3>
                        <div style={{ display: 'flex', gap: '0.6rem', color: 'var(--text-muted)' }}>
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${proj.title} GitHub`}>
                              <GithubIcon />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${proj.title} Live`}>
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1rem', flex: 1 }}>
                        {proj.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {proj.technologies?.slice(0, 5).map(t => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        {githubUrl && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <GithubIcon /> View more on GitHub
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 6. Certificates & Achievements Slider ───────────────────────────────────
function CertificatesSlider({ items, apiBase }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const count = items?.length || 0;
  const safeIndex = count > 0 ? index % count : 0;

  useEffect(() => {
    if (count <= 1 || paused || lightbox) return undefined;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex(prev => (prev + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [count, paused, lightbox]);

  const go = (nextIdx, dir) => {
    setDirection(dir);
    setIndex((nextIdx + count) % count);
  };

  const resolveImg = (src) => {
    if (!src) return '';
    return src.startsWith('/uploads') ? `${apiBase}${src}` : src;
  };

  const current = count > 0 ? items[safeIndex] : null;

  return (
    <section id="achievements" className="section-block section-block-alt">
      <div className="container">
        <SectionHeader
          eyebrow="Achievements"
          title="Certificates & Competitions"
          subtitle="Datathons, hackathons, and verified recognitions — click any certificate to inspect in full view."
        />

        {!current ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            No certificates added yet.
          </p>
        ) : (
          <Reveal>
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              style={{ maxWidth: '1020px', margin: '0 auto' }}
            >
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current._id || safeIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 48 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -48 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="cert-slide-card"
                >
                  {/* Certificate Image */}
                  <div
                    onClick={() => current.image && setLightbox(current)}
                    role={current.image ? 'button' : undefined}
                    tabIndex={current.image ? 0 : undefined}
                    onKeyDown={e => { if (e.key === 'Enter' && current.image) setLightbox(current); }}
                    style={{
                      background: 'var(--bg-3)',
                      position: 'relative',
                      aspectRatio: '16 / 11',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: current.image ? 'zoom-in' : 'default',
                      overflow: 'hidden',
                      borderRight: '1px solid var(--border)',
                    }}
                  >
                    {current.image ? (
                      <>
                        <img
                          src={resolveImg(current.image)}
                          alt={current.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.75rem', display: 'block' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            right: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '8px',
                            background: 'rgba(9,9,11,0.78)',
                            color: '#f4f4f5',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          <Maximize2 size={12} /> Full View
                        </span>
                      </>
                    ) : (
                      <Award size={44} style={{ color: 'var(--text-dim)' }} />
                    )}
                  </div>

                  {/* Certificate Details */}
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {current.badge && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--accent)',
                              background: 'var(--accent-soft)',
                              border: '1px solid var(--accent-border)',
                              padding: '0.25rem 0.7rem',
                              borderRadius: '999px',
                            }}
                          >
                            <Award size={13} /> {current.badge}
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {String(safeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {current.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 500, marginBottom: '1rem' }}>
                        {current.issuer}
                      </p>
                      {current.description && (
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                          {current.description}
                        </p>
                      )}
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                        {[current.team, current.date].filter(Boolean).join(' · ')}
                      </div>
                      {current.credentialUrl && (
                        <a href={current.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>
                          Verify <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Controls + Centered Thumbnail Strip */}
            {count > 1 && (
              <div style={{ marginTop: '1.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <button type="button" onClick={() => go(safeIndex - 1, -1)} aria-label="Previous certificate" className="icon-btn" style={{ flexShrink: 0 }}>
                  <ChevronLeft size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', overflowX: 'auto', maxWidth: '100%' }}>
                  {items.map((item, idx) => {
                    const active = idx === safeIndex;
                    return (
                      <button
                        key={item._id || idx}
                        type="button"
                        onClick={() => go(idx, idx > safeIndex ? 1 : -1)}
                        aria-label={`View certificate ${idx + 1}: ${item.title}`}
                        style={{
                          padding: 0,
                          width: '78px',
                          height: '50px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                          opacity: active ? 1 : 0.5,
                          background: 'var(--surface)',
                          transition: 'opacity 0.2s ease, border-color 0.2s ease',
                          flexShrink: 0,
                        }}
                      >
                        {item.image ? (
                          <img src={resolveImg(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <Award size={16} />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button type="button" onClick={() => go(safeIndex + 1, 1)} aria-label="Next certificate" className="icon-btn" style={{ flexShrink: 0 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            </div>
          </Reveal>
        )}

        {/* Full-screen Lightbox */}
        {lightbox && (
          <div
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '1000px', width: '100%' }}>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close certificate preview"
                style={{
                  position: 'absolute',
                  top: '-2.75rem',
                  right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text)',
                  borderRadius: '999px',
                  width: '36px',
                  height: '36px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
              <img
                src={resolveImg(lightbox.image)}
                alt={lightbox.title}
                style={{ width: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '12px', display: 'block', background: '#fff' }}
              />
              <p style={{ textAlign: 'center', color: '#e4e4e7', marginTop: '0.85rem', fontSize: '0.9rem', fontWeight: 500 }}>
                {lightbox.title} — {lightbox.issuer}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 7. Education & Qualifications (Scroll-Lit Curvy Spiral Timeline) ────────
function EducationSection({ items }) {
  const timelineRef = useRef(null);
  const pathRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({ w: 860, h: 600 });
  const [totalLen, setTotalLen] = useState(1000);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return undefined;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDims({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  const { w, h } = dims;
  const mid = w / 2;
  const amp = Math.min(95, w * 0.14);

  const curvePath = items?.length
    ? `M ${mid} 0 ${items.map((_, i) => {
        const y = ((i + 0.5) / items.length) * h;
        const x = i % 2 === 0 ? mid - amp : mid + amp;
        const cx = i % 2 === 0 ? mid + amp : mid - amp;
        const prevY = i === 0 ? 0 : ((i - 0.5) / items.length) * h;
        const cy = (prevY + y) / 2;
        return `Q ${cx} ${cy} ${x} ${y}`;
      }).join(' ')} Q ${mid} ${h - 24} ${mid} ${h}`
    : '';

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) setTotalLen(len);
    }
  }, [curvePath]);

  useEffect(() => {
    const updateProgress = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.78;
      const end = vh * 0.82 - rect.height;
      const denom = start - end;
      const raw = denom > 0 ? (start - rect.top) / denom : 1;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [items, dims]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt(e.target.dataset.idx, 10);
          setActiveIdx(prev => Math.max(prev, idx));
        }
      }),
      { threshold: 0.3 }
    );
    const nodes = timelineRef.current?.querySelectorAll('[data-idx]');
    nodes?.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, [items]);

  const dashOffset = totalLen * (1 - progress);

  return (
    <section id="education" className="section-block">
      <div className="container">
        <SectionHeader
          eyebrow="Background"
          title="Education & Qualifications"
          subtitle="Academic foundation in Computer Science and Engineering."
        />

        {!items?.length ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            No education entries added yet.
          </p>
        ) : (
          <div ref={timelineRef} style={{ position: 'relative', maxWidth: '860px', margin: '0 auto', padding: '1rem 0' }}>
            {/* Curvy Spiral SVG path — 1:1 pixel coordinate space so lighting reaches 100% end */}
            <svg
              className="edu-spine"
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              <defs>
                <linearGradient id="spiralLitGrad" x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#63b3ed" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>

              {/* Base dim dashed guide curve */}
              <path
                d={curvePath}
                stroke="rgba(99, 179, 237, 0.18)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="5 6"
              />

              {/* Soft outer glow trail */}
              <path
                d={curvePath}
                stroke="url(#spiralLitGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                opacity="0.28"
                strokeDasharray={totalLen}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.08s linear' }}
              />

              {/* Bright scroll-lit core curve */}
              <path
                ref={pathRef}
                d={curvePath}
                stroke="url(#spiralLitGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={totalLen}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.08s linear' }}
              />
            </svg>

            {items.map((edu, i) => {
              const isLeft = i % 2 === 0;
              const isActive = activeIdx >= i;
              const isOngoing = /present|ongoing/i.test(edu.endYear || '');
              return (
                <div
                  key={edu._id}
                  data-idx={i}
                  className="edu-item"
                  style={{
                    display: 'flex',
                    justifyContent: isLeft ? 'flex-start' : 'flex-end',
                    paddingLeft: isLeft ? 0 : '50%',
                    paddingRight: isLeft ? '50%' : 0,
                    marginBottom: i < items.length - 1 ? '3rem' : 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Reveal
                    delay={i * 0.08}
                    className="card edu-card"
                    style={{
                      width: '100%',
                      maxWidth: '370px',
                      padding: '1.5rem',
                      margin: isLeft ? '0 1.75rem 0 0' : '0 0 0 1.75rem',
                      borderColor: isActive ? 'rgba(99,179,237,0.38)' : 'var(--border)',
                      boxShadow: isActive ? '0 0 32px rgba(99,179,237,0.1)' : 'none',
                      transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)' }}>
                        <GraduationCap size={14} /> {edu.startYear} — {edu.endYear}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          background: isOngoing ? 'var(--accent-soft)' : 'var(--surface-2)',
                          border: `1px solid ${isOngoing ? 'var(--accent-border)' : 'var(--border)'}`,
                          color: isOngoing ? 'var(--accent)' : 'var(--text-muted)',
                        }}
                      >
                        {edu.grade || (isOngoing ? 'Ongoing' : 'Completed')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>{edu.degree}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 500, marginBottom: '0.45rem' }}>
                      {edu.institution}
                    </p>
                    {edu.field && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: edu.description ? '0.5rem' : 0 }}>
                        {edu.field}
                      </p>
                    )}
                    {edu.description && (
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                        {edu.description}
                      </p>
                    )}
                  </Reveal>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 8. Contact Section (2-Column Split) ─────────────────────────────────────
function ContactSection({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const to = profile?.email || 'ariyanspandan@gmail.com';
    const subject = encodeURIComponent(form.subject || `Portfolio Inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="section-block section-block-alt">
      <div className="container">
        <SectionHeader
          eyebrow="Contact"
          title="Let's Work Together"
          subtitle="Have a project, collaboration, or research idea in mind? Send a message directly."
        />

        <div className="contact-grid" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <Reveal>
            <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="admin-label" htmlFor="c-name">Name</label>
                <input id="c-name" required className="admin-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label className="admin-label" htmlFor="c-email">Email</label>
                <input id="c-email" type="email" required className="admin-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="admin-label" htmlFor="c-subject">Subject</label>
              <input id="c-subject" required className="admin-input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Project / Collaboration" />
            </div>
            <div>
              <label className="admin-label" htmlFor="c-message">Message</label>
              <textarea id="c-message" rows={4} required className="admin-input" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell me about what you're building..." style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn-primary">
                <Send size={15} /> Send Message
              </button>
              {sent && <span style={{ fontSize: '0.84rem', color: 'var(--emerald)' }}>Opening your email client...</span>}
            </div>
            </form>
          </Reveal>

          <Reveal delay={0.12} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                Get in Touch
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem' }}>
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text)' }}>
                    <Mail size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{profile.email}</span>
                  </a>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                  <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span>{profile?.location || 'Khulna, Bangladesh'}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                Follow Me
              </p>
              <SocialLinks profile={profile} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 9. Updated Footer (3-Column + Divider + Bottom Bar) ─────────────────────
function Footer({ profile }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const quickLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer style={{ position: 'relative', zIndex: 1, background: 'var(--bg-2)', borderTop: '1px solid var(--border)', paddingTop: '4.5rem', paddingBottom: '2.25rem' }}>
      <div className="container">
        <div className="footer-grid" style={{ marginBottom: '3rem' }}>
          {/* Column 1: Brand & Bio */}
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              {profile?.name || 'Ariyan Aftab'}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.75, maxWidth: '360px', marginBottom: '1.25rem' }}>
              {profile?.bio
                ? `${profile.bio.slice(0, 145)}${profile.bio.length > 145 ? '...' : ''}`
                : 'CSE undergraduate at KUET crafting full-stack web apps and exploring machine learning.'}
            </p>
            <SocialLinks profile={profile} size="sm" />
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {quickLinks.map(link => (
                <li key={link.id}>
                  <a href={`#${link.id}`} style={{ transition: 'color 0.2s ease' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Get in Touch */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {profile?.email && (
                <a href={`mailto:${profile.email}`} style={{ color: 'var(--text)', wordBreak: 'break-word' }}>
                  {profile.email}
                </a>
              )}
              <span>{profile?.location || 'Khulna, Bangladesh'}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.84rem',
            color: 'var(--text-dim)',
          }}
        >
          <span>© {new Date().getFullYear()} {profile?.name || 'Ariyan Aftab'}. All rights reserved.</span>

          <button
            type="button"
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
            }}
          >
            <span>Back to top</span>
            <span
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Portfolio ──────────────────────────────────────────────────────────
const CACHE_KEY = 'portfolio_cache_v1';

function readCachedPortfolio() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Portfolio() {
  const cached = readCachedPortfolio();
  const [profile, setProfile] = useState(() => cached?.profile || null);
  const [education, setEducation] = useState(() => cached?.education || []);
  const [experience, setExperience] = useState(() => cached?.experience || []);
  const [projects, setProjects] = useState(() => cached?.projects || []);
  const [certificates, setCertificates] = useState(() => cached?.certificates || []);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    api.get('/portfolio').then(res => {
      const data = res.data || {};
      setProfile(data.profile || null);
      setEducation(data.education || []);
      setExperience(data.experience || []);
      setProjects(data.projects || []);
      setCertificates(data.certificates || []);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        // Ignore storage quota errors
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.id);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  const name = profile?.name || 'Ariyan Aftab';
  const title = profile?.title || 'Full-Stack Developer & ML Enthusiast';
  const description = `${name} portfolio - ${title}. ${profile?.bio?.substring(0, 150) || 'Explore projects, education, experience, certificates, and software engineering work by Ariyan Aftab.'}`;
  const keywords = profile?.seoKeywords || 'Ariyan Aftab, Ariyan Aftab portfolio, Ariyan Aftab developer, KUET CSE, full-stack developer Bangladesh, ML enthusiast, React developer, Node.js developer';
  const imageUrl = profile?.photo
    ? (profile.photo.startsWith('/uploads') ? `${apiBase || siteUrl}${profile.photo}` : profile.photo)
    : `${siteUrl}/favicon.svg`;
  const sameAs = [profile?.github, profile?.linkedin, profile?.twitter, profile?.facebook].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{name} — Portfolio | {title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={name} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:title" content={`${name} — Portfolio`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:site_name" content={`${name} Portfolio`} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${name} — Portfolio`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name,
          jobTitle: title,
          description: profile?.bio || description,
          url: `${siteUrl}/`,
          image: imageUrl,
          sameAs,
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'Khulna University of Engineering & Technology' },
          address: { '@type': 'PostalAddress', addressLocality: profile?.location || 'Khulna, Bangladesh' },
        })}</script>
      </Helmet>

      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <Starfield visible={theme === 'dark'} />
        <Navbar
          profile={profile}
          activeSection={activeSection}
          theme={theme}
          toggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        />

        <main style={{ position: 'relative', zIndex: 1 }}>
          <Hero profile={profile} apiBase={apiBase} />
          <AboutSection profile={profile} />
          <SkillsSection skillCategories={profile?.skillCategories} skills={profile?.skills} />
          <ExperienceSection items={experience} />
          <ProjectsSection items={projects} githubUrl={profile?.github} />
          <CertificatesSlider items={certificates} apiBase={apiBase} />
          <EducationSection items={education} />
          <ContactSection profile={profile} />
        </main>

        <Footer profile={profile} />
      </div>
    </>
  );
}
