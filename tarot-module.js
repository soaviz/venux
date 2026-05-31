// ════════════════════════════════════════════════════════════
//  VENUX TAROT MODULE  ·  v2.0
//  Fortune Cookie Daily Draw + 1:1 AI Tarot Chat
//  독립 모듈 — index.html 최소 의존
//  롤백: <script src="tarot-module.js"> 1줄 제거로 완전 복구
// ════════════════════════════════════════════════════════════
(function (global) {
  'use strict';

  // ════════════════════════════════════════════════════════
  //  0. CSS 자동 주입  (.fc-* Fortune Cookie / .tcc-* Chat)
  // ════════════════════════════════════════════════════════
  const _CSS = `
  /* ── Fortune Cookie Screen ── */
  html, body, #root, #app {
    width: 100%; max-width: 100%; overflow-x: hidden;
  }
  *, *::before, *::after { box-sizing: border-box; }
  #screen-tarot {
    width: 100%; min-height: 100dvh;
    overflow-x: hidden; overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  #fcContainer {
    width: 100%; min-height: 100dvh;
    display: flex; flex-direction: column;
    overflow-x: hidden; box-sizing: border-box;
  }

  .fc-deck-view {
    display: flex; flex-direction: column; align-items: center;
    padding: 28px 20px 40px; flex: 1;
  }
  .fc-eyebrow {
    font-family: var(--vx-font-mono, 'JetBrains Mono', monospace);
    font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(199,125,255,0.45); margin-bottom: 6px;
  }
  .fc-title {
    font-size: 28px; font-weight: 800; color: #fff;
    letter-spacing: -.02em; margin-bottom: 4px;
  }
  .fc-sub {
    font-size: 12px; color: rgba(255,255,255,0.3);
    margin-bottom: 20px; text-align: center;
  }
  .fc-cat-row {
    display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none;
    margin-bottom: 28px; max-width: 100%;
    padding: 2px 0;
  }
  .fc-cat-row::-webkit-scrollbar { display: none; }
  .fc-cat {
    flex-shrink: 0; padding: 7px 15px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.4);
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all .18s; -webkit-tap-highlight-color: transparent;
  }
  .fc-cat.active {
    background: rgba(199,125,255,0.15);
    border-color: rgba(199,125,255,0.55); color: #c77dff;
  }
  .fc-deck-anim {
    position: relative; width: 110px; height: 170px; margin-bottom: 28px;
  }
  .fc-card-back {
    position: absolute; width: 108px; height: 168px; border-radius: 12px;
    background: linear-gradient(150deg, #1c0a38, #0c0419);
    border: 1px solid rgba(199,125,255,0.28);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .fc-card-c { bottom: 0; left: 0; z-index: 3; }
  .fc-card-b { bottom: 4px; left: -4px; z-index: 2; }
  .fc-card-a { bottom: 8px; left: -8px; z-index: 1; }
  .fc-card-back::before {
    content: '✦'; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -55%); font-size: 28px;
    color: rgba(199,125,255,0.2);
  }
  .fc-card-back::after {
    content: ''; position: absolute; inset: 7px;
    border: 1px solid rgba(199,125,255,0.1); border-radius: 7px;
  }
  .fc-draw-hint {
    font-size: 12px; color: rgba(255,255,255,0.28);
    text-align: center; line-height: 1.7; margin-bottom: 22px; max-width: 240px;
  }
  .fc-draw-btn {
    display: flex; align-items: center; gap: 9px;
    background: linear-gradient(135deg, #7b2ff7, #c77dff);
    color: #fff; font-size: 14px; font-weight: 700;
    padding: 14px 34px; border-radius: 40px; border: none;
    cursor: pointer; box-shadow: 0 6px 28px rgba(199,125,255,0.42);
    transition: transform .14s, box-shadow .14s;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-draw-btn:active { transform: scale(0.93); box-shadow: 0 3px 14px rgba(199,125,255,0.22); }
  .fc-streak {
    margin-top: 20px; font-size: 11px;
    color: rgba(255,255,255,0.22); text-align: center;
    font-family: var(--vx-font-mono, monospace); letter-spacing: .04em;
  }
  .fc-menu-wrap {
    width: 100%; max-width: 100%; margin: 0 auto;
    padding: 0; border: 0; background: transparent;
    box-sizing: border-box; overflow: visible;
  }
  .fc-top-menu,
  .fortune-tabs {
    width: calc(100% - 32px); max-width: 720px; margin: 16px auto 28px;
    padding: 6px;
    border-radius: 28px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(22,14,42,0.72);
    overflow: hidden;
    display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px;
    box-sizing: border-box;
  }
  .fc-top-menu::-webkit-scrollbar { display: none; }
  .fc-menu-btn,
  .fortune-tab {
    position: relative; z-index: 1;
    width: 100%; min-width: 0;
    height: 44px; padding: 0 4px; border: 0; border-radius: 22px;
    background: transparent; color: rgba(255,255,255,0.36);
    font-size: 14px; font-weight: 700; letter-spacing: -.01em;
    white-space: nowrap; text-align: center;
    cursor: pointer; transition: background .16s, color .16s;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
  }
  .fc-menu-btn::before,
  .fc-menu-btn::after,
  .fortune-tab::before,
  .fortune-tab::after { pointer-events: none; }
  .fc-menu-btn.active,
  .fortune-tab.active {
    background: rgba(117,61,164,0.68);
    color: #fff; box-shadow: inset 0 0 0 1px rgba(208,151,255,0.28);
  }
  .fc-menu-btn:not(.active),
  .fortune-tab:not(.active) {
    border: 0 !important;
    box-shadow: none !important;
  }
  .fc-menu-btn[data-tab="qa"],
  .fortune-tab[data-tab="qa"] {
    border: 0;
    box-shadow: none;
  }
  .fc-menu-btn.active[data-tab="qa"],
  .fortune-tab.active[data-tab="qa"] {
    background: rgba(117,61,164,0.68);
    color: #fff; box-shadow: inset 0 0 0 1px rgba(208,151,255,0.28);
  }
  .fc-menu-btn:active { transform: scale(.97); }
  @media (max-width: 390px) {
    .fc-top-menu,
    .fortune-tabs {
      width: calc(100% - 24px);
      padding: 5px;
      gap: 3px;
    }
    .fc-menu-btn,
    .fortune-tab {
      height: 40px;
      font-size: 12px;
      padding: 0 2px;
    }
  }
  @media (max-width: 340px) {
    .fc-menu-btn,
    .fortune-tab {
      font-size: 11px;
    }
  }
  .fc-menu-wrap.qa-open ~ .tp3-guide,
  .fc-menu-wrap.qa-open ~ .tp3-slots,
  .fc-menu-wrap.qa-open ~ .tp3-grid-wrap,
  .fc-menu-wrap.qa-open ~ .tp3-actions {
    display: none;
  }
  .fc-qa-panel {
    margin-top: 8px; padding: 12px;
    border-radius: 14px;
    border: 1px solid rgba(212,175,55,0.16);
    background: rgba(7,4,14,0.58);
  }
  .fc-qa-item + .fc-qa-item { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.07); }
  .fc-qa-q {
    font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.86);
    line-height: 1.45; margin-bottom: 4px;
  }
  .fc-qa-a {
    font-size: 11px; line-height: 1.65; color: rgba(255,255,255,0.55);
  }

  /* ── Reveal Zone ── */
  .fc-reveal-zone {
    display: flex; flex-direction: column; align-items: center;
    margin-top: 20px; opacity: 0; transform: translateY(16px);
    transition: opacity .4s, transform .4s;
  }
  .fc-reveal-zone.visible { opacity: 1; transform: translateY(0); }
  .fc-flip-wrap {
    perspective: 700px; cursor: pointer; width: 120px;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-flip-inner {
    position: relative; width: 120px; height: 180px;
    transform-style: preserve-3d;
    transition: transform 0.65s cubic-bezier(0.23,1,0.32,1);
  }
  .fc-flip-wrap.flipped .fc-flip-inner { transform: rotateY(180deg); }
  .fc-card-face {
    position: absolute; inset: 0; border-radius: 12px;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    overflow: hidden;
  }
  .fc-card-back-lg {
    background: linear-gradient(150deg, #1c0a38, #0c0419);
    border: 1px solid rgba(199,125,255,0.28);
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .fc-card-back-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center; z-index: 0;
  }
  .fc-back-glyph { font-size: 36px; color: rgba(199,125,255,0.22); }
  .fc-back-label {
    position: absolute; bottom: 14px; left: 0; right: 0; text-align: center;
    font-family: var(--vx-font-mono, monospace); font-size: 7px;
    letter-spacing: .2em; color: rgba(199,125,255,0.18); text-transform: uppercase;
  }
  .fc-card-front {
    transform: rotateY(180deg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 10px 8px 14px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  }
  .fc-front-glow {
    position: absolute; inset: 0; pointer-events: none; border-radius: 12px;
  }
  .fc-card-image {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center; z-index: 0;
  }
  .fc-card-image-shade {
    position: absolute; inset: 0; z-index: 1;
    background:
      linear-gradient(180deg, rgba(4,2,12,0.02) 0%, rgba(4,2,12,0.18) 48%, rgba(4,2,12,0.84) 100%),
      radial-gradient(circle at 50% 22%, rgba(255,255,255,0.12), transparent 38%);
    pointer-events: none;
  }
  .fc-card-front.has-image,
  .fc-result-card.has-image {
    padding: 0;
    justify-content: flex-end;
    background: #070511;
  }
  .fc-card-front.has-image .fc-front-name,
  .fc-result-card.has-image .fc-front-name {
    width: calc(100% - 18px);
    margin: 0 9px 2px;
    text-shadow: 0 1px 12px rgba(0,0,0,0.9);
  }
  .fc-card-front.has-image .fc-front-kw,
  .fc-result-card.has-image .fc-front-kw {
    width: calc(100% - 18px);
    margin: 0 9px 12px;
    text-shadow: 0 1px 10px rgba(0,0,0,0.9);
  }
  .fc-front-sym { position: relative; z-index: 1; margin-bottom: 8px; }
  .fc-front-name {
    position: relative; z-index: 1;
    font-size: 11px; font-weight: 700; color: #fff;
    text-align: center; letter-spacing: -.01em; line-height: 1.3;
    margin-bottom: 3px;
  }
  .fc-front-kw {
    position: relative; z-index: 1;
    font-family: var(--vx-font-mono, monospace);
    font-size: 8px; letter-spacing: .14em; text-align: center;
    text-transform: uppercase; opacity: .8;
  }
  .fc-tap-hint {
    margin-top: 16px; font-size: 12px; color: rgba(255,255,255,0.25);
    letter-spacing: .04em; text-align: center;
  }

  /* ── Result View ── */
  .fc-result-view {
    display: flex; flex-direction: column; align-items: center;
    padding: 20px 18px 40px; flex: 1;
  }
  .fc-result-badge {
    font-family: var(--vx-font-mono, monospace);
    font-size: 9px; font-weight: 700; letter-spacing: .16em;
    text-transform: uppercase; padding: 4px 12px;
    border-radius: 20px; border: 1px solid; margin-bottom: 18px;
  }
  .fc-result-card-wrap { margin-bottom: 18px; }
  .fc-result-card {
    width: 130px; height: 195px; border-radius: 14px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 12px 8px 16px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 14px 48px rgba(0,0,0,0.45);
    position: relative; overflow: hidden;
    animation: fcCardReveal .5s ease both;
  }
  @keyframes fcCardReveal {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .fc-result-msg {
    font-size: 15px; color: rgba(255,255,255,0.82);
    text-align: center; line-height: 1.75; max-width: 300px;
    margin-bottom: 16px; font-weight: 500;
    animation: fcFadeUp .4s .2s ease both;
  }
  .fc-result-upright {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 13px 16px;
    width: 100%; max-width: 320px; margin-bottom: 20px;
    animation: fcFadeUp .4s .3s ease both;
  }
  .fc-result-upright-label {
    font-family: var(--vx-font-mono, monospace);
    font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin-bottom: 6px;
  }
  .fc-result-upright-text {
    font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7;
  }
  @keyframes fcFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fc-cta-area {
    width: 100%; max-width: 320px; text-align: center;
    animation: fcFadeUp .4s .4s ease both;
  }
  .fc-chat-btn {
    width: 100%; padding: 15px; border-radius: 14px;
    background: linear-gradient(135deg, #7b2ff7, #c77dff);
    border: none; color: #fff; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: opacity .15s; letter-spacing: .02em;
    box-shadow: 0 6px 28px rgba(199,125,255,0.38); margin-bottom: 8px;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-chat-btn:active { opacity: .82; }
  .fc-reroll-btn {
    width: 100%; min-height: 42px; border-radius: 14px;
    border: 1px solid rgba(199,125,255,0.24);
    background: rgba(199,125,255,0.08);
    color: rgba(244,230,255,0.86);
    font-size: 12px; font-weight: 800; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-reroll-btn:active { background: rgba(199,125,255,0.16); }
  .fc-reroll-btn:disabled {
    opacity: .42; cursor: not-allowed; background: rgba(255,255,255,0.035);
    color: rgba(255,255,255,0.34); border-color: rgba(255,255,255,0.08);
  }
  .fc-cta-hint {
    font-size: 11px; color: rgba(255,255,255,0.22);
    margin-bottom: 14px;
    font-family: var(--vx-font-mono, monospace); letter-spacing: .03em;
  }
  .fc-tomorrow {
    font-size: 12px; color: rgba(255,255,255,0.18);
  }
  .fc-routine-panel {
    width: 100%; max-width: 320px; margin: 0 auto 12px;
    border: 1px solid rgba(199,125,255,0.18);
    background: rgba(199,125,255,0.055);
    border-radius: 16px; padding: 12px 13px; text-align: left;
  }
  .fc-routine-title {
    color: rgba(244,230,255,0.88); font-size: 12px; font-weight: 850;
    margin-bottom: 5px;
  }
  .fc-routine-copy {
    color: rgba(255,255,255,0.45); font-size: 11px; line-height: 1.55;
  }
  .fc-routine-reward {
    margin-top: 8px; color: #f0d4ff; font-size: 11px; font-weight: 800;
  }
  .fc-content-panel {
    width: 100%; max-width: 340px; margin: 14px auto 0;
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(7,4,15,0.72); border-radius: 18px;
    padding: 14px; text-align: left;
  }
  .fc-content-head {
    color: #fff; font-size: 14px; font-weight: 900; margin-bottom: 3px;
  }
  .fc-content-sub {
    color: rgba(255,255,255,0.35); font-size: 11px; line-height: 1.5;
    margin-bottom: 12px;
  }
  .fc-content-block {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding-top: 10px; margin-top: 10px;
  }
  .fc-content-label {
    font-family: var(--vx-font-mono, monospace); font-size: 9px;
    letter-spacing: .14em; color: rgba(199,125,255,0.62);
    text-transform: uppercase; margin-bottom: 6px;
  }
  .fc-content-text {
    color: rgba(255,255,255,0.68); font-size: 12px; line-height: 1.65;
    white-space: pre-wrap;
  }

  /* ── Already drawn today view ── */
  .fc-already-badge {
    font-size: 11px; color: rgba(199,125,255,0.5);
    font-family: var(--vx-font-mono, monospace); letter-spacing: .1em;
    margin-bottom: 12px; text-align: center;
  }
  .fc-result-actions {
    display: grid; grid-template-columns: 1fr; gap: 8px;
    width: 100%; margin-top: 10px;
  }
  .fc-ghost-btn {
    min-height: 42px; border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.52); font-size: 12px; font-weight: 700;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .fc-ghost-btn:active { background: rgba(199,125,255,0.12); color: #d8a7ff; }
  .fc-library-view,
  .fc-guide-view {
    padding: 28px 18px 42px; min-height: 100%;
  }
  .fc-section-head { text-align: center; margin-bottom: 18px; }
  .fc-section-title {
    font-size: 24px; font-weight: 800; color: #fff;
    letter-spacing: -.02em; margin-bottom: 4px;
  }
  .fc-section-sub {
    font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.6;
  }
  /* ── Library flip grid ── */
  .fc-library-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px; max-width: 340px; margin: 0 auto;
  }
  .fc-lib-flip-wrap {
    perspective: 560px; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-lib-flip-inner {
    position: relative; width: 100%; aspect-ratio: 2/3;
    transform-style: preserve-3d;
    transition: transform 0.52s cubic-bezier(0.23,1,0.32,1);
  }
  .fc-lib-flip-wrap.flipped .fc-lib-flip-inner { transform: rotateY(180deg); }
  .fc-lib-card-face {
    position: absolute; inset: 0; border-radius: 13px;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    overflow: hidden;
  }
  /* 뒷면 */
  .fc-lib-back {
    background: linear-gradient(150deg, #1c0a38, #0c0419);
    border: 1px solid rgba(199,125,255,0.22);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 5px;
  }
  .fc-lib-back::after {
    content: ''; position: absolute; inset: 6px;
    border: 1px solid rgba(199,125,255,0.10); border-radius: 8px;
  }
  .fc-lib-back-glyph {
    position: relative; z-index: 1;
    font-size: 18px; color: rgba(199,125,255,0.22);
  }
  .fc-lib-back-num {
    position: relative; z-index: 1;
    font-family: var(--vx-font-mono, monospace);
    font-size: 8px; letter-spacing: .14em; color: rgba(199,125,255,0.30);
  }
  /* 앞면 */
  .fc-lib-front {
    transform: rotateY(180deg);
    border: 1px solid rgba(255,255,255,0.10);
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 8px 7px 10px;
  }
  .fc-lib-front-glow {
    position: absolute; inset: 0; pointer-events: none;
    border-radius: 13px;
    background: radial-gradient(circle at 65% 18%, var(--fc-card-color, #c77dff) 0, transparent 52%);
    opacity: .26;
  }
  .fc-lib-front-num {
    position: relative; z-index: 1;
    font-family: var(--vx-font-mono, monospace);
    font-size: 8px; letter-spacing: .10em;
    color: rgba(255,255,255,0.28); margin-bottom: auto;
  }
  .fc-lib-front-name {
    position: relative; z-index: 1;
    color: #fff; font-size: 11px; font-weight: 800;
    line-height: 1.25; margin-bottom: 3px;
  }
  .fc-lib-front-kw {
    position: relative; z-index: 1;
    font-size: 9px; font-weight: 700; line-height: 1.35;
  }
  .fc-lib-front-detail {
    position: relative; z-index: 1;
    display: block; margin-top: 7px;
    font-size: 9px; font-weight: 700;
    color: rgba(255,255,255,0.36); text-align: right;
    background: none; border: none; cursor: pointer; padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-card-detail {
    max-width: 340px; margin: 0 auto;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.035); border-radius: 18px;
    padding: 16px;
  }
  .fc-detail-top { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .fc-detail-mini {
    width: 74px; height: 111px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative; overflow: hidden;
  }
  .fc-detail-mini.has-image { background: #070511; }
  .fc-detail-text { min-width: 0; }
  .fc-detail-kicker {
    font-family: var(--vx-font-mono, monospace); font-size: 9px;
    letter-spacing: .14em; color: rgba(255,255,255,0.28); margin-bottom: 4px;
  }
  .fc-detail-name { color: #fff; font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .fc-detail-keyword { font-size: 12px; font-weight: 700; }
  .fc-detail-block {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding-top: 12px; margin-top: 12px;
  }
  .fc-detail-label {
    font-family: var(--vx-font-mono, monospace);
    font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(255,255,255,0.26); margin-bottom: 6px;
  }
  .fc-detail-body {
    color: rgba(255,255,255,0.62); font-size: 13px; line-height: 1.72;
  }
  .fc-guide-list { display: grid; gap: 10px; max-width: 340px; margin: 0 auto; }
  .fc-guide-item {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.035); border-radius: 16px;
    padding: 14px 15px;
  }
  .fc-guide-label {
    color: rgba(199,125,255,0.84); font-size: 12px; font-weight: 800;
    margin-bottom: 5px;
  }
  .fc-guide-copy {
    color: rgba(255,255,255,0.56); font-size: 13px; line-height: 1.65;
  }

  /* ════════════════════════════════════════════════
     Tarot Chat Overlay (#tarotChatOverlay)
  ════════════════════════════════════════════════ */
  #tarotChatOverlay {
    position: fixed; inset: 0; z-index: 2200;
    background: #07060f;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.32s cubic-bezier(0.32,0.72,0,1);
    pointer-events: none;
  }
  #tarotChatOverlay.open {
    transform: translateX(0); pointer-events: auto;
  }
  @media (min-width: 769px) {
    #tarotChatOverlay {
      top: 0; bottom: 0; left: 50%; right: auto;
      width: 480px; height: 100dvh;
      transform: translateX(-50%) translateX(480px);
      visibility: hidden;
      transition: transform 0.32s cubic-bezier(0.32,0.72,0,1), visibility 0s linear 0.32s;
      border-left: 1px solid rgba(199,125,255,0.12);
      border-right: 1px solid rgba(199,125,255,0.12);
    }
    #tarotChatOverlay.open {
      transform: translateX(-50%); visibility: visible;
      transition: transform 0.32s cubic-bezier(0.32,0.72,0,1), visibility 0s linear 0s;
    }
  }
  .tcc-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid rgba(199,125,255,0.1);
    flex-shrink: 0; background: #07060f;
  }
  .tcc-back {
    width: 36px; height: 36px; border: none;
    background: rgba(255,255,255,0.07); border-radius: 50%;
    color: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    transition: background .15s;
  }
  .tcc-back:active { background: rgba(255,255,255,0.14); }
  .tcc-title { font-size: 15px; font-weight: 700; color: #fff; }
  .tcc-coin-badge {
    font-size: 11px; color: rgba(199,125,255,0.6);
    font-family: var(--vx-font-mono, monospace);
    background: rgba(199,125,255,0.08);
    border: 1px solid rgba(199,125,255,0.2);
    padding: 3px 10px; border-radius: 12px;
  }
  .tcc-body {
    flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
    padding: 16px 14px;
  }
  .tcc-intro-wrap {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(199,125,255,0.12);
    border-radius: 14px; padding: 12px 14px; margin-bottom: 14px;
  }
  .tcc-intro-card {
    width: 44px; height: 68px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;
    position: relative;
  }
  .tcc-intro-glow { position: absolute; inset: 0; pointer-events: none; }
  .tcc-intro-info { flex: 1; min-width: 0; }
  .tcc-intro-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .tcc-intro-kw {
    font-size: 10px; font-family: var(--vx-font-mono, monospace);
    letter-spacing: .1em; text-transform: uppercase;
    color: rgba(255,255,255,0.35);
  }
  .tcc-sys-msg {
    text-align: center; font-size: 12px; color: rgba(255,255,255,0.3);
    margin-bottom: 14px; line-height: 1.6;
  }
  .tcc-sys-msg b { color: rgba(199,125,255,0.7); font-weight: 600; }
  .tcc-free-badge {
    text-align: center; font-size: 10px; color: rgba(199,125,255,0.45);
    font-family: var(--vx-font-mono, monospace); letter-spacing: .06em;
    margin-bottom: 16px;
  }
  /* Chat bubbles */
  .tcc-msg-row { display: flex; margin-bottom: 10px; }
  .tcc-msg-row.user { justify-content: flex-end; }
  .tcc-msg-row.ai   { justify-content: flex-start; align-items: flex-end; gap: 7px; }
  .tcc-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #7b2ff7, #c77dff);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
  .tcc-bubble {
    max-width: 78%; padding: 10px 13px; border-radius: 16px;
    font-size: 13px; line-height: 1.65;
  }
  .tcc-bubble.user {
    background: rgba(199,125,255,0.2);
    border: 1px solid rgba(199,125,255,0.25);
    color: #fff; border-radius: 16px 4px 16px 16px;
  }
  .tcc-bubble.ai {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.82); border-radius: 4px 16px 16px 16px;
  }
  .tcc-typing {
    display: flex; align-items: center; gap: 4px;
    padding: 10px 14px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px 16px 16px 16px; margin-bottom: 10px;
    width: fit-content;
  }
  .tcc-dot {
    width: 6px; height: 6px; border-radius: 50%; background: rgba(199,125,255,0.5);
    animation: tccDot 1.2s ease-in-out infinite;
  }
  .tcc-dot:nth-child(2) { animation-delay: .2s; }
  .tcc-dot:nth-child(3) { animation-delay: .4s; }
  @keyframes tccDot {
    0%,100% { opacity:.3; transform: scale(0.8); }
    50%      { opacity:1;  transform: scale(1); }
  }
  /* Input bar */
  .tcc-input-bar {
    display: flex; align-items: flex-end; gap: 8px;
    padding: 10px 12px; border-top: 1px solid rgba(199,125,255,0.1);
    background: #07060f; flex-shrink: 0;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
  }
  .tcc-input-wrap { flex: 1; }
  .tcc-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(199,125,255,0.2); border-radius: 18px;
    padding: 10px 14px; color: #fff; font-size: 14px;
    outline: none; resize: none; font-family: inherit;
    line-height: 1.5; max-height: 120px; overflow-y: auto;
    box-sizing: border-box; transition: border-color .18s;
  }
  .tcc-input::placeholder { color: rgba(255,255,255,0.22); }
  .tcc-input:focus { border-color: rgba(199,125,255,0.5); }
  .tcc-send {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #7b2ff7, #c77dff);
    border: none; color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: opacity .15s, transform .12s;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 4px 16px rgba(199,125,255,0.4);
  }
  .tcc-send:disabled { opacity: .3; box-shadow: none; cursor: default; }
  .tcc-send:not(:disabled):active { transform: scale(0.91); }
  `;

  if (!document.getElementById('venux-tarot-css')) {
    const style = document.createElement('style');
    style.id = 'venux-tarot-css';
    style.textContent = _CSS;
    document.head.appendChild(style);
  }


  // ════════════════════════════════════════════════════════
  //  1. 22장 메이저 아르카나 데이터
  //     나중에 tarot-data.js 로 분리 가능한 구조
  // ════════════════════════════════════════════════════════
  const TAROT_MAJOR = [
    {
      id: 'fool', num: '0', name: '광대', keyword: '모험 · 시작',
      color: '#34d399', sym: 'wind',
      upright: '두려움 없이 첫 발을 내딛을 때야. 완벽하지 않아도 괜찮아.',
      reversed: '무모한 결정을 조심해. 한 발짝 물러서서 준비를 확인해봐.',
      msgs: {
        daily:  '오늘은 새로운 무언가를 시작하기 좋은 날이야. 작더라도 한 발짝 내딛어봐.',
        love:   '설렘이 찾아오는 시기야. 감정에 솔직해져봐. 먼저 다가가는 용기를 내봐.',
        work:   '창의적인 아이디어가 빛나는 날. 틀에 얽매이지 말고 새롭게 접근해봐.',
        advice: '지금 망설이고 있다면, 일단 시작해. 완벽한 타이밍은 없어.',
      },
      ai_context: '광대(0번) 카드는 새로운 시작, 순수한 열정, 무한한 가능성을 의미합니다. 두려움 없이 앞으로 나아가는 에너지를 담고 있습니다.',
    },
    {
      id: 'magician', num: 'I', name: '마법사', keyword: '의지 · 능력',
      color: '#e879f9', sym: 'wand',
      upright: '네 안에 모든 재능이 갖춰져 있어. 지금이 실행할 때야.',
      reversed: '능력은 있지만 집중력이 흩어져 있어. 한 가지에 집중해봐.',
      msgs: {
        daily:  '오늘은 네가 원하는 것을 이룰 수 있는 에너지가 가득해. 실행에 옮겨봐.',
        love:   '솔직하게 표현하면 원하는 것을 얻을 수 있어. 먼저 움직여봐.',
        work:   '모든 자원을 갖추고 있어. 계획을 행동으로 옮길 타이밍이야.',
        advice: '도구는 이미 네 손 안에 있어. 망설임을 내려놓고 써봐.',
      },
      ai_context: '마법사(I번) 카드는 의지력, 창조적 능력, 실행의 힘을 상징합니다. 필요한 모든 것이 이미 갖춰져 있다는 메시지를 전합니다.',
    },
    {
      id: 'high_priestess', num: 'II', name: '여사제', keyword: '직관 · 내면',
      color: '#818cf8', sym: 'eye',
      upright: '머리보다 마음이 먼저 알고 있어. 직관을 믿어봐.',
      reversed: '자신의 감정을 억누르고 있어. 내면의 소리에 귀 기울여.',
      msgs: {
        daily:  '오늘은 조용히 내면을 들여다볼 시간이 필요해. 억지로 결정하지 마.',
        love:   '상대방의 말보다 행동을 봐. 느낌이 말해주고 있을 거야.',
        work:   '데이터보다 직관이 맞을 때야. 잠깐 멈추고 깊이 생각해봐.',
        advice: '혼자만의 시간을 가져봐. 고요함 속에서 답이 올라올 거야.',
      },
      ai_context: '여사제(II번) 카드는 깊은 직관, 신비로운 지혜, 내면의 목소리를 상징합니다. 표면 너머의 진실을 보는 능력을 강조합니다.',
    },
    {
      id: 'empress', num: 'III', name: '여황제', keyword: '풍요 · 창조',
      color: '#fb923c', sym: 'flower',
      upright: '풍성함이 찾아오고 있어. 자신을 사랑하고 돌봐줘.',
      reversed: '자신을 너무 혹독하게 대하고 있어. 조금 더 따뜻하게 대해줘.',
      msgs: {
        daily:  '감사할 것이 많은 하루야. 작은 것들에서 아름다움을 찾아봐.',
        love:   '깊은 연결감과 따뜻한 애정이 자라나고 있어. 받아들여봐.',
        work:   '창의적인 작업이 빛을 발하는 시기야. 아이디어를 밖으로 표현해봐.',
        advice: '먼저 자신을 채워야 남에게도 줄 수 있어. 나를 돌봐.',
      },
      ai_context: '여황제(III번) 카드는 풍요, 창조성, 자연의 에너지, 모성을 상징합니다. 풍성함과 번영이 찾아오고 있음을 알립니다.',
    },
    {
      id: 'emperor', num: 'IV', name: '황제', keyword: '구조 · 안정',
      color: '#f59e0b', sym: 'tower',
      upright: '단단한 기반을 세울 때야. 체계와 규칙이 지금 너를 도와줄 거야.',
      reversed: '너무 딱딱하게 통제하려 하고 있어. 조금 유연하게 풀어봐.',
      msgs: {
        daily:  '오늘은 계획을 세우고 실행하기 좋은 날. 체계적으로 접근해봐.',
        love:   '안정적인 기반이 관계를 단단하게 만들어. 책임감을 보여줘.',
        work:   '권위 있는 결정을 내려야 할 때야. 흔들리지 말고 중심을 잡아.',
        advice: '규칙과 구조가 지금 너를 자유롭게 해줄 거야. 기반을 다져봐.',
      },
      ai_context: '황제(IV번) 카드는 안정, 권위, 구조적 사고, 리더십을 상징합니다. 체계적인 접근과 단단한 기반의 중요성을 강조합니다.',
    },
    {
      id: 'hierophant', num: 'V', name: '교황', keyword: '전통 · 가르침',
      color: '#a78bfa', sym: 'bell',
      upright: '검증된 방법을 따르는 것도 지혜야. 조언을 구해봐.',
      reversed: '기존 방식에 너무 얽매여 있어. 새로운 시각으로 바라봐.',
      msgs: {
        daily:  '오늘은 배움과 성장의 날이야. 경험자의 조언에 귀를 기울여봐.',
        love:   '공통된 가치관이 깊은 유대를 만들어. 솔직하게 이야기해봐.',
        work:   '멘토나 선배의 조언이 도움이 될 거야. 혼자 모든 것을 해결하려 하지 마.',
        advice: '전통 속에 지혜가 있어. 검증된 길을 따르는 것도 선택이야.',
      },
      ai_context: '교황(V번) 카드는 전통, 교육, 영적 지혜, 제도적 가르침을 상징합니다. 확립된 지혜와 멘토링의 가치를 강조합니다.',
    },
    {
      id: 'lovers', num: 'VI', name: '연인', keyword: '선택 · 연결',
      color: '#f472b6', sym: 'heart',
      upright: '중요한 선택의 순간이야. 진심이 이끄는 방향으로 가봐.',
      reversed: '내면의 갈등이 있어. 자신이 정말 원하는 게 무엇인지 먼저 알아봐.',
      msgs: {
        daily:  '오늘은 가슴이 끌리는 쪽을 선택해봐. 직관이 옳아.',
        love:   '진심을 표현할 기회야. 망설이지 말고 솔직하게 말해봐.',
        work:   '협력과 파트너십이 성공의 열쇠야. 혼자보다 함께가 강해.',
        advice: '선택에는 책임이 따라. 두려움 말고 진심으로 고민해봐.',
      },
      ai_context: '연인(VI번) 카드는 중요한 선택, 파트너십, 가치관의 조화, 진정한 연결을 상징합니다. 마음을 따르는 용기를 강조합니다.',
    },
    {
      id: 'chariot', num: 'VII', name: '전차', keyword: '의지력 · 승리',
      color: '#60a5fa', sym: 'wheel',
      upright: '의지를 가지고 앞으로 달려가. 어떤 장애물도 극복할 수 있어.',
      reversed: '방향을 잃고 있어. 잠깐 멈추고 목표를 다시 확인해봐.',
      msgs: {
        daily:  '오늘은 의지력이 최고조야. 어렵다고 느끼던 일도 해낼 수 있어.',
        love:   '관계를 위해 적극적으로 움직여봐. 노력이 결실을 맺을 거야.',
        work:   '승리가 가까워. 마지막까지 집중력을 잃지 마.',
        advice: '외부의 방해를 이겨내는 힘은 내 안에 있어. 흔들리지 마.',
      },
      ai_context: '전차(VII번) 카드는 의지력, 통제, 승리, 목적의식을 상징합니다. 강한 의지로 어려움을 극복하고 성공으로 나아가는 에너지입니다.',
    },
    {
      id: 'strength', num: 'VIII', name: '힘', keyword: '용기 · 인내',
      color: '#f97316', sym: 'sun',
      upright: '진짜 힘은 부드러움에서 나와. 온화함으로 상황을 다스려봐.',
      reversed: '자신을 너무 몰아붙이고 있어. 스스로에게 더 자비로워져봐.',
      msgs: {
        daily:  '오늘은 내면의 힘을 발휘할 날이야. 화내지 말고 차분하게 대처해.',
        love:   '인내심이 관계를 깊게 해줘. 상대를 이해하려는 노력을 해봐.',
        work:   '압박 속에서도 흔들리지 않는 것이 진짜 실력이야.',
        advice: '온화함이 가장 강한 무기야. 부드럽게 상황을 이끌어봐.',
      },
      ai_context: '힘(VIII번) 카드는 내면의 힘, 용기, 인내, 온화한 통제를 상징합니다. 진정한 강함은 무력이 아닌 내면의 평화에서 온다는 메시지를 담습니다.',
    },
    {
      id: 'hermit', num: 'IX', name: '은둔자', keyword: '내성 · 탐구',
      color: '#a78bfa', sym: 'eye',
      upright: '혼자만의 시간이 지금 필요해. 내면의 빛을 찾아봐.',
      reversed: '고립이 너무 길어지고 있어. 다시 세상으로 나올 때야.',
      msgs: {
        daily:  '오늘은 조용히 자신을 돌아보는 날이야. 혼자 있는 것을 두려워하지 마.',
        love:   '서두르지 마. 천천히 알아가는 과정도 아름다워.',
        work:   '깊이 생각하고 신중하게 결정해. 혼자만의 시간이 좋은 아이디어를 줄 거야.',
        advice: '내면을 들여다보면 답이 있어. 조용히 귀를 기울여봐.',
      },
      ai_context: '은둔자(IX번) 카드는 내성적인 탐구, 영적 고독, 지혜로운 내성을 상징합니다. 외부의 소음에서 벗어나 자신의 진실을 찾아가는 여정입니다.',
    },
    {
      id: 'wheel', num: 'X', name: '운명의 수레', keyword: '순환 · 변화',
      color: '#fbbf24', sym: 'wheel',
      upright: '운명의 흐름이 좋은 방향으로 돌고 있어. 이 기회를 잡아.',
      reversed: '나쁜 운이 지나가고 있어. 조금만 더 버텨봐. 곧 바뀔 거야.',
      msgs: {
        daily:  '오늘은 흐름이 좋아. 때를 놓치지 말고 움직여봐.',
        love:   '타이밍이 맞아가고 있어. 자연스러운 흐름을 믿어봐.',
        work:   '기회의 순간이 찾아오고 있어. 준비해.',
        advice: '모든 것은 돌고 돌아. 지금의 어려움도 결국 지나가.',
      },
      ai_context: '운명의 수레(X번) 카드는 운명의 순환, 기회, 변화의 흐름을 상징합니다. 삶의 패턴과 카르마, 좋은 기운의 흐름을 나타냅니다.',
    },
    {
      id: 'justice', num: 'XI', name: '정의', keyword: '균형 · 진실',
      color: '#34d399', sym: 'world',
      upright: '진실은 반드시 드러나. 올바른 길을 선택하면 균형이 찾아와.',
      reversed: '불공정한 상황에 처해 있어. 침착하게 사실을 정리해봐.',
      msgs: {
        daily:  '오늘은 공정하게 판단해야 할 상황이 올 수 있어. 감정보다 사실을 봐.',
        love:   '관계의 균형을 점검해봐. 한쪽만 노력하고 있는 건 아닌지.',
        work:   '정직하게 행동해. 진실은 결국 밝혀지고 인정받게 돼.',
        advice: '모든 선택에는 결과가 따라. 책임 있는 선택을 해봐.',
      },
      ai_context: '정의(XI번) 카드는 균형, 진실, 공정함, 책임을 상징합니다. 행동에 따른 결과와 카르마의 법칙을 나타냅니다.',
    },
    {
      id: 'hanged_man', num: 'XII', name: '매달린 사람', keyword: '희생 · 관점',
      color: '#67e8f9', sym: 'moon',
      upright: '잠깐 멈추는 것이 오히려 앞으로 나아가는 길이야.',
      reversed: '희생만 하고 있어. 이제 자신을 위해 결정해도 돼.',
      msgs: {
        daily:  '오늘은 다른 시각으로 상황을 바라봐봐. 익숙한 방식을 잠깐 내려놔.',
        love:   '지금은 자신을 희생하기보다 자신을 먼저 채울 때야.',
        work:   '속도를 늦추는 것이 오히려 더 나은 결과를 만들 거야.',
        advice: '다른 각도에서 보면 완전히 다른 답이 보일 거야.',
      },
      ai_context: '매달린 사람(XII번) 카드는 자발적 희생, 새로운 관점, 일시적 정체를 상징합니다. 멈춤 속에서 더 깊은 지혜를 발견하라는 메시지를 담습니다.',
    },
    {
      id: 'death', num: 'XIII', name: '변화', keyword: '끝 · 새로운 시작',
      color: '#94a3b8', sym: 'tower',
      upright: '무언가가 끝나고 있어. 두려워하지 마. 더 좋은 것이 시작돼.',
      reversed: '변화를 두려워하며 버티고 있어. 내려놓는 것도 용기야.',
      msgs: {
        daily:  '오늘은 과거의 무언가를 내려놓기 좋은 날이야. 비워야 채워져.',
        love:   '오래된 패턴을 끊어낼 때야. 새로운 방식으로 사랑해봐.',
        work:   '기존 방식의 종료가 더 나은 시작을 만들어. 두려워 말고 받아들여.',
        advice: '모든 끝은 새로운 시작이야. 변화를 두려워하지 마.',
      },
      ai_context: '죽음(XIII번) 카드는 종료, 변환, 피할 수 없는 변화를 상징합니다. 죽음이 아닌 변화와 재탄생의 에너지를 담고 있습니다.',
    },
    {
      id: 'temperance', num: 'XIV', name: '절제', keyword: '균형 · 조화',
      color: '#38bdf8', sym: 'world',
      upright: '균형 잡힌 에너지가 필요해. 천천히, 꾸준히, 조화롭게.',
      reversed: '과도함이 균형을 무너뜨리고 있어. 조금 절제해봐.',
      msgs: {
        daily:  '오늘은 극단을 피하고 중간 길을 가봐. 균형이 답이야.',
        love:   '서로의 페이스를 맞춰가는 것이 중요해. 천천히 조화를 찾아봐.',
        work:   '한 번에 모든 것을 이루려 하지 마. 꾸준함이 승리야.',
        advice: '인내심을 갖고 흐름에 맡겨봐. 조화 속에 답이 있어.',
      },
      ai_context: '절제(XIV번) 카드는 균형, 인내, 조화, 중용을 상징합니다. 극단을 피하고 꾸준한 노력으로 조화를 이루라는 메시지를 담습니다.',
    },
    {
      id: 'devil', num: 'XV', name: '악마', keyword: '속박 · 집착',
      color: '#f87171', sym: 'tower',
      upright: '무언가에 집착하고 있어. 그것이 너를 자유롭지 못하게 해.',
      reversed: '족쇄를 끊어낼 힘이 생기고 있어. 지금이 해방의 순간이야.',
      msgs: {
        daily:  '오늘은 나를 가두고 있는 두려움이나 집착을 직시해봐.',
        love:   '집착인지 사랑인지 구분해봐. 자유로운 사랑이 더 깊어.',
        work:   '나쁜 습관이나 패턴이 성장을 막고 있어. 인정하고 끊어내봐.',
        advice: '보이지 않는 족쇄를 알아차려. 의식이 곧 자유야.',
      },
      ai_context: '악마(XV번) 카드는 속박, 물질적 집착, 두려움, 의존성을 상징합니다. 우리를 제한하는 것들에 대한 인식과 해방을 강조합니다.',
    },
    {
      id: 'tower', num: 'XVI', name: '탑', keyword: '혼란 · 해방',
      color: '#ef4444', sym: 'tower',
      upright: '갑작스러운 변화가 찾아올 수 있어. 무너지는 것은 더 좋은 것을 위한 자리야.',
      reversed: '위기를 피하려 하고 있어. 지금 바로잡지 않으면 더 커져.',
      msgs: {
        daily:  '예상치 못한 일이 생길 수 있어. 유연하게 대처해봐.',
        love:   '관계에서 솔직하게 말하지 않은 것들이 터져 나올 수 있어. 준비해.',
        work:   '기존 방식이 흔들릴 수 있어. 무너지는 것이 재건의 시작이야.',
        advice: '두려워하지 마. 무너진 자리에 더 강한 것이 세워져.',
      },
      ai_context: '탑(XVI번) 카드는 갑작스러운 혼란, 오래된 구조의 붕괴, 해방을 상징합니다. 충격적인 변화 속에서 새로운 진실이 드러납니다.',
    },
    {
      id: 'star', num: 'XVII', name: '별', keyword: '희망 · 치유',
      color: '#c77dff', sym: 'star',
      upright: '희망의 빛이 찾아오고 있어. 치유되고 있어.',
      reversed: '희망을 잃지 마. 별빛은 어둠 속에서도 빛나고 있어.',
      msgs: {
        daily:  '오늘은 희망과 치유의 에너지가 가득해. 가볍고 밝게 지내봐.',
        love:   '상처가 치유되고 있어. 다시 마음을 열어봐.',
        work:   '노력이 인정받을 시기야. 자신을 믿어.',
        advice: '별처럼 어둠 속에서도 빛나. 희망을 잃지 마.',
      },
      ai_context: '별(XVII번) 카드는 희망, 영감, 치유, 신성한 가이드를 상징합니다. 어둠 이후에 찾아오는 빛과 재생의 에너지를 담고 있습니다.',
    },
    {
      id: 'moon', num: 'XVIII', name: '달', keyword: '직관 · 환상',
      color: '#7eb8f7', sym: 'moon',
      upright: '모든 것이 보이는 그대로가 아닐 수 있어. 직관을 믿어.',
      reversed: '혼란이 걷히고 있어. 진실이 조금씩 명확해지고 있어.',
      msgs: {
        daily:  '오늘은 감정의 파도가 있을 수 있어. 억지로 결정하지 마.',
        love:   '아직 드러나지 않은 감정이 있어. 서두르지 마.',
        work:   '직관을 믿어. 논리보다 느낌이 맞을 때야.',
        advice: '혼란스러울 때는 멈춰. 달이 지나면 진실이 보여.',
      },
      ai_context: '달(XVIII번) 카드는 직관, 환상, 무의식, 감정의 깊이를 상징합니다. 보이지 않는 것에 대한 탐구와 내면의 불안을 나타냅니다.',
    },
    {
      id: 'sun', num: 'XIX', name: '태양', keyword: '기쁨 · 성공',
      color: '#ffb347', sym: 'sun',
      upright: '밝고 활기찬 에너지가 가득해. 자신감을 갖고 빛나.',
      reversed: '일시적인 그늘이 있어. 곧 밝아질 거야. 조급하지 마.',
      msgs: {
        daily:  '오늘은 최고로 좋은 날이야! 에너지를 마음껏 발산해봐.',
        love:   '밝고 따뜻한 사랑의 에너지가 가득해. 행복해져.',
        work:   '성과가 빛을 발하는 날이야. 자신있게 보여줘.',
        advice: '너의 빛을 숨기지 마. 밝게 빛나는 것이 너의 역할이야.',
      },
      ai_context: '태양(XIX번) 카드는 성공, 기쁨, 활력, 명확성을 상징합니다. 타로에서 가장 긍정적인 카드 중 하나로 번영과 행복을 나타냅니다.',
    },
    {
      id: 'judgement', num: 'XX', name: '심판', keyword: '각성 · 부름',
      color: '#38bdf8', sym: 'bell',
      upright: '새로운 부름에 응답할 시간이야. 과거를 내려놓고 일어나.',
      reversed: '과거의 죄책감이 발목을 잡고 있어. 용서하고 앞으로 가.',
      msgs: {
        daily:  '오늘은 오래된 나를 내려놓고 새롭게 시작하기 좋은 날이야.',
        love:   '솔직한 대화가 관계를 새롭게 만들어줄 거야.',
        work:   '중요한 평가나 결정이 내려질 수 있어. 진실되게 임해봐.',
        advice: '이제 일어날 시간이야. 더 늦기 전에 진정한 나를 깨워.',
      },
      ai_context: '심판(XX번) 카드는 깨달음, 부활, 과거의 청산, 높은 차원의 부름을 상징합니다. 진정한 자아로 거듭나는 변환의 순간을 나타냅니다.',
    },
    {
      id: 'world', num: 'XXI', name: '세계', keyword: '완성 · 통합',
      color: '#4ade80', sym: 'world',
      upright: '하나의 사이클이 완성되고 있어. 성취를 축하해.',
      reversed: '마지막 단계가 남아 있어. 조금만 더 가면 완성돼.',
      msgs: {
        daily:  '오늘은 모든 것이 제자리를 찾는 날이야. 완성의 기쁨을 느껴봐.',
        love:   '관계가 새로운 단계로 깊어지고 있어. 서로를 온전히 받아들여봐.',
        work:   '오래 준비해온 것이 마무리될 거야. 자축해도 돼.',
        advice: '완성은 끝이 아니야. 더 큰 순환의 시작이야.',
      },
      ai_context: '세계(XXI번) 카드는 완성, 통합, 성취, 새로운 사이클의 시작을 상징합니다. 타로에서 가장 축복받은 결말의 카드입니다.',
    },
  ];

  // 마이너 아르카나 — Phase 3에서 채움
  const TAROT_MINOR = []; // 추후 tarot-data.js 로 분리


  // ════════════════════════════════════════════════════════
  //  2. Daily State 관리 (localStorage)
  // ════════════════════════════════════════════════════════
  const DAILY_KEY = 'venux_tarot_daily';
  const DAILY_REROLL_LIMIT = 3;

  function _todayStr() {
    return _kstDateStr(new Date());
  }

  function _kstDateStr(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }

  function _daysBetweenKst(fromDate, toDate) {
    const [fy, fm, fd] = fromDate.split('-').map(Number);
    const [ty, tm, td] = toDate.split('-').map(Number);
    const from = Date.UTC(fy, fm - 1, fd);
    const to = Date.UTC(ty, tm - 1, td);
    return Math.round((to - from) / 86400000);
  }

  function _msUntilNextKstMidnight() {
    const now = new Date();
    const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const next = new Date(kstNow);
    next.setHours(24, 0, 0, 0);
    return Math.max(0, next.getTime() - kstNow.getTime());
  }

  function _countdownToTomorrowKst() {
    const ms = _msUntilNextKstMidnight();
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}시간 ${minutes.toString().padStart(2, '0')}분`;
  }

  function getDailyState() {
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      return (s.date === _todayStr()) ? s : null; // 날짜 다르면 null
    } catch { return null; }
  }

  function setDailyState(cardId, cat, options = {}) {
    const previous = getDailyState();
    const s = {
      date: _todayStr(),
      cardId,
      cat,
      chatFreeUsed: options.chatFreeUsed ?? previous?.chatFreeUsed ?? false,
      rerollCount: Math.max(0, options.rerollCount ?? previous?.rerollCount ?? 0),
    };
    localStorage.setItem(DAILY_KEY, JSON.stringify(s));
    return s;
  }

  function markChatFreeUsed() {
    const s = getDailyState();
    if (s) { s.chatFreeUsed = true; localStorage.setItem(DAILY_KEY, JSON.stringify(s)); }
  }

  function getRerollCount() {
    return Math.max(0, getDailyState()?.rerollCount || 0);
  }

  function getRemainingRerolls() {
    return Math.max(0, DAILY_REROLL_LIMIT - getRerollCount());
  }

  function getStreakState() {
    try {
      const raw = localStorage.getItem('venux_tarot_streak');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  function updateStreak() {
    try {
      const previous = getStreakState();
      const today = _todayStr();
      let count = 1;
      if (previous?.date === today) {
        count = previous.count || 1;
      } else if (previous?.date && _daysBetweenKst(previous.date, today) === 1) {
        count = (previous.count || 0) + 1;
      }

      let rewardMessage = '';
      let bonusCreditClaimedDate = previous?.bonusCreditClaimedDate || null;
      let monthlyInsightUnlocked = Boolean(previous?.monthlyInsightUnlocked);

      if (count === 3 && bonusCreditClaimedDate !== today) {
        _addTarotCredits(1);
        bonusCreditClaimedDate = today;
        rewardMessage = '3일 연속 리딩 달성 · 보너스 질문권 1개 지급';
      }
      if (count >= 7 && !monthlyInsightUnlocked) {
        monthlyInsightUnlocked = true;
        rewardMessage = rewardMessage
          ? `${rewardMessage}<br>7일 연속 리딩 달성 · 월간 인사이트 해금`
          : '7일 연속 리딩 달성 · 월간 인사이트 해금';
      }

      localStorage.setItem(
        'venux_tarot_streak',
        JSON.stringify({ date: today, count, bonusCreditClaimedDate, monthlyInsightUnlocked }),
      );
      const el = document.getElementById('fcStreak');
      if (el && count > 1) el.textContent = `🔥 ${count}일 연속 타로`;
      return { count, rewardMessage, monthlyInsightUnlocked };
    } catch {
      return { count: 1, rewardMessage: '', monthlyInsightUnlocked: false };
    }
  }

  function _addTarotCredits(amount) {
    try {
      const db = JSON.parse(localStorage.getItem('venux_daily_db') || '{}');
      if (!db.coins) db.coins = {};
      db.coins.tarot = (db.coins.tarot || 0) + amount;
      localStorage.setItem('venux_daily_db', JSON.stringify(db));
    } catch {}
  }


  // ════════════════════════════════════════════════════════
  //  3. 내부 상태
  // ════════════════════════════════════════════════════════
  let _currentCard = null;
  let _currentCat  = 'daily';
  let _chatHistory = []; // 세션 내 채팅 히스토리 (저장 안 함)
  let _chatMsgCount = 0; // 이번 채팅에서 주고받은 메시지 수
  let _activeView = 'draw';
  let _selectedCardId = null;
  let _qaOpen = false;


  // ════════════════════════════════════════════════════════
  //  4. SVG 심볼 & 카드 배경 헬퍼
  // ════════════════════════════════════════════════════════
  const _SYMS = {
    star:   (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="${c}" opacity=".85"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`,
    moon:   (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
    sun:    (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    tower:  (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><rect x="9" y="3" width="6" height="18" rx="1"/><path d="M12 7l2 3-2 2-2-2z" fill="${c}" stroke="none"/><line x1="6" y1="21" x2="18" y2="21"/></svg>`,
    world:  (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>`,
    heart:  (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="${c}" opacity=".85"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    eye:    (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" fill="${c}" fill-opacity=".3"/></svg>`,
    wheel:  (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>`,
    bell:   (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
    wind:   (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>`,
    wand:   (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="4" fill="${c}" fill-opacity=".2"/></svg>`,
    flower: (c,s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 013 3v2a3 3 0 01-6 0V5a3 3 0 013-3z"/><path d="M12 22a3 3 0 01-3-3v-2a3 3 0 016 0v2a3 3 0 01-3 3z"/><path d="M2 12a3 3 0 013-3h2a3 3 0 010 6H5a3 3 0 01-3-3z"/><path d="M22 12a3 3 0 01-3 3h-2a3 3 0 010-6h2a3 3 0 013 3z"/></svg>`,
  };

  function _sym(card, size) {
    const fn = _SYMS[card.sym] || _SYMS.star;
    return `<div class="fc-front-sym">${fn(card.color, size || 42)}</div>`;
  }

  const TAROT_MAJOR_IMAGES = {
    fool: 'assets/tarot/major_00_the_fool_park_lyra.png',
    magician: 'assets/tarot/major_01_the_magician_park_lyra.png',
    high_priestess: 'assets/tarot/major_02_the_high_priestess_park_lyra.png',
    empress: 'assets/tarot/major_03_the_empress_park_lyra.png',
    emperor: 'assets/tarot/major_04_the_emperor_park_lyra.png',
    hierophant: 'assets/tarot/major_05_the_hierophant_park_lyra.png',
    lovers: 'assets/tarot/major_06_the_lovers_park_lyra.png',
    chariot: 'assets/tarot/major_07_the_chariot_park_lyra.png',
    strength: 'assets/tarot/major_08_strength_park_lyra.png',
    hermit: 'assets/tarot/major_09_the_hermit_park_lyra.png',
    wheel: 'assets/tarot/major_10_wheel_of_fortune_park_lyra.png',
    justice: 'assets/tarot/major_11_justice_park_lyra.png',
    hanged_man: 'assets/tarot/major_12_the_hanged_man_park_lyra.png',
    death: 'assets/tarot/major_13_death_park_lyra.png',
    temperance: 'assets/tarot/major_14_temperance_park_lyra.png',
    devil: 'assets/tarot/major_15_the_devil_park_lyra.png',
    tower: 'assets/tarot/major_16_the_tower_park_lyra.png',
    star: 'assets/tarot/major_17_the_star_park_lyra.png',
    moon: 'assets/tarot/major_18_the_moon_park_lyra.png',
    sun: 'assets/tarot/major_19_the_sun_park_lyra.png',
    judgement: 'assets/tarot/major_20_judgement_park_lyra.png',
    world: 'assets/tarot/major_21_the_world_park_lyra.png',
  };

  function _cardImage(card) {
    return TAROT_MAJOR_IMAGES[card.id] || '';
  }

  function _cardImageLayer(card) {
    const src = _cardImage(card);
    if (!src) return '';
    return `<img class="fc-card-image" src="${src}" alt="${card.name} 타로 카드" loading="lazy" decoding="async">
      <div class="fc-card-image-shade"></div>`;
  }

  function _cardBackImage(card) {
    // 캐릭터(아티스트)별 뒷면 고정 매칭
    if (card && card.suit === 'cups')      return 'assets/tarot/back_lee_luna.png';
    if (card && card.suit === 'swords')    return 'assets/tarot/back_shin_jiu.png';
    if (card && card.suit === 'wands')     return 'assets/tarot/back_choi_noa.png';
    if (card && card.suit === 'pentacles') return 'assets/tarot/back_jung_aon.png';
    return 'assets/tarot/back_park_lyra.png'; // 메이저 아르카나 → Park Lyra 고정
  }

  function _cardBg(card) {
    const r = parseInt(card.color.slice(1,3), 16);
    const g = parseInt(card.color.slice(3,5), 16);
    const b = parseInt(card.color.slice(5,7), 16);
    return `linear-gradient(150deg,rgba(${r},${g},${b},0.25) 0%,rgba(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)},0.1) 100%)`;
  }


  // ════════════════════════════════════════════════════════
  //  5. Fortune Cookie UX
  // ════════════════════════════════════════════════════════

  function _renderScreen() {
    if (_activeView === 'library') { _showLibrary(); return; }
    if (_activeView === 'guide')   { _showGuide();   return; }
    _showPick3Deck();
  }

  // ── 3장 선택 리딩 (22장 · 셔플 · 플립) ──
  function _showPick3Deck() {
    const ct = document.getElementById('fcContainer');
    if (!ct) return;
    const cat = _activeView || 'love';
    if (typeof global.TarotPick3 !== 'undefined') {
      global.TarotPick3.mount(ct, { menuHtml: _menuHtml(cat), category: cat });
      return;
    }
    _showDeckLegacy();
  }

  // ── 레거시: 하루 1장 뽑기 ──
  function _showDeckLegacy() {
    const daily = getDailyState();
    if (daily) {
      const card = TAROT_MAJOR.find(c => c.id === daily.cardId);
      if (card) {
        _currentCard = card;
        _currentCat  = daily.cat || 'daily';
        _showResult(card, true);
        return;
      }
    }
    const ct = document.getElementById('fcContainer');
    if (!ct) return;
    ct.innerHTML = `
      <div class="fc-deck-view">
        ${_menuHtml('draw')}
        <div class="fc-eyebrow">// TODAY'S FORTUNE</div>
        <div class="fc-title">오늘의 타로</div>
        <div class="fc-sub">하루 한 장, 오늘의 에너지를 확인해봐</div>
        <div class="fc-cat-row">
          <button class="fc-cat active" data-cat="daily" onclick="_fcSetCat(this)">오늘의 운세</button>
          <button class="fc-cat" data-cat="love"  onclick="_fcSetCat(this)">연애운</button>
          <button class="fc-cat" data-cat="work"  onclick="_fcSetCat(this)">직업운</button>
          <button class="fc-cat" data-cat="advice" onclick="_fcSetCat(this)">조언</button>
        </div>
        <div class="fc-deck-anim">
          <div class="fc-card-back fc-card-a"></div>
          <div class="fc-card-back fc-card-b" style="transform:rotate(-4deg) translateX(-6px)"></div>
          <div class="fc-card-back fc-card-c" style="transform:rotate(-8deg) translateX(-12px)"></div>
        </div>
        <div class="fc-draw-hint">카드에 집중하고<br>마음속으로 질문을 떠올려봐</div>
        <button class="fc-draw-btn" onclick="_fcDraw()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          카드 뽑기
        </button>
        <div class="fc-streak" id="fcStreak"></div>
      </div>`;
    updateStreak();
  }

  // ── 카테고리 선택 ──
  global._fcSetCat = function(btn) {
    document.querySelectorAll('.fc-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _currentCat = btn.dataset.cat;
  };

  // ── 뽑기 ──
  global._fcDraw = function() {
    localStorage.removeItem(DAILY_KEY);
    _fcStartDraw();
  };

  function _fcStartDraw(excludeCardId = null) {
    const ct = document.getElementById('fcContainer');
    if (!ct) return;

    // 뽑기 버튼 숨기기
    const drawBtn = ct.querySelector('.fc-draw-btn');
    if (drawBtn) { drawBtn.style.opacity = '0'; drawBtn.style.pointerEvents = 'none'; }
    const hint = ct.querySelector('.fc-draw-hint');
    if (hint) hint.style.opacity = '0';

    // 랜덤 카드 선택
    const deck = excludeCardId
      ? TAROT_MAJOR.filter(item => item.id !== excludeCardId)
      : TAROT_MAJOR;
    const card = deck[Math.floor(Math.random() * deck.length)] || TAROT_MAJOR[0];

    // 뒤집힌 카드 등장
    const image = _cardImage(card);
    const zone = document.createElement('div');
    zone.className = 'fc-reveal-zone';
    zone.id = 'fcRevealZone';
    zone.innerHTML = `
      <div class="fc-flip-wrap" id="fcFlipWrap" onclick="_fcReveal('${card.id}')">
        <div class="fc-flip-inner">
          <div class="fc-card-face fc-card-back-lg">
            <img class="fc-card-back-img" src="${_cardBackImage(card)}" alt="${card.name} 카드 뒷면" loading="lazy" decoding="async">
          </div>
          <div class="fc-card-face fc-card-front ${image ? 'has-image' : ''}"
               style="${image ? '' : `background:${_cardBg(card)};`}border:1px solid ${card.color}55">
            ${image ? _cardImageLayer(card) : `
              <div class="fc-front-glow"
                   style="background:radial-gradient(circle at 35% 30%,${card.color}28,transparent 60%)"></div>
              ${_sym(card, 44)}
            `}
            <div class="fc-front-name">${card.name}</div>
            <div class="fc-front-kw" style="color:${card.color}">${card.keyword}</div>
          </div>
        </div>
      </div>
      <div class="fc-tap-hint">탭해서 카드를 확인해봐 ✦</div>`;
    ct.querySelector('.fc-deck-view').appendChild(zone);

    setTimeout(() => zone.classList.add('visible'), 80);
  }

  // ── 플립 공개 ──
  global._fcReveal = function(cardId) {
    const wrap = document.getElementById('fcFlipWrap');
    if (!wrap || wrap.classList.contains('flipped')) return;
    wrap.classList.add('flipped');
    wrap.onclick = null;

    const card = TAROT_MAJOR.find(c => c.id === cardId);
    if (!card) return;
    _currentCard = card;

    setDailyState(card.id, _currentCat);

    setTimeout(() => _showResult(card, false), 700);
  };

  global._fcReroll = function() {
    const daily = getDailyState();
    const remaining = getRemainingRerolls();
    if (!daily || remaining <= 0) return;

    const nextCount = getRerollCount() + 1;
    const nextDeck = TAROT_MAJOR.filter(item => item.id !== daily.cardId);
    const nextCard = nextDeck[Math.floor(Math.random() * nextDeck.length)] || TAROT_MAJOR[0];

    _currentCard = nextCard;
    _currentCat = daily.cat || _currentCat || 'daily';
    setDailyState(nextCard.id, _currentCat, {
      rerollCount: nextCount,
      chatFreeUsed: daily.chatFreeUsed || false,
    });
    _showResult(nextCard, true);
  };

  // ── 결과 화면 ──
  function _showResult(card, isAlreadyDrawn) {
    const ct = document.getElementById('fcContainer');
    if (!ct) return;

    const catLabel = { daily:'오늘의 운세', love:'연애운', work:'직업운', advice:'조언' }[_currentCat] || '오늘의 운세';
    const msg = card.msgs[_currentCat] || card.upright;
    const streak = updateStreak();
    const remainingRerolls = getRemainingRerolls();
    const rerollUsed = getRerollCount();
    const rerollDisabled = remainingRerolls <= 0;
    const nextCountdown = _countdownToTomorrowKst();
    const image = _cardImage(card);

    ct.innerHTML = `
      <div class="fc-result-view">
        ${_menuHtml('draw')}
        ${isAlreadyDrawn ? `<div class="fc-already-badge">// 오늘의 포춘쿠키 열림 · ${catLabel}</div>` : ''}
        <div class="fc-routine-panel">
          <div class="fc-routine-title">${isAlreadyDrawn ? '오늘의 카드는 이미 열렸어요' : '오늘의 포춘쿠키 열림'}</div>
          <div class="fc-routine-copy">내일 다시 새로운 카드가 도착해요 · KST 자정까지 ${nextCountdown}</div>
          <div class="fc-routine-copy">연속 리딩 ${streak.count}일 · 3일 보너스 질문권 · 7일 월간 인사이트</div>
          ${streak.rewardMessage ? `<div class="fc-routine-reward">${streak.rewardMessage}</div>` : ''}
        </div>
        <div class="fc-result-badge" style="color:${card.color};border-color:${card.color}55">
          ${card.num} · ${catLabel}
        </div>
        <div class="fc-result-card-wrap">
          <div class="fc-result-card ${image ? 'has-image' : ''}"
               style="${image ? '' : `background:${_cardBg(card)};`}border:1px solid ${card.color}55">
            ${image ? _cardImageLayer(card) : `
              <div class="fc-front-glow"
                   style="background:radial-gradient(circle at 35% 30%,${card.color}28,transparent 60%)"></div>
              ${_sym(card, 52)}
            `}
            <div class="fc-front-name" style="font-size:13px">${card.name}</div>
            <div class="fc-front-kw" style="color:${card.color};font-size:9px">${card.keyword}</div>
          </div>
        </div>
        <div class="fc-result-msg">${msg}</div>
        <div class="fc-result-upright">
          <div class="fc-result-upright-label">정방향 의미</div>
          <div class="fc-result-upright-text">${card.upright}</div>
        </div>
        <div class="fc-cta-area">
          <button class="fc-chat-btn" onclick="_fcOpenChat()">
            ✨ 이 카드에 대해 더 물어보기
          </button>
          <div class="fc-cta-hint">첫 3번은 무료 · 이후 코인 필요</div>
          <div class="fc-result-actions">
            <button class="fc-reroll-btn" onclick="_fcReroll()" ${rerollDisabled ? 'disabled' : ''}>
              다시 뽑기 ${rerollDisabled ? '(오늘 완료)' : `(${remainingRerolls}/3 남음)`}
            </button>
            <button class="fc-ghost-btn" onclick="_fcCreateContent('${card.id}')">이 감정으로 콘텐츠 만들기</button>
            <button class="fc-ghost-btn" onclick="_fcShowView('library')">카드덱 보기</button>
            <button class="fc-ghost-btn" onclick="_fcOpenCard('${card.id}')">카드 해석</button>
          </div>
          <div class="fc-tomorrow">${rerollDisabled ? '🌙 오늘 다시 뽑기는 모두 사용했어' : `오늘 다시 뽑기 ${rerollUsed}/3회 사용`}</div>
          <div id="fcContentOutput"></div>
        </div>
      </div>`;
  }

  function _menuHtml(active) {
    const activeTab = _qaOpen ? 'qa' : active;
    const item = (id, label, tabId = id) => `
      <button class="fc-menu-btn fortune-tab ${activeTab === id ? 'active' : ''}" data-tab="${tabId}" type="button" role="tab" aria-selected="${activeTab === id ? 'true' : 'false'}" onclick="_fcShowView(event, '${id}')">${label}</button>`;
    return `<div class="fc-menu-wrap ${_qaOpen ? 'qa-open' : ''}">
      <nav class="fc-top-menu fortune-tabs" role="tablist" aria-label="타로 메뉴">
        ${item('daily',  '오늘운세')}
        ${item('love',   '애정운')}
        ${item('wealth', '재물운', 'money')}
        ${item('biz',    '사업운', 'career')}
        <button class="fc-menu-btn fortune-tab ${activeTab === 'qa' ? 'active' : ''}" data-tab="qa" type="button" role="tab" aria-selected="${activeTab === 'qa' ? 'true' : 'false'}" aria-expanded="${activeTab === 'qa' ? 'true' : 'false'}" onclick="_fcToggleQa(event)">Q&A</button>
      </nav>
      ${_qaOpen ? `<div class="fc-qa-panel" id="fcQaPanel">
        <div class="fc-qa-item">
          <div class="fc-qa-q">Q. 어떻게 사용해?</div>
          <div class="fc-qa-a">애정운, 재물운, 사업운 중 보고 싶은 주제를 고른 뒤 카드 3장을 선택해. 선택한 순서대로 현재 흐름, 기회/주의점, 앞으로의 방향을 읽어줘.</div>
        </div>
        <div class="fc-qa-item">
          <div class="fc-qa-q">Q. 카드는 다시 고를 수 있어?</div>
          <div class="fc-qa-a">선택한 카드를 한 번 더 누르면 취소할 수 있어. 이미 3장을 골랐다면 셔플로 처음부터 다시 섞을 수도 있어.</div>
        </div>
        <div class="fc-qa-item">
          <div class="fc-qa-q">Q. 결과는 확정된 미래야?</div>
          <div class="fc-qa-a">아니야. VenuX 타로는 미래를 단정하지 않고, 지금의 감정과 선택지를 정리하는 상징적 리딩이야.</div>
        </div>
        <div class="fc-qa-item">
          <div class="fc-qa-q">Q. 결과를 어떻게 활용하면 좋아?</div>
          <div class="fc-qa-a">마음에 남는 키워드 하나를 고르고, 오늘 바로 할 수 있는 작은 행동으로 바꿔봐. 필요하면 결과에서 콘텐츠 생성으로 이어갈 수 있어.</div>
        </div>
      </div>` : ''}
    </div>`;
  }

  const _CAT_LABELS = { daily: '오늘운세', love: '애정운', wealth: '재물운', biz: '사업운' };

  global._fcShowView = function(eventOrView, maybeView) {
    const event = maybeView ? eventOrView : null;
    const view = maybeView || eventOrView;
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    _qaOpen = false; // 카테고리 전환 시 Q&A 패널 닫기
    _activeView = view || 'love';
    _renderScreen();
  };

  global._fcToggleQa = function(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    _qaOpen = !_qaOpen;
    _renderScreen();
  };

  global._fcLibFlip = function(el) {
    const isFlipped = el.classList.contains('flipped');
    // 다른 카드 전부 닫기
    document.querySelectorAll('.fc-lib-flip-wrap').forEach(c => c.classList.remove('flipped'));
    // 선택한 카드: 이미 열려 있으면 닫기, 아니면 열기
    if (!isFlipped) el.classList.add('flipped');
  };

  global._fcOpenCard = function(cardId) {
    _activeView = 'library';
    _selectedCardId = cardId;
    _showLibrary();
  };

  function _showLibrary() {
    const ct = document.getElementById('fcContainer');
    if (!ct) return;
    const selected = TAROT_MAJOR.find(c => c.id === _selectedCardId);
    ct.innerHTML = `
      <div class="fc-library-view">
        ${_menuHtml('library')}
        <div class="fc-section-head">
          <div class="fc-eyebrow">// MAJOR ARCANA</div>
          <div class="fc-section-title">카드덱</div>
          <div class="fc-section-sub">22장의 메이저 아르카나 의미를 먼저 확인해봐</div>
        </div>
        ${selected ? _cardDetailHtml(selected) : _libraryGridHtml()}
      </div>`;
  }

  function _libraryGridHtml() {
    return `<div class="fc-library-grid">
      ${TAROT_MAJOR.map(card => `
        <div class="fc-lib-flip-wrap" onclick="_fcLibFlip(this)">
          <div class="fc-lib-flip-inner">
            <div class="fc-lib-card-face fc-lib-back" style="background:${_cardBg(card)}">
              <div class="fc-lib-back-glyph">✦</div>
              <div class="fc-lib-back-num">${card.num}</div>
            </div>
            <div class="fc-lib-card-face fc-lib-front" style="background:${_cardBg(card)};--fc-card-color:${card.color}">
              <div class="fc-lib-front-glow"></div>
              <div class="fc-lib-front-num">${card.num}</div>
              <div class="fc-lib-front-name">${card.name}</div>
              <div class="fc-lib-front-kw" style="color:${card.color}">${card.keyword}</div>
              <button class="fc-lib-front-detail" onclick="event.stopPropagation();_fcOpenCard('${card.id}')">자세히 →</button>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
  }

  function _cardDetailHtml(card) {
    const image = _cardImage(card);
    return `<div class="fc-card-detail">
      <div class="fc-detail-top">
        <div class="fc-detail-mini ${image ? 'has-image' : ''}" style="${image ? '' : `background:${_cardBg(card)};`}border:1px solid ${card.color}44">
          ${image ? _cardImageLayer(card) : `
            <div class="fc-front-glow" style="background:radial-gradient(circle at 35% 30%,${card.color}28,transparent 60%)"></div>
            ${_sym(card, 34)}
          `}
        </div>
        <div class="fc-detail-text">
          <div class="fc-detail-kicker">${card.num} · MAJOR ARCANA</div>
          <div class="fc-detail-name">${card.name}</div>
          <div class="fc-detail-keyword" style="color:${card.color}">${card.keyword}</div>
        </div>
      </div>
      <div class="fc-detail-block">
        <div class="fc-detail-label">정방향</div>
        <div class="fc-detail-body">${card.upright}</div>
      </div>
      <div class="fc-detail-block">
        <div class="fc-detail-label">역방향</div>
        <div class="fc-detail-body">${card.reversed}</div>
      </div>
      <div class="fc-detail-block">
        <div class="fc-detail-label">오늘의 조언</div>
        <div class="fc-detail-body">${card.msgs.advice || card.upright}</div>
      </div>
      <div class="fc-result-actions">
        <button class="fc-ghost-btn" onclick="_fcOpenCard(null)">전체 보기</button>
        <button class="fc-ghost-btn" onclick="_fcShowView('draw')">오늘 뽑기</button>
      </div>
    </div>`;
  }

  global._fcCreateContent = function(cardId) {
    const card = TAROT_MAJOR.find(c => c.id === cardId) || _currentCard;
    if (!card) return;
    const out = document.getElementById('fcContentOutput');
    if (!out) return;

    const kit = _buildTarotContentKit(card, _currentCat);
    out.innerHTML = `
      <div class="fc-content-panel">
        <div class="fc-content-head">오늘의 감정 콘텐츠 시드</div>
        <div class="fc-content-sub">${card.name} · ${card.keyword} 흐름을 바로 제작 가능한 형태로 정리했어.</div>
        <div class="fc-content-block">
          <div class="fc-content-label">Shortform Ideas</div>
          <div class="fc-content-text">${kit.shortformIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}</div>
        </div>
        <div class="fc-content-block">
          <div class="fc-content-label">Image Prompt</div>
          <div class="fc-content-text">${kit.imagePrompt}</div>
        </div>
        <div class="fc-content-block">
          <div class="fc-content-label">Video Prompt</div>
          <div class="fc-content-text">${kit.videoPrompt}</div>
        </div>
        <div class="fc-content-block">
          <div class="fc-content-label">Threads / X</div>
          <div class="fc-content-text">${kit.socialPost}</div>
        </div>
        <div class="fc-content-block">
          <div class="fc-content-label">Moodboard Seed</div>
          <div class="fc-content-text">${kit.moodboardKeywords.join(' · ')}</div>
        </div>
      </div>`;
  };

  function _buildTarotContentKit(card, cat) {
    const catLabel = { daily:'오늘의 운세', love:'관계', work:'일', advice:'조언' }[cat] || '오늘';
    const mood = card.keyword.split('·').map(v => v.trim()).filter(Boolean);
    const message = card.msgs?.[cat] || card.upright;

    return {
      shortformIdeas: [
        `${card.name} 카드로 여는 15초 루틴: "${mood[0] || card.keyword}"을 오늘 한 장면으로 보여주기`,
        `${catLabel} POV 숏폼: ${message}를 대사 1줄, 손동작 1개, 클로즈업 1컷으로 구성`,
        `Mystic pixel 브이로그: 오늘의 감정을 카드 색(${card.color}) 조명과 자막 키워드로 전환`,
      ],
      imagePrompt: `Mystic pixel AI creator moodboard, tarot card "${card.name}", ${card.keyword}, deep violet night, neon pixel stars, emotional but practical, soft cinematic glow, vertical composition, no scary mood`,
      videoPrompt: `9:16 short-form video, VenuX mystic pixel style. Start with a close-up of a glowing tarot card named ${card.name}, transition into a creator desk scene, overlay keywords "${card.keyword}", end with one practical action inspired by: ${message}`,
      socialPost: `오늘의 카드는 ${card.name}. ${message} 확정된 예언보다, 지금 내 선택을 정리하는 작은 신호로 받아두기.`,
      moodboardKeywords: [
        'mystic pixel',
        'deep violet',
        card.name,
        ...mood,
        'AI creator desk',
        'soft neon',
        'fortune cookie ritual',
      ],
    };
  }

  function _showGuide() {
    const ct = document.getElementById('fcContainer');
    if (!ct) return;
    ct.innerHTML = `
      <div class="fc-guide-view">
        ${_menuHtml('guide')}
        <div class="fc-section-head">
          <div class="fc-eyebrow">// TAROT GUIDE</div>
          <div class="fc-section-title">이용 안내</div>
          <div class="fc-section-sub">카드 뽑기, AI 채팅, 크레딧 규칙을 확인해봐</div>
        </div>
        <div class="fc-guide-list">

          <div class="fc-guide-item">
            <div class="fc-guide-label">🃏 하루 한 장</div>
            <div class="fc-guide-copy">카드는 하루 1장. 자정(KST) 이후 새 카드가 열려. 카테고리(오늘의 운세·연애운·직업운·조언)는 뽑기 전에만 바꿀 수 있어.</div>
          </div>

          <div class="fc-guide-item">
            <div class="fc-guide-label">🔄 다시 뽑기</div>
            <div class="fc-guide-copy">뽑은 카드가 마음에 들지 않으면 다시 뽑기를 쓸 수 있어. 하루 최대 3회까지 가능하고, 자정이 지나면 초기화돼.</div>
          </div>

          <div class="fc-guide-item">
            <div class="fc-guide-label">✦ AI 타로 채팅</div>
            <div class="fc-guide-copy">카드를 열면 AI와 1:1 채팅을 시작할 수 있어. 타로 카드 데이터와 리딩 텍스트를 바탕으로 답해줘. 첫 3회 질문은 무료야.</div>
          </div>

          <div class="fc-guide-item">
            <div class="fc-guide-label">🪙 코인 & 크레딧</div>
            <div class="fc-guide-copy">무료 질문 3회 이후부터는 코인이 1개씩 차감돼. 코인이 부족하면 결제 페이지로 이동해. 연속 리딩 보상으로도 코인을 받을 수 있어.</div>
          </div>

          <div class="fc-guide-item">
            <div class="fc-guide-label">🔥 연속 리딩 보상</div>
            <div class="fc-guide-copy">매일 카드를 뽑으면 연속 일수가 쌓여. 3일 연속 → 보너스 질문권 1개 자동 지급. 7일 연속 → 월간 인사이트 기능이 해금돼.</div>
          </div>

          <div class="fc-guide-item">
            <div class="fc-guide-label">🎨 콘텐츠 시드</div>
            <div class="fc-guide-copy">카드를 열면 "이 감정으로 콘텐츠 만들기" 버튼이 생겨. Shortform 아이디어, 이미지/영상 프롬프트, SNS 문구를 한 번에 뽑아줄게.</div>
          </div>

          <div class="fc-guide-item">
            <div class="fc-guide-label">📚 카드덱</div>
            <div class="fc-guide-copy">상단 '카드덱' 탭에서 메이저 아르카나 22장의 의미를 미리 볼 수 있어. 뽑기 전에 카드를 공부하고 싶을 때 참고해.</div>
          </div>

        </div>
      </div>`;
  }


  // ════════════════════════════════════════════════════════
  //  6. AI Tarot Chat
  // ════════════════════════════════════════════════════════

  global._fcOpenChat = function() {
    if (!_currentCard) return;

    _chatHistory = [];
    _chatMsgCount = 0;

    const overlay = document.getElementById('tarotChatOverlay');
    if (!overlay) return;

    // 헤더 제목
    const titleEl = overlay.querySelector('#tccTitle');
    if (titleEl) titleEl.textContent = `${_currentCard.name} · 타로 채팅`;

    // 코인 배지
    const daily = getDailyState();
    const coinEl = overlay.querySelector('#tccCoinBadge');
    if (coinEl) {
      if (daily && !daily.chatFreeUsed) {
        coinEl.textContent = '첫 3회 무료';
      } else {
        const coins = _getCoins();
        coinEl.textContent = `🪙 ${coins}`;
      }
    }

    // 채팅 바디 초기화
    const body = document.getElementById('tccBody');
    if (body) {
      body.innerHTML = `
        <div class="tcc-intro-wrap">
          <div class="tcc-intro-card"
               style="background:${_cardBg(_currentCard)};border-color:${_currentCard.color}44">
            <div class="tcc-intro-glow"
                 style="background:radial-gradient(circle at 35% 30%,${_currentCard.color}28,transparent 60%)"></div>
            ${_sym(_currentCard, 28)}
          </div>
          <div class="tcc-intro-info">
            <div class="tcc-intro-name" style="color:${_currentCard.color}">${_currentCard.name}</div>
            <div class="tcc-intro-kw">${_currentCard.keyword}</div>
          </div>
        </div>
        <div class="tcc-sys-msg">오늘의 카드 <b>${_currentCard.name}</b>에 대해<br>무엇이든 물어봐 ✦</div>
        <div class="tcc-free-badge">첫 3회 무료 · 이후 코인 1개/회</div>`;
    }

    const input = document.getElementById('tccInput');
    if (input) { input.value = ''; _tccResize(input); }
    const sendBtn = document.getElementById('tccSend');
    if (sendBtn) sendBtn.disabled = true;

    // 오버레이 열기
    requestAnimationFrame(() => overlay.classList.add('open'));
  };

  global._tcClose = function() {
    const overlay = document.getElementById('tarotChatOverlay');
    if (overlay) overlay.classList.remove('open');
  };

  global._tccOnInput = function() {
    const ta = document.getElementById('tccInput');
    const btn = document.getElementById('tccSend');
    if (ta && btn) {
      btn.disabled = !ta.value.trim();
      _tccResize(ta);
    }
  };

  function _tccResize(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  global._tcSend = async function() {
    const ta = document.getElementById('tccInput');
    if (!ta) return;
    const text = ta.value.trim();
    if (!text) return;

    // 코인 확인
    const daily = getDailyState();
    const freeCount = 3;
    if (_chatMsgCount >= freeCount) {
      // 코인 차감 시도
      if (!_deductTarotCoin()) {
        if (global.openCoinPaywall) global.openCoinPaywall('tarot');
        else if (global.window?.openCoinPaywall) global.window.openCoinPaywall('tarot');
        return;
      }
    }

    ta.value = ''; _tccResize(ta);
    document.getElementById('tccSend').disabled = true;

    // 사용자 말풍선
    const body = document.getElementById('tccBody');
    body.insertAdjacentHTML('beforeend', `
      <div class="tcc-msg-row user">
        <div class="tcc-bubble user">${_escape(text)}</div>
      </div>`);
    _scrollTccBottom();

    // 타이핑 인디케이터
    const typId = 'tccTyp_' + Date.now();
    body.insertAdjacentHTML('beforeend', `
      <div class="tcc-msg-row ai" id="${typId}">
        <div class="tcc-avatar">✦</div>
        <div class="tcc-typing">
          <div class="tcc-dot"></div><div class="tcc-dot"></div><div class="tcc-dot"></div>
        </div>
      </div>`);
    _scrollTccBottom();

    // 카드 데이터 기반 응답. 브라우저 localStorage의 OpenAI 키는 사용하지 않는다.
    _chatHistory.push({ role: 'user', content: text });
    const reply = _tarotFallbackReply(_currentCard, text);
    _chatHistory.push({ role: 'assistant', content: reply });

    // 타이핑 제거 + 응답 표시
    document.getElementById(typId)?.remove();
    body.insertAdjacentHTML('beforeend', `
      <div class="tcc-msg-row ai">
        <div class="tcc-avatar">✦</div>
        <div class="tcc-bubble ai">${_escape(reply)}</div>
      </div>`);
    _scrollTccBottom();

    _chatMsgCount++;
    document.getElementById('tccSend').disabled = false;

    // 첫 3회 무료 이후 표시 업데이트
    if (_chatMsgCount === freeCount) {
      body.insertAdjacentHTML('beforeend', `
        <div class="tcc-sys-msg" style="margin-top:12px">
          무료 3회를 사용했어. 이후는 코인이 필요해 🪙
        </div>`);
      _scrollTccBottom();
    }
    if (_chatMsgCount >= freeCount) markChatFreeUsed();
  };

  function _scrollTccBottom() {
    requestAnimationFrame(() => {
      const body = document.getElementById('tccBody');
      if (body) body.scrollTop = body.scrollHeight;
    });
  }

  function _buildTarotSystemPrompt(card, cat) {
    const catKr = { daily:'오늘의 운세', love:'연애운', work:'직업운', advice:'조언' }[cat] || '오늘의 운세';
    return `당신은 VenuX의 타로 리더입니다. 신비롭고 따뜻한 성격을 가지고 있어요.

오늘 사용자가 뽑은 카드: ${card.name} (${card.num})
키워드: ${card.keyword}
카드 의미: ${card.upright}
카드 배경: ${card.ai_context}
오늘의 질문 주제: ${catKr}

답변 규칙:
- 2~4문장으로 짧고 감성적으로 답해
- 한국어, 반말 사용
- 오늘 뽑은 카드를 중심으로 해석해줘
- 단정적이지 않게, 가능성과 에너지를 이야기해줘
- 공감하고 따뜻하게 마무리해
- 타로 리딩이지만 지나치게 신비주의적이지 않게`;
  }

  function _tarotFallbackReply(card, text) {
    const replies = [
      `${card.name} 카드가 말하고 있어. ${card.upright}`,
      `오늘의 에너지는 "${card.keyword}"야. ${card.msgs.advice || card.upright}`,
      `${card.name}이 네 질문에 답하고 있어. 지금 이 에너지를 느껴봐.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  function _escape(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }


  // ════════════════════════════════════════════════════════
  //  7. 코인 통합 (기존 시스템 thin wrapper)
  // ════════════════════════════════════════════════════════
  function _getCoins() {
    try {
      const db = JSON.parse(localStorage.getItem('venux_daily_db') || '{}');
      return (db.coins && db.coins.tarot !== undefined) ? db.coins.tarot : 3;
    } catch { return 3; }
  }

  function _deductTarotCoin() {
    // 기존 vxDeductCoin 사용 (있으면)
    if (typeof global.vxDeductCoin === 'function') return global.vxDeductCoin('tarot');
    // 직접 처리 (fallback)
    try {
      const db = JSON.parse(localStorage.getItem('venux_daily_db') || '{}');
      if (!db.coins) db.coins = {};
      if (!db.coins.tarot) db.coins.tarot = 0;
      if (db.coins.tarot <= 0) return false;
      db.coins.tarot--;
      localStorage.setItem('venux_daily_db', JSON.stringify(db));
      return true;
    } catch { return true; }
  }


  // ════════════════════════════════════════════════════════
  //  8. 기존 함수 오버라이드 (안전하게 덮어쓰기)
  // ════════════════════════════════════════════════════════
  global.renderTarotPage = _renderScreen;
  global.tarotReset      = _renderScreen;

  // 기존 코드가 호출할 수 있는 구버전 함수들 — 무력화
  global.tarotDraw   = function() { _fcDraw(); };
  global.setTarotCat = function(btn) { _fcSetCat(btn); };


  // ════════════════════════════════════════════════════════
  //  9. 초기화 — DOM Ready 이후 실행
  // ════════════════════════════════════════════════════════
  function _init() {
    // 코인 시스템에 tarot 타입 등록 (없으면 추가)
    try {
      const db = JSON.parse(localStorage.getItem('venux_daily_db') || '{}');
      if (!db.coins) db.coins = {};
      if (db.coins.tarot === undefined) {
        db.coins.tarot = 3; // 무료 3회
        localStorage.setItem('venux_daily_db', JSON.stringify(db));
      }
    } catch {}

    // 현재 활성 탭이 screen-tarot이면 즉시 렌더
    const activeTab = document.querySelector('.tab-bar-item.active');
    if (activeTab && activeTab.dataset.tab === 'screen-tarot') {
      _renderScreen();
    }

    // screen-tarot가 열릴 때 렌더 (switchTab에서 호출됨)
    // renderTarotPage 오버라이드로 자동 처리됨
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})(window);
