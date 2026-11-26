import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowUp, ChevronLeft, ChevronRight, ChevronDown,
  Sun, Moon, Menu, X, Maximize2, Send
} from 'lucide-react';
import api from '../utils/api';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const normalizeUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

// ─── Navbar (Quiet Editorial Bar + Mobile Slide-Out Drawer) ──────────────────
function Navbar({ profile, navItems, activeSection, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
          backdropFilter: scrolled || drawerOpen ? 'blur(12px)' : 'none',
          borderBottom: scrolled || drawerOpen ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          <a
            href="#home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontWeight: 600,
              fontSize: '0.96rem',
              letterSpacing: '-0.02em',
            }}
          >
            <img
              src="/logo.png"
              alt={brand}
              style={{
                height: '18px',
                width: 'auto',
                display: 'block',
                filter: theme === 'light' ? 'invert(1)' : 'none',
              }}
            />
            <span>{brand}</span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <nav
              className="desktop-only-nav"
              aria-label="Primary Navigation"
              style={{ display: 'flex', alignItems: 'center', gap: '1.45rem', fontSize: '0.84rem' }}
            >
              {navItems.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    style={{
                      color: isActive ? 'var(--text)' : 'var(--text-muted)',
                      fontWeight: isActive ? 500 : 400,
                      transition: 'color 0.18s ease',
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
                className="icon-btn"
                style={{ width: '34px', height: '34px' }}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <button
                type="button"
                className="mobile-menu-btn icon-btn"
                onClick={() => setDrawerOpen(o => !o)}
                aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={drawerOpen}
                style={{ width: '34px', height: '34px', color: 'var(--text)' }}
              >
                {drawerOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(0,0,0,0.55)' }}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              aria-label="Mobile Navigation"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(270px, 80vw)',
                zIndex: 150,
                background: 'var(--bg)',
                borderLeft: '1px solid var(--border)',
                padding: '1.25rem 1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{brand}</span>
                  <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="icon-btn" style={{ width: '32px', height: '32px' }}>
                    <X size={15} />
                  </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {navItems.map(item => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          padding: '0.7rem 0.5rem',
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--text)' : 'var(--text-muted)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {profile?.resumeUrl && (
                <a href={normalizeUrl(profile.resumeUrl)} target="_blank" rel="noopener noreferrer" onClick={() => setDrawerOpen(false)} className="btn-primary" style={{ width: '100%' }}>
                  Resume <ArrowUpRight size={14} />
                </a>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── 1. Asymmetric Editorial Hero ────────────────────────────────────────────
function Hero({ profile, apiBase }) {
  const photoSrc = profile?.photo
    ? (profile.photo.startsWith('/uploads') ? `${apiBase}${profile.photo}` : profile.photo)
    : null;

  const socialLinks = [
    { label: 'GitHub', href: normalizeUrl(profile?.github) },
    { label: 'LinkedIn', href: normalizeUrl(profile?.linkedin) },
    { label: 'Twitter', href: normalizeUrl(profile?.twitter) },
    { label: 'Facebook', href: normalizeUrl(profile?.facebook) },
  ].filter(s => Boolean(s.href));

  return (
    <section id="home" style={{ paddingTop: '8.5rem', paddingBottom: '5.5rem' }}>
      <div className="container">
        <div className="hero-split">
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
              {profile?.title || 'Full-Stack Developer & ML Enthusiast'}
            </p>

            <h1 style={{ fontSize: 'clamp(3.1rem, 7vw, 5.25rem)', marginBottom: '1.5rem' }}>
              {profile?.name || 'Ariyan Aftab'}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.75, maxWidth: '56ch', marginBottom: '2.25rem' }}>
              {profile?.bio || 'CSE undergraduate student at KUET passionate about Machine Learning, Large Language Models (LLMs), and Computer Vision.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <a href="#contact" className="btn-primary">
                Get in touch
              </a>
              <a href="#projects" className="btn-ghost">
                Selected work
              </a>
              {profile?.resumeUrl && (
                <a href={normalizeUrl(profile.resumeUrl)} target="_blank" rel="noopener noreferrer" className="text-link">
                  Resume <ArrowUpRight size={14} />
                </a>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', flexWrap: 'wrap' }}>
                {socialLinks.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    {s.label} <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {photoSrc && (
            <div className="hero-portrait-wrap" style={{ justifySelf: 'end', width: '100%', maxWidth: '300px' }}>
              <div
                style={{
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-3)',
                }}
              >
                <img
                  src={photoSrc}
                  alt={profile?.name || 'Ariyan Aftab'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '4rem' }}>
          <motion.a
            href="#about"
            aria-label="Scroll down"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
            }}
          >
            <ChevronDown size={16} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

// ─── 2. About ────────────────────────────────────────────────────────────────
function AboutSection({ profile }) {
  const quickFacts = (profile?.quickFacts || []).filter(f => f.label && f.value);
  const rawAbout = (profile?.aboutText || '').trim();
  const paragraphs = rawAbout ? rawAbout.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) : [];
  if (!paragraphs.length && !quickFacts.length) return null;

  return (
    <section id="about" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">About</div>

          <div>
            {paragraphs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.8, maxWidth: '64ch', marginBottom: quickFacts.length ? '2.75rem' : 0 }}>
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {quickFacts.length > 0 && (
              <div className="snapshot-grid" style={{ paddingTop: '1.75rem', borderTop: '1px solid var(--border)' }}>
                {quickFacts.map((fact, idx) => (
                  <div key={fact._id || `${fact.label}-${idx}`}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
                      {fact.label}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text)' }}>
                      {fact.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Skills (Tabular Monochrome Matrix) ───────────────────────────────────
function SkillsSection({ skillCategories, skills }) {
  const groups = (skillCategories || []).filter(g => g.title || g.items?.length);
  const extra = (skills || []).filter(Boolean);
  if (!groups.length && !extra.length) return null;

  return (
    <section id="skills" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">Skills</div>

          <div style={{ borderTop: '1px solid var(--border)' }}>
            {groups.map((group, idx) => (
              <div key={group._id || `${group.title}-${idx}`} className="skills-table-row">
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)' }}>{group.title}</div>
                  {group.subtitle && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                      {group.subtitle}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {(group.items || []).join('  /  ')}
                </div>
              </div>
            ))}

            {extra.length > 0 && (
              <div className="skills-table-row">
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)' }}>Also familiar with</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {extra.join('  /  ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. Experience ───────────────────────────────────────────────────────────
function ExperienceSection({ items }) {
  if (!items?.length) return null;

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">Experience</div>

          <div style={{ borderTop: '1px solid var(--border)' }}>
            {items.map(exp => (
              <div key={exp._id} style={{ padding: '1.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.45rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{exp.role}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    {exp.duration ? ` (${exp.duration})` : ''}
                  </div>
                </div>

                {exp.description && (
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '64ch', marginTop: '0.6rem' }}>
                    {exp.description}
                  </p>
                )}

                {exp.technologies?.length > 0 && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
                    {exp.technologies.join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Selected Work / Projects ─────────────────────────────────────────────
function ProjectsSection({ items }) {
  if (!items?.length) return null;

  const featured = items.find(p => p.featured) || null;
  const rest = featured ? items.filter(p => p._id !== featured._id) : items;

  const renderProjectImage = (proj, pad = '0.5rem') => (
    <div
      style={{
        aspectRatio: '16 / 10',
        width: '100%',
        background: 'var(--bg-3)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: proj.thumbnail ? pad : 0,
        marginBottom: '1rem',
      }}
    >
      {proj.thumbnail ? (
        <img
          src={proj.thumbnail}
          alt={proj.title}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text-dim)' }}>
          {proj.title}
        </span>
      )}
    </div>
  );

  return (
    <section id="projects" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">Selected Work</div>

          <div>
            {featured && (
              <article style={{ paddingBottom: '2.75rem', marginBottom: rest.length ? '2.75rem' : 0, borderBottom: rest.length ? '1px solid var(--border)' : 'none' }}>
                {renderProjectImage(featured, '0.75rem')}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 600 }}>{featured.title}</h3>
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    {featured.liveUrl && (
                      <a href={normalizeUrl(featured.liveUrl)} target="_blank" rel="noopener noreferrer" className="text-link">
                        Live <ArrowUpRight size={14} />
                      </a>
                    )}
                    {featured.githubUrl && (
                      <a href={normalizeUrl(featured.githubUrl)} target="_blank" rel="noopener noreferrer" className="text-link">
                        Code <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.75, maxWidth: '64ch', marginBottom: '0.85rem' }}>
                  {featured.description}
                </p>
                {featured.technologies?.length > 0 && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                    {featured.technologies.join(' / ')}
                  </p>
                )}
              </article>
            )}

            {rest.length > 0 && (
              <div className="projects-editorial-grid">
                {rest.map(proj => (
                  <article key={proj._id} style={{ display: 'flex', flexDirection: 'column' }}>
                    {renderProjectImage(proj, '0.45rem')}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.45rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{proj.title}</h3>
                      <div style={{ display: 'flex', gap: '0.9rem', flexShrink: 0 }}>
                        {proj.liveUrl && (
                          <a href={normalizeUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: '0.82rem' }}>
                            Live <ArrowUpRight size={13} />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={normalizeUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: '0.82rem' }}>
                            Code <ArrowUpRight size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '0.7rem', flex: 1 }}>
                      {proj.description}
                    </p>
                    {proj.technologies?.length > 0 && (
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        {proj.technologies.slice(0, 5).join(' / ')}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. Achievements & Certificates Gallery Slider ───────────────────────────
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
    }, 5500);
    return () => clearInterval(timer);
  }, [count, paused, lightbox]);

  if (!count) return null;

  const go = (nextIdx, dir) => {
    setDirection(dir);
    setIndex((nextIdx + count) % count);
  };

  const resolveImg = (src) => {
    if (!src) return '';
    return src.startsWith('/uploads') ? `${apiBase}${src}` : src;
  };

  const current = items[safeIndex];

  return (
    <section id="achievements" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">Achievements</div>

          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div style={{ overflow: 'hidden' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current._id || safeIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -32 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.image && (
                    <div
                      onClick={() => setLightbox(current)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') setLightbox(current); }}
                      style={{
                        position: 'relative',
                        aspectRatio: '16 / 10',
                        background: 'var(--bg-3)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        padding: '0.75rem',
                        cursor: 'zoom-in',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <img
                        src={resolveImg(current.image)}
                        alt={current.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.75rem',
                          right: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.28rem 0.6rem',
                          borderRadius: '4px',
                          background: 'rgba(10,10,11,0.82)',
                          color: '#f3f3f1',
                          fontSize: '0.72rem',
                        }}
                      >
                        <Maximize2 size={12} /> Full view
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{current.title}</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                      {String(safeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    {[current.badge, current.issuer, current.team, current.date].filter(Boolean).join(' · ')}
                  </p>

                  {current.description && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '64ch' }}>
                      {current.description}
                    </p>
                  )}

                  {current.credentialUrl && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <a href={normalizeUrl(current.credentialUrl)} target="_blank" rel="noopener noreferrer" className="text-link">
                        Verify credential <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {count > 1 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem' }}>
                <button type="button" onClick={() => go(safeIndex - 1, -1)} aria-label="Previous certificate" className="icon-btn" style={{ flexShrink: 0 }}>
                  <ChevronLeft size={17} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', overflowX: 'auto' }}>
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
                          width: '72px',
                          height: '46px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: active ? '2px solid var(--text)' : '1px solid var(--border)',
                          opacity: active ? 1 : 0.45,
                          background: 'var(--bg-3)',
                          transition: 'opacity 0.2s ease, border-color 0.2s ease',
                          flexShrink: 0,
                        }}
                      >
                        {item.image && (
                          <img src={resolveImg(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button type="button" onClick={() => go(safeIndex + 1, 1)} aria-label="Next certificate" className="icon-btn" style={{ flexShrink: 0 }}>
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.9)',
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
              aria-label="Close preview"
              className="icon-btn"
              style={{ position: 'absolute', top: '-2.75rem', right: 0, background: 'var(--surface)', color: 'var(--text)' }}
            >
              <X size={16} />
            </button>
            <img
              src={resolveImg(lightbox.image)}
              alt={lightbox.title}
              style={{ width: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '4px', display: 'block', background: '#fff' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── 7. Education (Monochrome Scroll-Lit Curvy Timeline) ─────────────────────
function EducationSection({ items }) {
  const timelineRef = useRef(null);
  const pathRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({ w: 800, h: 560 });
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
  const amp = Math.min(84, w * 0.12);

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

  if (!items?.length) return null;

  const dashOffset = totalLen * (1 - progress);

  return (
    <section id="education" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">Education</div>

          <div ref={timelineRef} style={{ position: 'relative', padding: '0.5rem 0' }}>
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
              <path
                d={curvePath}
                stroke="var(--border-strong)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 6"
              />
              <path
                ref={pathRef}
                d={curvePath}
                stroke="var(--text)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={totalLen}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.08s linear' }}
              />
            </svg>

            {items.map((edu, i) => {
              const isLeft = i % 2 === 0;
              const isOngoing = /present|ongoing/i.test(edu.endYear || '');
              return (
                <div
                  key={edu._id}
                  className="edu-item"
                  style={{
                    display: 'flex',
                    justifyContent: isLeft ? 'flex-start' : 'flex-end',
                    paddingLeft: isLeft ? 0 : '50%',
                    paddingRight: isLeft ? '50%' : 0,
                    marginBottom: i < items.length - 1 ? '2.5rem' : 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    className="card edu-card"
                    style={{
                      width: '100%',
                      maxWidth: '360px',
                      padding: '1.35rem',
                      margin: isLeft ? '0 1.5rem 0 0' : '0 0 0 1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      <span>{edu.startYear} — {edu.endYear}</span>
                      <span>{edu.grade || (isOngoing ? 'Ongoing' : '')}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{edu.degree}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: edu.description ? '0.5rem' : 0 }}>
                      {edu.institution}
                    </p>
                    {edu.description && (
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. Contact ──────────────────────────────────────────────────────────────
function ContactSection({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await api.post('/messages', form);
      setForm({ name: '', email: '', subject: '', message: '' });
      setStatus({ type: 'success', text: "Message sent. I'll get back to you soon." });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="swiss-section">
      <div className="container">
        <div className="swiss-grid">
          <div className="swiss-label">Contact</div>

          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '54ch', marginBottom: '1.75rem' }}>
              Have a project, research collaboration, or engineering role in mind? Send a message directly or write to{' '}
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} className="text-link">{profile.email}</a>
              ) : 'me'}.
              {profile?.location ? ` Based in ${profile.location}.` : ''}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
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
                <input id="c-subject" required className="admin-input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Project or inquiry" />
              </div>
              <div>
                <label className="admin-label" htmlFor="c-message">Message</label>
                <textarea id="c-message" rows={4} required className="admin-input" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your message..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <button type="submit" className="btn-primary" disabled={sending}>
                  <Send size={14} /> {sending ? 'Sending...' : 'Send message'}
                </button>
                {status && (
                  <span style={{ fontSize: '0.85rem', color: status.type === 'error' ? '#f87171' : 'var(--emerald)' }}>
                    {status.text}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 9. Footer ───────────────────────────────────────────────────────────────
function Footer({ profile }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-dim)',
        }}
      >
        <span>© {new Date().getFullYear()} {profile?.name || 'Ariyan Aftab'}</span>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
          }}
        >
          <span>Top</span>
          <ArrowUp size={14} />
        </button>
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
  const [activeSection, setActiveSection] = useState('about');
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

    try {
      if (!sessionStorage.getItem('portfolio_visit_logged')) {
        let visitorId = localStorage.getItem('portfolio_vid');
        if (!visitorId) {
          visitorId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
          localStorage.setItem('portfolio_vid', visitorId);
        }
        sessionStorage.setItem('portfolio_visit_logged', '1');
        api.post('/analytics/visit', { visitorId }).catch(() => {});
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const hasAbout = Boolean((profile?.aboutText || '').trim() || (profile?.quickFacts || []).some(f => f.label && f.value));
  const hasSkills = Boolean((profile?.skillCategories || []).some(g => g.title || g.items?.length) || (profile?.skills || []).filter(Boolean).length);
  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (item.id === 'about') return hasAbout;
    if (item.id === 'skills') return hasSkills;
    if (item.id === 'experience') return experience.length > 0;
    if (item.id === 'projects') return projects.length > 0;
    if (item.id === 'achievements') return certificates.length > 0;
    if (item.id === 'education') return education.length > 0;
    return true;
  });

  useEffect(() => {
    const ids = visibleNavItems.map(n => n.id);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [hasAbout, hasSkills, experience.length, projects.length, certificates.length, education.length]);

  const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  const name = profile?.name || 'Ariyan Aftab';
  const title = profile?.title || 'Full-Stack Developer & ML Enthusiast';
  const description = `${name} portfolio - ${title}. ${profile?.bio?.substring(0, 150) || ''}`;
  const keywords = profile?.seoKeywords || 'Ariyan Aftab, Ariyan Aftab portfolio, KUET CSE, full-stack developer, machine learning';
  const imageUrl = profile?.photo
    ? (profile.photo.startsWith('/uploads') ? `${apiBase || siteUrl}${profile.photo}` : profile.photo)
    : `${siteUrl}/favicon.png`;
  const sameAs = [profile?.github, profile?.linkedin, profile?.twitter, profile?.facebook].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{name} — {title}</title>
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

      <div style={{ minHeight: '100vh' }}>
        <Navbar
          profile={profile}
          navItems={visibleNavItems}
          activeSection={activeSection}
          theme={theme}
          toggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        />

        <main>
          <Hero profile={profile} apiBase={apiBase} />
          {hasAbout && <AboutSection profile={profile} />}
          {hasSkills && <SkillsSection skillCategories={profile?.skillCategories} skills={profile?.skills} />}
          {experience.length > 0 && <ExperienceSection items={experience} />}
          {projects.length > 0 && <ProjectsSection items={projects} />}
          {certificates.length > 0 && <CertificatesSlider items={certificates} apiBase={apiBase} />}
          {education.length > 0 && <EducationSection items={education} />}
          <ContactSection profile={profile} />
        </main>

        <Footer profile={profile} />
      </div>
    </>
  );
}
