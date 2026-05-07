/**
 * ProcessSection.jsx — Complete self-contained component
 * Drop this file into your project.
 * Replace the img src values with your actual asset imports, e.g.:
 *   import img1 from '@/assets/process/step1.webp';
 *   then use  img: img1  in the STEPS array.
 */
 
import React from 'react';
import moroccoMap from '@/assets/ProcessSction/maroc-outline.webp';
import moroccoStamp from '@/assets/ProcessSction/moroccoBadge.webp';
import stepIconsSprite from '@/assets/ProcessSction/processus-steps-icons.webp';
import processCenterLine from '@/assets/ProcessSction/processLine.webp';
import processPic1 from '@/assets/processus-pic1.webp';
import processPic2 from '@/assets/processus-pic2.webp';
import processPic3 from '@/assets/processus-pic3.webp';
import processPic4 from '@/assets/processus-pic4.webp';

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    id: 1,
    title: 'Création du profil',
    desc: "Complète ton profil en quelques minutes : expériences, centres d'intérêt, personnalité et CV. Plus ton profil est complet, plus les opportunités te correspondent.",
    img: processPic3,
  },
  {
    id: 2,
    title: 'Choisis ton pack',
    desc: "Sélectionne le pack qui te correspond : Economic, Business ou First Class. Compare les options et choisis l'accompagnement qui te convient le mieux.",
    img: processPic1,
  },
  {
    id: 3,
    title: 'Matching avec les entreprises',
    desc: "Nous analysons ton profil et te proposons 3 entreprises qui matchent avec tes envies, tes compétences et tes objectifs.",
    img: processPic2,
  },
  {
    id: 4,
    title: 'Prise de contact',
    desc: "Tu choisis l'entreprise qui t'intéresse le plus. On organise alors un échange pour apprendre à te connaître et valider l'opportunité ensemble.",
    img: processPic4,
  },
  {
    id: 5,
    title: 'Organisation du départ',
    desc: "On s'occupe de tout : logement, transfert aéroport, accompagnement et conseils pratiques pour partir l'esprit tranquille.",
    img: processPic1,
  },
  {
    id: 6,
    title: 'Intégration sur place',
    desc: "Arrive dans les meilleures conditions, découvre ta nouvelle vie et rejoins la communauté Boardi pour ne jamais être seul(e).",
    img: processPic2,
  },
];

// Rows: each row has a left step, a centre icon, and a right step
const ROWS = [
  { left: STEPS[0], right: STEPS[1], icon: <SpriteIcon variant="search" label="Matching" /> },
  { left: STEPS[2], right: STEPS[3], icon: <SpriteIcon variant="chat" label="Contact" /> },
  { left: STEPS[4], right: STEPS[5], icon: <SpriteIcon variant="bag" label="Voyage" /> },
];

/* ─── Icons (sprite-cropped from processus-steps-icons.webp) ─────────────────── */

// Sprite is a 3-col × 2-row grid:
//   row 0: profile, suitcase, magnifier-people
//   row 1: chat, suitcase+plane, heart-people
const SPRITE_POS = {
  profile: '0% 0%',
  bag:     '50% 0%',
  search:  '100% 0%',
  chat:    '0% 100%',
  plane:   '50% 100%',
  heart:   '100% 100%',
};

function SpriteIcon({ variant, label }) {
  return (
    <span
      className="ps-sprite-icon"
      role="img"
      aria-label={label}
      style={{ backgroundPosition: SPRITE_POS[variant] || '0% 0%' }}
    />
  );
}
function IconSparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2b65e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2b65e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
 
/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function StepCard({ step }) {
  return (
    <div className="ps-panel">
      <div className="ps-panel-header">
        <div className="ps-badge">{step.id}</div>
        <h3 className="ps-title">{step.title}</h3>
      </div>
      <p className="ps-desc">{step.desc}</p>
    </div>
  );
}
 
function StepImage({ src, alt, side }) {
  return (
    <div className={`ps-media ps-media-${side}`}>
      <div className="ps-img-shell">
        <img src={src} alt={alt} className="ps-img" loading="lazy" decoding="async" />
      </div>
    </div>
  );
}
 
/* ─── Main Component ─────────────────────────────────────────────────────────── */
 
export default function ProcessSection() {
  return (
    <>
      <style>{CSS}</style>
 
      <section className="ps-section" id="processus" aria-labelledby="processus-title">
 
        {/* ── Decorative blobs bg ── */}
        <div className="ps-blob-bg" aria-hidden="true" />
        <img src={moroccoStamp} alt="" className="ps-morocco-stamp" loading="lazy" decoding="async" aria-hidden="true" />
        <img src={moroccoMap} alt="" className="ps-morocco-map" loading="lazy" decoding="async" aria-hidden="true" />

        <div className="ps-container">
 
          {/* ── Header ── */}
          <div className="ps-header">
            <span className="ps-kicker">Processus</span>
            <h2 id="processus-title" className="ps-heading">
              De ton profil à ton intégration sur place
            </h2>
            <p className="ps-subtitle">
              Un parcours clair, humain et structuré pour t'aider à trouver
              ton stage à l'étranger, avec un accompagnement concret à chaque étape.
            </p>
          </div>
 
          {/* ── Steps ── */}
          <div className="ps-steps">
            <img
              src={processCenterLine}
              alt=""
              className="ps-path-line"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            {ROWS.map((row, i) => (
              <div key={i} className="ps-row">

                {/* Left pair: image + card */}
                <div className="ps-pair ps-pair-left">
                  <StepImage src={row.left.img} alt={row.left.title} side="left" />
                  <StepCard step={row.left} />
                </div>

                {/* Centre connector */}
                <div className="ps-centre">
                  <div className="ps-centre-icon">{row.icon}</div>
                </div>

                {/* Right pair: card + image */}
                <div className="ps-pair ps-pair-right">
                  <StepCard step={row.right} />
                  <StepImage src={row.right.img} alt={row.right.title} side="right" />
                </div>

              </div>
            ))}
          </div>
 
          {/* ── Footer pill ── */}
          <div className="ps-footer-pill">
            <IconSparkle />
            <p>Un accompagnement humain, du premier clic jusqu'à ton intégration.</p>
            <IconHeart />
          </div>
 
        </div>
      </section>
    </>
  );
}
 
/* ─── Styles ─────────────────────────────────────────────────────────────────── */
 
const CSS = `
  /* Google Fonts – loaded via @import (add to your index.html if already not there) */
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
 
  /* ── Section shell ── */
  .ps-section {
    position: relative;
    overflow: hidden;
    padding: 64px 0 72px;
    background: #f5ecda;
    font-family: 'Outfit', 'Segoe UI', sans-serif;
  }
 
  /* ── Blob background ── */
  .ps-blob-bg {
    pointer-events: none;
    position: absolute;
    inset: 110px 0 auto 0;
    width: 100%;
    height: 520px;
    background: radial-gradient(ellipse 60% 40% at 20% 40%, rgba(180,200,245,0.28) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 80% 60%, rgba(210,190,155,0.22) 0%, transparent 70%);
    mix-blend-mode: multiply;
    opacity: 0.7;
  }

  /* Top-left circular postmark */
  .ps-morocco-stamp {
    pointer-events: none;
    position: absolute;
    top: 24px;
    left: 24px;
    width: clamp(120px, 12vw, 170px);
    height: auto;
    z-index: 1;
    user-select: none;
    object-fit: contain;
    background: transparent;
    mix-blend-mode: multiply;
    opacity: 0.85;
    transform: rotate(-6deg);
  }

  /* Top-right Morocco country outline */
  .ps-morocco-map {
    pointer-events: none;
    position: absolute;
    top: 18px;
    right: 18px;
    width: clamp(150px, 16vw, 220px);
    height: auto;
    z-index: 1;
    user-select: none;
    object-fit: contain;
    background: transparent;
    mix-blend-mode: multiply;
    opacity: 0.9;
  }
 
  /* ── Container ── */
  .ps-container {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }
 
  /* ── Header ── */
  .ps-header {
    text-align: center;
    margin-bottom: 32px;
  }
 
  .ps-kicker {
    display: inline-block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #1f56cb;
    margin-bottom: 14px;
  }
 
  .ps-heading {
    margin: 0 auto 16px;
    max-width: 980px;
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: clamp(2.25rem, 4.8vw, 4rem);
    font-weight: 700;
    line-height: 1.08;
    color: #06143a;
    letter-spacing: -0.01em;
  }
 
  .ps-subtitle {
    margin: 0 auto;
    max-width: 640px;
    font-size: clamp(1rem, 1.35vw, 1.1rem);
    line-height: 1.65;
    color: #4e5a6d;
  }
 
  /* ── Steps grid ── */
  .ps-steps {
    position: relative;
    display: grid;
    gap: 16px;
  }

  /* Centre serpentine dotted path (decorative image spanning all rows) */
  .ps-path-line {
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: -24px;
    bottom: -24px;
    transform: translateX(-50%);
    height: calc(100% + 48px);
    width: auto;
    max-width: 220px;
    object-fit: contain;
    z-index: 0;
    opacity: 0.85;
    user-select: none;
  }
 
  /* ── Single row ── */
  .ps-row {
    display: grid;
    grid-template-columns: 1fr 76px 1fr;
    align-items: center;
    gap: 0;
  }
 
  /* ── Card + image pair ── */
  .ps-pair {
    display: grid;
    align-items: center;
    gap: 12px;
  }
 
  .ps-pair-left {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
  }
 
  .ps-pair-right {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
  }
 
  /* ── Image shell ── */
  .ps-media {
    position: relative;
  }
 
  /* Side accent bar behind image */
  .ps-media-left::before,
  .ps-media-right::before {
    content: '';
    position: absolute;
    top: 22px;
    bottom: 22px;
    width: 58px;
    z-index: 0;
    border-radius: 999px;
    background: rgba(244, 229, 203, 0.92);
  }
  .ps-media-left::before  { left:  -22px; }
  .ps-media-right::before { right: -22px; }
 
  /* Shadow below image */
  .ps-media::after {
    content: '';
    position: absolute;
    left: -12px; right: -12px; bottom: -12px;
    z-index: 0;
    height: 44px;
    border-radius: 999px;
    background: #d5dded;
  }
 
  .ps-img-shell {
    position: relative;
    z-index: 1;
    overflow: hidden;
    border-radius: 40px;
    box-shadow: 0 16px 36px rgba(24, 43, 84, 0.18);
  }
 
  .ps-img {
    width: 100%;
    min-height: 170px;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
 
  .ps-row:hover .ps-img {
    transform: scale(1.045);
  }
 
  /* ── Panel (card) ── */
  .ps-panel {
    position: relative;
    border-radius: 22px;
    border: 1px solid rgba(220, 216, 206, 0.9);
    background: rgba(255, 255, 255, 0.94);
    padding: 18px 18px 16px;
    box-shadow: 0 12px 28px rgba(18, 36, 76, 0.09);
    backdrop-filter: blur(4px);
  }
 
  .ps-panel-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }
 
  .ps-badge {
    flex-shrink: 0;
    display: grid;
    place-items: center;
    height: 46px;
    width: 46px;
    border-radius: 999px;
    background: linear-gradient(135deg, #1f5ddf 0%, #1748be 100%);
    color: #fff;
    font-family: 'Georgia', serif;
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1;
    box-shadow: 0 10px 22px rgba(21, 62, 170, 0.34);
    margin-top: 2px;
  }
 
  .ps-title {
    margin: 0;
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: clamp(1.55rem, 2.1vw, 2.2rem);
    font-weight: 700;
    line-height: 1.1;
    color: #07193f;
  }
 
  .ps-desc {
    margin: 14px 0 0;
    font-size: 1rem;
    line-height: 1.58;
    color: #5a6578;
  }
 
  /* ── Centre connector column ── */
  .ps-centre {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }

  /* Circle holding the sprite-cropped icon (sits on the dotted path) */
  .ps-centre-icon {
    display: grid;
    place-items: center;
    height: 56px;
    width: 56px;
    border-radius: 999px;
    background: #f5ecda;
    box-shadow: 0 6px 14px rgba(35, 64, 128, 0.14);
  }

  /* Sprite-cropped icon (3 col × 2 row sprite) */
  .ps-sprite-icon {
    display: block;
    width: 44px;
    height: 44px;
    background-image: url("${stepIconsSprite}");
    background-size: 300% 200%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
  }
 
  /* ── Footer pill ── */
  .ps-footer-pill {
    margin-top: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 999px;
    border: 1px solid rgba(94, 119, 190, 0.35);
    background: linear-gradient(180deg, #e2e6f4 0%, #d9deef 100%);
    padding: 13px 28px;
    box-shadow: 0 14px 28px rgba(39, 72, 151, 0.12);
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }
 
  .ps-footer-pill p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    color: #204897;
    font-weight: 500;
  }
 
  /* ═══════════════════════════════════════
     RESPONSIVE
  ═══════════════════════════════════════ */
 
  /* Tablet */
  @media (max-width: 1024px) {
    .ps-section { padding: 56px 0 64px; }

    .ps-container { padding: 0 28px; }

    .ps-morocco-stamp {
      top: 18px;
      left: 18px;
      width: clamp(100px, 14vw, 140px);
      opacity: 0.7;
    }

    .ps-morocco-map {
      top: 14px;
      right: 14px;
      width: clamp(130px, 23vw, 190px);
      opacity: 0.8;
    }

    .ps-row { grid-template-columns: 1fr 64px 1fr; }

    .ps-path-line { max-width: 140px; }

    .ps-centre-icon { height: 48px; width: 48px; }

    .ps-sprite-icon { width: 36px; height: 36px; }
 
    .ps-pair { gap: 12px; }
 
    .ps-badge { height: 40px; width: 40px; font-size: 1.4rem; }
 
    .ps-title { font-size: clamp(1.35rem, 2vw, 1.85rem); }
 
    .ps-desc { font-size: 0.93rem; }
 
    .ps-panel { padding: 20px 18px 18px; border-radius: 24px; }
 
    .ps-img-shell { border-radius: 30px; }
 
    .ps-img { min-height: 150px; }
  }
 
  /* Mobile – single column stack */
  @media (max-width: 767px) {
    .ps-section { padding: 60px 0 70px; }

    .ps-morocco-stamp,
    .ps-morocco-map { display: none; }

    .ps-path-line { display: none; }

    .ps-container { padding: 0 18px; }
 
    .ps-heading { font-size: clamp(2rem, 9vw, 3rem); }
 
    .ps-header { margin-bottom: 34px; }
 
    .ps-steps { gap: 0; }
 
    /* Switch to a vertical timeline layout */
    .ps-row {
      display: block;
      position: relative;
      padding-left: 20px;
      border-left: 2px dashed rgba(147, 170, 222, 0.86);
      margin-bottom: 28px;
    }
 
    /* Hide desktop pair grid on mobile */
    .ps-pair {
      display: block;
      margin-bottom: 14px;
    }
 
    /* Hide second image column on mobile */
    .ps-pair-left .ps-media,
    .ps-pair-right .ps-media { display: none; }
 
    .ps-panel { border-radius: 20px; }
 
    .ps-title { font-size: 1.7rem; }
 
    /* Centre connector becomes a small absolute dot on timeline */
    .ps-centre {
      display: none;
    }
 
    /* Fake dot on timeline */
    .ps-row::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 18px;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      border: 2px solid rgba(58, 96, 184, 0.4);
      background: #f8f2e6;
      box-shadow: inset 0 0 0 4px #2b65e4;
    }
 
    .ps-footer-pill { flex-direction: column; text-align: center; gap: 8px; padding: 14px 20px; }
  }
 
  @media (prefers-reduced-motion: reduce) {
    .ps-img { transition: none !important; }
    .ps-row:hover .ps-img { transform: none; }
  }
`;
