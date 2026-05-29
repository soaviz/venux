// ════════════════════════════════════════════════════════════
//  VENUX TAROT · 3-Card Pick Reading (22장 · 셔플 · 플립)
// ════════════════════════════════════════════════════════════
(function (global) {
  'use strict';

  const MAX_SELECTION = 3;
  const SLOT_LABELS = ['애정운', '재물운', '학업&취업운'];

  const CAT_SLOT_LABELS = {
    love:   ['현재 감정', '상대의 마음', '관계의 흐름'],
    wealth: ['현재 재정', '기회 흐름',   '앞으로의 방향'],
    biz:    ['현재 사업', '기회/위기',   '앞으로의 방향'],
  };
  const CAT_GUIDE = {
    love:   '💜 사랑과 감정의 흐름을 카드 3장으로 살펴봐',
    wealth: '💛 돈과 기회의 흐름을 카드 3장으로 살펴봐',
    biz:    '🔶 사업과 커리어의 흐름을 카드 3장으로 살펴봐',
  };
  function getSlotLabels() {
    return CAT_SLOT_LABELS[state.category] || SLOT_LABELS;
  }
  const SHUFFLE_MS = 2000;

  const _CSS = `
  .tp3-root {
    min-height: 100%; display: flex; flex-direction: column;
    padding: 16px 14px calc(24px + env(safe-area-inset-bottom, 0px));
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,85,247,0.22), transparent 55%),
      radial-gradient(circle at 20% 80%, rgba(212,175,55,0.06), transparent 40%),
      linear-gradient(180deg, #0a0612 0%, #12081f 45%, #07040e 100%);
    color: #fff; -webkit-tap-highlight-color: transparent;
  }
  .tp3-guide {
    text-align: center; font-size: 14px; line-height: 1.65;
    color: rgba(255,255,255,0.72); font-weight: 500;
    margin: 8px 8px 18px; letter-spacing: -.01em;
  }
  .tp3-slots {
    display: flex; justify-content: center; align-items: flex-start;
    gap: 10px; margin-bottom: 22px;
  }
  .tp3-slot {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    width: 156px; flex-shrink: 0;
  }
  .tp3-slot-label {
    font-size: 10px; font-weight: 800; letter-spacing: .06em;
    color: rgba(212,175,55,0.85); text-transform: none;
  }
  .tp3-slot-card {
    width: 100%; aspect-ratio: 2 / 3;
    border-radius: 10px; position: relative; overflow: hidden;
    border: 1px dashed rgba(212,175,55,0.35);
    background: rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
  }
  .tp3-slot-card.filled {
    border-style: solid; border-color: rgba(212,175,55,0.55);
    box-shadow: 0 0 20px rgba(212,175,55,0.2);
  }
  .tp3-slot-empty {
    font-size: 18px; font-weight: 800; letter-spacing: .03em;
    color: rgba(212,175,55,0.85); text-align: center; padding: 8px 6px;
    line-height: 1.3;
  }
  .tp3-slot-mini {
    width: 100%; height: 100%; border-radius: 11px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 6px 4px; text-align: center;
    position: relative; overflow: hidden;
  }
  .tp3-slot-mini-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center; z-index: 0;
  }
  .tp3-slot-mini-shade {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(180deg, transparent 34%, rgba(0,0,0,0.58) 100%);
    pointer-events: none;
  }
  .tp3-slot-mini-num {
    position: relative; z-index: 2;
    font-family: var(--vx-font-mono, monospace); font-size: 8px;
    color: rgba(255,255,255,0.35); margin-bottom: 4px;
  }
  .tp3-slot-mini-name {
    position: relative; z-index: 2;
    font-size: 11px; font-weight: 800; line-height: 1.25;
    text-shadow: 0 1px 10px rgba(0,0,0,0.9);
  }
  .tp3-grid-wrap { flex: 1; min-height: 0; }
  .tp3-grid {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px; padding: 4px 0 16px;
    transition: opacity .2s;
  }
  @media (min-width: 380px) { .tp3-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; } }
  @media (min-width: 480px) { .tp3-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; } }
  .tp3-grid.is-locked { pointer-events: none; opacity: .55; }
  .tp3-grid.is-shuffling .tp3-card-btn {
    animation: tp3Scatter 1.7s cubic-bezier(0.4,0,0.2,1) both;
    animation-delay: calc(var(--tp3-idx, 0) * 0.03s);
  }
  @keyframes tp3Scatter {
    0%   { transform: translate(0,0) rotate(0deg) scale(1); }
    12%  { transform: translate(var(--tp3-sx,6px), var(--tp3-sy,-9px)) rotate(var(--tp3-sr,-9deg)) scale(.84); }
    30%  { transform: translate(calc(var(--tp3-sx,6px)*-0.85), calc(var(--tp3-sy,-9px)*0.65)) rotate(calc(var(--tp3-sr,-9deg)*-1.4)) scale(1.07); }
    50%  { transform: translate(calc(var(--tp3-sx,6px)*0.55), calc(var(--tp3-sy,-9px)*-0.75)) rotate(calc(var(--tp3-sr,-9deg)*0.7)) scale(.91); }
    68%  { transform: translate(calc(var(--tp3-sx,6px)*-0.30), calc(var(--tp3-sy,-9px)*0.40)) rotate(calc(var(--tp3-sr,-9deg)*-0.35)) scale(1.03); }
    84%  { transform: translate(calc(var(--tp3-sx,6px)*0.12), calc(var(--tp3-sy,-9px)*-0.15)) rotate(calc(var(--tp3-sr,-9deg)*0.12)) scale(.99); }
    100% { transform: translate(0,0) rotate(0deg) scale(1); }
  }
  .tp3-card-btn {
    width: 100%; min-height: 0; aspect-ratio: 2 / 3;
    padding: 0; border: none; background: transparent; cursor: pointer;
    perspective: 640px; border-radius: 10px;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .tp3-card-btn:disabled { cursor: default; }
  .tp3-card-inner {
    width: 100%; height: 100%; position: relative;
    transform-style: preserve-3d;
    transition: transform .5s ease;
    border-radius: 10px;
  }
  .tp3-card-btn.is-flipped .tp3-card-inner { transform: rotateY(180deg); }
  .tp3-card-btn.is-selected .tp3-card-inner {
    filter: drop-shadow(0 0 10px rgba(212,175,55,0.65));
  }
  .tp3-card-btn.is-selected { transform: scale(1.04); }
  .tp3-card-btn.is-done { opacity: .42; pointer-events: none; }
  .tp3-face {
    position: absolute; inset: 0; border-radius: 10px;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    overflow: hidden;
  }
  .tp3-face-back {
    background:
      radial-gradient(ellipse 70% 60% at 50% 42%, rgba(110,40,180,0.34) 0%, transparent 62%),
      radial-gradient(circle at 18% 78%, rgba(212,175,55,0.10) 0%, transparent 36%),
      radial-gradient(circle at 82% 22%, rgba(160,80,255,0.12) 0%, transparent 36%),
      linear-gradient(160deg, #180638 0%, #0c0420 45%, #130828 70%, #090316 100%);
    border: 1px solid rgba(212,175,55,0.42);
    box-shadow:
      inset 0 0 36px rgba(120,50,200,0.16),
      inset 0 0 10px rgba(212,175,55,0.07);
  }
  .tp3-card-back-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center; z-index: 0;
  }
  .tp3-card-back-img ~ .tp3-back-stars,
  .tp3-card-back-img ~ .tp3-back-mandala,
  .tp3-card-back-img ~ .tp3-back-label {
    display: none;
  }
  .tp3-face-back::before {
    content: ''; position: absolute; inset: 4px; border-radius: 7px;
    border: 1px solid rgba(212,175,55,0.18); pointer-events: none; z-index: 1;
  }
  .tp3-back-stars {
    position: absolute; width: 1px; height: 1px; top: 0; left: 0;
    pointer-events: none; z-index: 0;
    box-shadow:
      11px  9px 0 rgba(255,255,255,0.55),
      23px 19px 0 rgba(212,175,55,0.45),
      35px  7px 0 rgba(255,255,255,0.38),
      17px 51px 0 rgba(255,255,255,0.48),
      53px 15px 0 rgba(212,175,55,0.35),
      61px 43px 0 rgba(255,255,255,0.42),
       7px 67px 0 rgba(255,255,255,0.32),
      71px 71px 0 rgba(212,175,55,0.48),
      43px 63px 0 rgba(255,255,255,0.36),
      75px 19px 0 rgba(255,255,255,0.32),
      15px 35px 0 rgba(180,100,255,0.44),
      87px 55px 0 rgba(255,255,255,0.30),
       5px 28px 0 rgba(212,175,55,0.30),
      68px  8px 0 rgba(255,255,255,0.36),
      82px 38px 0 rgba(180,100,255,0.32);
  }
  .tp3-back-mandala {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 80%; pointer-events: none; z-index: 2;
  }
  .tp3-back-label {
    position: absolute; bottom: 7px; left: 0; right: 0; z-index: 3;
    text-align: center; font-family: var(--vx-font-mono, monospace);
    font-size: 6px; letter-spacing: .20em; text-transform: uppercase;
    color: rgba(212,175,55,0.30); pointer-events: none;
  }
  .tp3-face-front {
    transform: rotateY(180deg);
    display: block;
    border: 1px solid rgba(255,255,255,0.12);
    padding: 0; overflow: hidden;
    position: absolute;
  }
  /* illustration zone */
  .tp3-front-illus {
    position: absolute; inset: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .tp3-front-illus-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(circle at 50% 38%, var(--tp3-card-color, #c77dff) 0, transparent 58%);
    opacity: .36;
  }
  .tp3-front-sym-lg {
    position: relative; z-index: 1;
  }
  .tp3-front-sym-lg svg { width: 42px !important; height: 42px !important; }
  .tp3-card-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    z-index: 2; border-radius: inherit;
  }
  /* info bar at bottom */
  .tp3-front-info {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 4;
    width: 100%; padding: 18px 5px 7px;
    background: linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 58%, transparent 100%);
    text-align: center;
  }
  .tp3-front-num {
    font-family: var(--vx-font-mono, monospace); font-size: 6px;
    letter-spacing: .12em; color: rgba(255,255,255,0.35);
  }
  .tp3-front-name { font-size: 9px; font-weight: 800; line-height: 1.2; color: #fff; }
  .tp3-front-kw { font-size: 7px; font-weight: 700; margin-top: 2px; opacity: .88; }
  /* 뒷면 - 한번 더 누르면 이름 표시 */
  .tp3-back-name {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 5;
    padding: 4px 4px 7px;
    background: linear-gradient(0deg, rgba(8,2,18,0.92) 0%, transparent 100%);
    text-align: center;
    font-size: 9px; font-weight: 800;
    color: rgba(212,175,55,0.90);
    opacity: 0; pointer-events: none;
    transition: opacity .25s;
  }
  .tp3-face-back.is-peeked .tp3-back-name { opacity: 1; }
  .tp3-actions {
    display: grid; grid-template-columns: 1fr 1.2fr; gap: 10px;
    padding-top: 8px; position: sticky; bottom: 0;
    background: linear-gradient(180deg, transparent, rgba(7,4,14,0.92) 28%);
  }
  .tp3-btn {
    min-height: 48px; border-radius: 999px; border: none;
    font-size: 14px; font-weight: 800; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform .12s, opacity .15s, box-shadow .15s;
  }
  .tp3-btn:active:not(:disabled) { transform: scale(.97); }
  .tp3-btn-shuffle {
    background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.78);
    border: 1px solid rgba(212,175,55,0.28);
  }
  .tp3-btn-read {
    background: linear-gradient(135deg, #7b2ff7, #c77dff);
    color: #fff; box-shadow: 0 6px 24px rgba(199,125,255,0.35);
  }
  .tp3-btn:disabled {
    opacity: .38; cursor: not-allowed; box-shadow: none;
    background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.35);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .tp3-btn-read:disabled {
    background: rgba(255,255,255,0.06);
  }
  .tp3-modal-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,0.62); display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .tp3-modal {
    width: min(100%, 320px); border-radius: 20px;
    background: linear-gradient(160deg, #1a0d2e, #0f0618);
    border: 1px solid rgba(199,125,255,0.28);
    padding: 22px 18px; text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .tp3-modal p { font-size: 14px; line-height: 1.65; color: rgba(255,255,255,0.78); margin-bottom: 18px; }
  .tp3-modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .tp3-modal-actions .tp3-btn { min-height: 44px; border-radius: 14px; font-size: 13px; }
  /* ── 리딩 결과 플립 카드 ── */
  /* ── 결과 세로 스택 ── */
  .tp3-result-stack {
    display: flex; flex-direction: column; gap: 40px;
    margin: 8px 0 16px;
  }
  .tp3-rstack-item {
    display: flex; flex-direction: column; align-items: center; gap: 0;
    text-align: center; width: 100%;
  }
  /* 카드명 헤더 */
  .tp3-rstack-header {
    text-align: center; margin-bottom: 14px;
  }
  .tp3-rstack-name-ko {
    font-size: 26px; font-weight: 900; color: #fff;
    letter-spacing: -.02em; line-height: 1.1;
  }
  .tp3-rstack-name-en {
    font-size: 12px; font-weight: 700; letter-spacing: .14em;
    color: rgba(255,255,255,0.42); text-transform: uppercase; margin-top: 4px;
  }
  .tp3-rstack-slot-tag {
    display: inline-block; margin-bottom: 10px;
    padding: 3px 10px; border-radius: 999px;
    border: 1px solid rgba(212,175,55,0.40);
    background: rgba(212,175,55,0.10);
    font-size: 10px; font-weight: 800; letter-spacing: .06em;
    color: rgba(212,175,55,0.85);
    font-family: var(--vx-font-mono,monospace);
  }
  /* 카드 이미지 영역 */
  .tp3-rcard-wrap {
    width: min(200px, 58vw); aspect-ratio: 2/3;
    perspective: 700px; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    margin-bottom: 18px; flex-shrink: 0;
    contain: layout; isolation: isolate;
    position: relative; overflow: visible;
  }
  .tp3-rcard-inner {
    position: absolute; inset: 0;
    transform-style: preserve-3d; -webkit-transform-style: preserve-3d;
    transition: transform 0.52s cubic-bezier(0.23,1,0.32,1);
    border-radius: 13px; will-change: transform;
    transform-origin: 50% 50%;
  }
  .tp3-rcard-wrap.is-flipped .tp3-rcard-inner { transform: rotateY(180deg); }
  .tp3-rcard-face {
    position: absolute; inset: 0; border-radius: 13px;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    overflow: hidden;
  }
  /* 해석 영역 */
  /* 운세 한줄 */
  .tp3-rstack-fortune {
    width: 100%; font-size: 15px; line-height: 1.75;
    color: rgba(255,255,255,0.80); margin-bottom: 16px;
    letter-spacing: -.01em; text-align: center;
  }
  /* 카드 해석 섹션 */
  .tp3-rstack-reading { width: 100%; text-align: center; }
  .tp3-rstack-label {
    font-size: 16px; font-weight: 900; color: #fff;
    margin-bottom: 8px; letter-spacing: -.01em; text-align: center;
  }
  .tp3-rstack-name { display: none; }
  .tp3-rstack-msg {
    font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.62);
    text-align: center;
  }
  /* 구분선 */
  .tp3-rstack-divider {
    width: 100%; height: 1px; background: rgba(255,255,255,0.07);
    margin: 8px 0 0;
  }
  .tp3-rcard-back {
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding: 7px 6px 10px; text-align: center;
    border: 1px solid rgba(212,175,55,0.38);
    position: relative;
  }
  .tp3-rcard-back-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(circle at 50% 35%, var(--tp3-rc-color, #c77dff) 0, transparent 58%);
    opacity: .30;
  }
  .tp3-rcard-sym {
    position: relative; z-index: 1; margin-bottom: auto; margin-top: 14px;
  }
  .tp3-rcard-sym svg { width: 36px !important; height: 36px !important; }
  .tp3-rcard-label {
    position: relative; z-index: 1;
    font-size: 8px; font-weight: 800; letter-spacing: .08em;
    color: rgba(212,175,55,0.85); margin-bottom: 3px;
    font-family: var(--vx-font-mono, monospace);
  }
  .tp3-rcard-name {
    position: relative; z-index: 1;
    font-size: 10px; font-weight: 800; color: #fff; line-height: 1.2;
    margin-bottom: 4px;
  }
  .tp3-rcard-hint {
    position: relative; z-index: 1;
    font-size: 7px; color: rgba(255,255,255,0.28);
    font-family: var(--vx-font-mono, monospace);
  }
  .tp3-rcard-tap-hint {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
    padding: 28px 0 10px;
    background: linear-gradient(0deg, rgba(0,0,0,0.72) 0%, transparent 100%);
    text-align: center;
    font-size: 10px; font-weight: 700; letter-spacing: .08em;
    color: rgba(255,255,255,0.72);
    font-family: var(--vx-font-mono, monospace);
    pointer-events: none;
  }
  .tp3-rcard-front {
    transform: rotateY(180deg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding: 36px 8px 14px; text-align: center;
    border: 1px solid rgba(255,255,255,0.14);
    position: absolute; overflow: hidden;
  }
  .tp3-rcard-front-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(180deg, rgba(7,5,17,0.02) 0%, rgba(7,5,17,0.16) 44%, rgba(7,5,17,0.88) 100%);
    opacity: 1;
  }
  .tp3-rcard-front-num {
    position: relative; z-index: 1;
    font-family: var(--vx-font-mono, monospace); font-size: 8px;
    letter-spacing: .14em; color: rgba(255,255,255,0.32);
    margin-bottom: 6px;
  }
  .tp3-rcard-front-sym {
    display: none;
  }
  .tp3-rcard-front-sym svg { width: 40px !important; height: 40px !important; }
  .tp3-rcard-front-name {
    position: relative; z-index: 1;
    font-size: 12px; font-weight: 900; color: #fff;
    line-height: 1.2; margin-bottom: 5px;
  }
  .tp3-rcard-front-kw {
    position: relative; z-index: 1;
    font-size: 9px; font-weight: 700; line-height: 1.4;
    opacity: .88;
  }
  .tp3-rcard-msg {
    font-size: 8.5px; line-height: 1.65; color: rgba(255,255,255,0.65);
    overflow-y: auto;
  }
  .tp3-result {
    margin-top: 16px; border-radius: 18px;
    border: 1px solid rgba(212,175,55,0.22);
    background: rgba(255,255,255,0.04);
    padding: 16px 14px; text-align: left;
    animation: tp3FadeUp .4s ease both;
  }
  @keyframes tp3FadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes tp3SlideIn {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .tp3-result-page {
    animation: tp3SlideIn .32s cubic-bezier(0.23,1,0.32,1) both;
  }
  .tp3-result-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
  }
  .tp3-result-back {
    background: none; border: none; padding: 0 8px 0 0;
    color: #fff; font-size: 22px; font-weight: 300; cursor: pointer;
    line-height: 1; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .tp3-result-back:active { opacity: .6; }
  .tp3-result-title {
    font-size: 20px; font-weight: 900; color: #fff; letter-spacing: -.02em;
  }
  .tp3-result-sub {
    font-size: 11px; color: rgba(212,175,55,0.75); margin-top: 1px;
    font-family: var(--vx-font-mono, monospace); letter-spacing: .06em;
  }
  .tp3-result h3 { font-size: 16px; font-weight: 900; margin-bottom: 8px; color: #f0d4ff; }
  .tp3-result-summary { font-size: 13px; line-height: 1.75; color: rgba(255,255,255,0.72); margin-bottom: 14px; }
  .tp3-result-block {
    border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; margin-top: 12px;
  }
  .tp3-result-block-title { font-size: 11px; font-weight: 800; color: rgba(212,175,55,0.9); margin-bottom: 4px; }
  .tp3-result-block-card { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .tp3-result-block-msg { font-size: 12px; line-height: 1.7; color: rgba(255,255,255,0.58); }
  .tp3-result-advice {
    margin-top: 14px; padding: 12px; border-radius: 12px;
    background: rgba(199,125,255,0.1); font-size: 12px; line-height: 1.65;
    color: rgba(244,230,255,0.88);
  }
  .tp3-back-link {
    display: block; width: 100%; margin-top: 12px; min-height: 44px;
    border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);
    background: transparent; color: rgba(255,255,255,0.55);
    font-size: 13px; font-weight: 700; cursor: pointer;
  }
  `;

  if (!document.getElementById('venux-tarot-pick3-css')) {
    const el = document.createElement('style');
    el.id = 'venux-tarot-pick3-css';
    el.textContent = _CSS;
    document.head.appendChild(el);
  }

  const _SYMS = {
    star: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="${c}" opacity=".9"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`,
    moon: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
    sun: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>`,
    tower: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><rect x="9" y="3" width="6" height="18" rx="1"/></svg>`,
    world: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    heart: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="${c}"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    eye: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    wheel: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
    bell: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>`,
    wind: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2"/></svg>`,
    wand: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
    flower: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="1.8"><circle cx="12" cy="12" r="3"/></svg>`,
  };

  function symHtml(card) {
    const fn = _SYMS[card.sym] || _SYMS.star;
    return fn(card.color);
  }

  function symHtmlLarge(card) {
    const fn = _SYMS[card.sym] || _SYMS.star;
    return fn(card.color)
      .replace(/width="\d+"/, 'width="44"')
      .replace(/height="\d+"/, 'height="44"');
  }

  function cardBg(card) {
    const r = parseInt(card.color.slice(1, 3), 16);
    const g = parseInt(card.color.slice(3, 5), 16);
    const b = parseInt(card.color.slice(5, 7), 16);
    return `linear-gradient(150deg,rgba(${r},${g},${b},0.32),rgba(10,6,18,0.95))`;
  }

  const CARD_IMAGE_PATHS = {
    the_fool: '/assets/tarot/major_00_the_fool_park_lyra.png',
    the_magician: '/assets/tarot/major_01_the_magician_park_lyra.png',
    the_high_priestess: '/assets/tarot/major_02_the_high_priestess_park_lyra.png',
    the_empress: '/assets/tarot/major_03_the_empress_park_lyra.png',
    the_emperor: '/assets/tarot/major_04_the_emperor_park_lyra.png',
    the_hierophant: '/assets/tarot/major_05_the_hierophant_park_lyra.png',
    the_lovers: '/assets/tarot/major_06_the_lovers_park_lyra.png',
    the_chariot: '/assets/tarot/major_07_the_chariot_park_lyra.png',
    strength: '/assets/tarot/major_08_strength_park_lyra.png',
    the_hermit: '/assets/tarot/major_09_the_hermit_park_lyra.png',
    wheel_of_fortune: '/assets/tarot/major_10_wheel_of_fortune_park_lyra.png',
    justice: '/assets/tarot/major_11_justice_park_lyra.png',
    the_hanged_man: '/assets/tarot/major_12_the_hanged_man_park_lyra.png',
    death: '/assets/tarot/major_13_death_park_lyra.png',
    temperance: '/assets/tarot/major_14_temperance_park_lyra.png',
    the_devil: '/assets/tarot/major_15_the_devil_park_lyra.png',
    the_tower: '/assets/tarot/major_16_the_tower_park_lyra.png',
    the_star: '/assets/tarot/major_17_the_star_park_lyra.png',
    the_moon: '/assets/tarot/major_18_the_moon_park_lyra.png',
    the_sun: '/assets/tarot/major_19_the_sun_park_lyra.png',
    judgement: '/assets/tarot/major_20_judgement_park_lyra.png',
    the_world: '/assets/tarot/major_21_the_world_park_lyra.png',
  };

  function cardImageSrc(card) {
    if (card.imageFront && card.imageFront.includes('/')) return card.imageFront;
    if (card.imageUrl) return card.imageUrl;
    return CARD_IMAGE_PATHS[card.id] || `/assets/tarot/${card.id}.png`;
  }

  const CARD_BACK_PATHS = {
    major: '/assets/tarot/back_park_lyra.png',
    cups: '/assets/tarot/back_lee_luna.png',
    swords: '/assets/tarot/back_shin_jiu.png',
    wands: '/assets/tarot/back_choi_noa.png',
    pentacles: '/assets/tarot/back_jung_aon.png',
  };

  function cardBackSrc(card) {
    if (card.imageBack && card.imageBack.includes('/')) return card.imageBack;
    if (card.suit && CARD_BACK_PATHS[card.suit]) return CARD_BACK_PATHS[card.suit];
    return CARD_BACK_PATHS.major; // 메이저 아르카나 → Park Lyra 고정
  }

  function getSourceDeck() {
    if (global.MAJOR_PICK3_DECK && global.MAJOR_PICK3_DECK.length === 22) {
      return global.MAJOR_PICK3_DECK.map(c => ({ ...c }));
    }
    return [];
  }

  function shuffleDeck(cards) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
  }

  function generateTarotReading(selectedCards, category) {
    const slotLabels = CAT_SLOT_LABELS[category] || SLOT_LABELS;
    const meaningKey = { love: 'loveMeaning', wealth: 'moneyMeaning', biz: 'careerMeaning' }[category] || 'loveMeaning';

    const keywords = selectedCards.flatMap(c => c.keywords);
    const unique = [...new Set(keywords)];
    const names = selectedCards.map(c => c.nameKo).join(', ');

    const summary =
      `오늘 ${names}의 기운이 겹쳐 있어요. ` +
      `${unique.slice(0, 3).join(' · ')}의 흐름이 하루 전체를 부드럽게 이끌 수 있어요. ` +
      '큰 결론보다 지금 마음에 와닿는 메시지를 천천히 골라보면 좋아요.';

    const advice =
      `세 장의 이야기를 한 호흡으로 이어가 보세요. ` +
      `${selectedCards[2].keywords[0]}의 기운을 믿되, ` +
      `${selectedCards[0].nameKo}이 전하는 따뜻함도 잊지 마세요.`;

    const slots = selectedCards.map((card, i) => ({
      card,
      title: slotLabels[i] || `슬롯 ${i + 1}`,
      message: card[meaningKey] || card.loveMeaning || card.moneyMeaning || card.careerMeaning || card.upright || '',
    }));

    return { summary, slots, advice };
  }

  const state = {
    deck: [],
    selectedCards: [],
    flippedCardIds: [],
    peekedCardIds: [],
    result: null,
    isShuffling: false,
    shuffleCount: 0,
    pendingShuffleConfirm: false,
    menuHtml: '',
    category: 'love',
  };

  function isReadingReady() {
    return state.selectedCards.length === MAX_SELECTION;
  }

  function isFlipped(id) {
    return state.flippedCardIds.includes(id);
  }

  function isSelected(id) {
    return state.selectedCards.some(c => c.id === id);
  }

  function resetAndShuffle() {
    state.isShuffling = true;
    state.selectedCards = [];
    state.flippedCardIds = [];
    state.peekedCardIds = [];
    state.result = null;
    render();

    const grid = document.querySelector('.tp3-grid');
    if (grid) {
      grid.classList.add('is-shuffling');
      grid.querySelectorAll('.tp3-card-btn').forEach((btn, i) => {
        btn.style.setProperty('--tp3-idx', i);
        btn.style.setProperty('--tp3-sx', `${(Math.random() - 0.5) * 38}px`);
        btn.style.setProperty('--tp3-sy', `${(Math.random() - 0.5) * 30}px`);
        btn.style.setProperty('--tp3-sr', `${(Math.random() - 0.5) * 34}deg`);
      });
    }

    setTimeout(() => {
      state.deck = shuffleDeck(state.deck.length ? state.deck : getSourceDeck());
      state.shuffleCount += 1;
      state.isShuffling = false;
      render();
    }, SHUFFLE_MS);
  }

  function handleShuffle() {
    if (state.isShuffling) return;

    if (state.selectedCards.length > 0) {
      showShuffleModal();
      return;
    }

    resetAndShuffle();
  }

  function showShuffleModal() {
    const existing = document.getElementById('tp3ShuffleModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'tp3ShuffleModal';
    overlay.className = 'tp3-modal-overlay';
    overlay.innerHTML = `
      <div class="tp3-modal" role="dialog" aria-modal="true">
        <p>선택한 카드가 초기화됩니다.<br>다시 섞을까요?</p>
        <div class="tp3-modal-actions">
          <button type="button" class="tp3-btn tp3-btn-shuffle" data-action="cancel">취소</button>
          <button type="button" class="tp3-btn tp3-btn-read" data-action="confirm">확인</button>
        </div>
      </div>`;

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeShuffleModal();
    });
    overlay.querySelector('[data-action="cancel"]').addEventListener('click', closeShuffleModal);
    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      closeShuffleModal();
      resetAndShuffle();
    });

    document.body.appendChild(overlay);
  }

  function closeShuffleModal() {
    const m = document.getElementById('tp3ShuffleModal');
    if (m) m.remove();
  }

  function handleSelectCard(card) {
    if (state.isShuffling) return;

    // 이미 선택된 카드 재탭 → deselect (뒷면으로)
    if (state.selectedCards.some(s => s.id === card.id)) {
      state.flippedCardIds = state.flippedCardIds.filter(id => id !== card.id);
      state.selectedCards  = state.selectedCards.filter(s => s.id !== card.id);
      state.result = null;
      render();
      return;
    }

    if (state.selectedCards.length >= MAX_SELECTION) return;

    state.flippedCardIds  = [...state.flippedCardIds, card.id];
    state.selectedCards   = [...state.selectedCards, card];
    state.peekedCardIds   = [...new Set([...state.peekedCardIds, card.id])];
    state.result = null;
    render();
  }

  function handleShowReading() {
    if (!isReadingReady()) return;
    state.result = generateTarotReading(state.selectedCards, state.category);
    render();
    const resultEl = document.getElementById('tp3Result');
    if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handleBackToPick() {
    state.result = null;
    render();
  }

  function slotHtml(index) {
    const label = getSlotLabels()[index];
    const card = state.selectedCards[index];
    if (!card) {
      return `
        <div class="tp3-slot">
          <div class="tp3-slot-card">
            <span class="tp3-slot-empty">${label}</span>
          </div>
        </div>`;
    }
    return `
      <div class="tp3-slot">
        <div class="tp3-slot-card filled">
          <div class="tp3-slot-mini" style="background:${cardBg(card)}">
            <img class="tp3-slot-mini-img" src="${cardImageSrc(card)}" alt="${card.nameKo} 타로 카드" loading="lazy" decoding="async">
            <div class="tp3-slot-mini-shade"></div>
          </div>
        </div>
      </div>`;
  }

  function gridCardHtml(card) {
    const flipped  = isFlipped(card.id);
    const selected = isSelected(card.id);
    const peeked   = state.peekedCardIds.includes(card.id);
    const maxed    = state.selectedCards.length >= MAX_SELECTION;
    const done     = maxed && !selected;
    const disabled = state.isShuffling || done;

    return `
      <button
        type="button"
        class="tp3-card-btn${flipped ? ' is-flipped' : ''}${selected ? ' is-selected' : ''}${done ? ' is-done' : ''}"
        data-card-id="${card.id}"
        ${disabled ? 'disabled' : ''}
        aria-label="${card.nameKo}"
      >
        <div class="tp3-card-inner">
          <div class="tp3-face tp3-face-back${peeked ? ' is-peeked' : ''}">
            <img class="tp3-card-back-img" src="${cardBackSrc(card)}" alt="${card.nameKo} 카드 뒷면" loading="lazy" decoding="async">
            <div class="tp3-back-stars"></div>
            <svg class="tp3-back-mandala" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 교차선 -->
              <line x1="40" y1="8"  x2="40" y2="72" stroke="rgba(180,100,255,0.09)" stroke-width="0.4"/>
              <line x1="8"  y1="40" x2="72" y2="40" stroke="rgba(180,100,255,0.09)" stroke-width="0.4"/>
              <line x1="17" y1="17" x2="63" y2="63" stroke="rgba(212,175,55,0.08)" stroke-width="0.4"/>
              <line x1="63" y1="17" x2="17" y2="63" stroke="rgba(212,175,55,0.08)" stroke-width="0.4"/>
              <!-- 외곽 점선 원 -->
              <circle cx="40" cy="40" r="33" stroke="rgba(212,175,55,0.22)" stroke-width="0.5" stroke-dasharray="2 4.5"/>
              <!-- 중간 원 -->
              <circle cx="40" cy="40" r="24" stroke="rgba(180,100,255,0.22)" stroke-width="0.5"/>
              <!-- 내부 원 -->
              <circle cx="40" cy="40" r="14" stroke="rgba(212,175,55,0.32)" stroke-width="0.5"/>
              <!-- 정삼각형 (위) -->
              <polygon points="40,18 54.6,40.5 25.4,40.5"
                stroke="rgba(212,175,55,0.48)" stroke-width="0.7" fill="rgba(212,175,55,0.05)"/>
              <!-- 역삼각형 (아래) -->
              <polygon points="40,62 25.4,39.5 54.6,39.5"
                stroke="rgba(212,175,55,0.48)" stroke-width="0.7" fill="rgba(212,175,55,0.05)"/>
              <!-- 중심 원 -->
              <circle cx="40" cy="40" r="3.8"
                stroke="rgba(212,175,55,0.65)" stroke-width="0.8" fill="rgba(212,175,55,0.20)"/>
              <!-- 꼭짓점 점 -->
              <circle cx="40"   cy="18"   r="1.4" fill="rgba(212,175,55,0.60)"/>
              <circle cx="54.6" cy="40.5" r="1.4" fill="rgba(212,175,55,0.60)"/>
              <circle cx="25.4" cy="40.5" r="1.4" fill="rgba(212,175,55,0.60)"/>
              <circle cx="40"   cy="62"   r="1.4" fill="rgba(212,175,55,0.60)"/>
              <circle cx="25.4" cy="39.5" r="1.4" fill="rgba(212,175,55,0.60)"/>
              <circle cx="54.6" cy="39.5" r="1.4" fill="rgba(212,175,55,0.60)"/>
              <!-- 외곽 원 12방향 점 -->
              <circle cx="40"    cy="7"    r="1.0" fill="rgba(212,175,55,0.35)"/>
              <circle cx="56.5"  cy="11.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="68.5"  cy="23.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="73"    cy="40"   r="1.0" fill="rgba(212,175,55,0.35)"/>
              <circle cx="68.5"  cy="56.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="56.5"  cy="68.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="40"    cy="73"   r="1.0" fill="rgba(212,175,55,0.35)"/>
              <circle cx="23.5"  cy="68.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="11.5"  cy="56.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="7"     cy="40"   r="1.0" fill="rgba(212,175,55,0.35)"/>
              <circle cx="11.5"  cy="23.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
              <circle cx="23.5"  cy="11.5" r="0.8" fill="rgba(212,175,55,0.25)"/>
            </svg>
            <div class="tp3-back-label">VenuX · Tarot</div>
          </div>
          <div class="tp3-face tp3-face-front" style="background:${cardBg(card)};--tp3-card-color:${card.color}">
            <div class="tp3-front-illus">
              <div class="tp3-front-illus-glow"></div>
              <img class="tp3-card-img" src="${cardImageSrc(card)}" alt="${card.nameKo}" onerror="this.style.display='none'">
              <div class="tp3-front-sym-lg">${symHtmlLarge(card)}</div>
            </div>
            <div class="tp3-front-info">
              <div class="tp3-front-num">${card.number}</div>
              <div class="tp3-front-name">${card.nameKo}</div>
              <div class="tp3-front-kw" style="color:${card.color}">${card.keywords.slice(0, 2).join(' · ')}</div>
            </div>
          </div>
        </div>
      </button>`;
  }

  function rcardHtml(block, idx) {
    const card = block.card;
    const bg = cardBg(card);
    const fortune = card.loveMeaning || card.moneyMeaning || card.careerMeaning || '';
    return `
      <div class="tp3-rstack-item" style="animation: tp3FadeUp .4s ${idx * 0.15}s ease both">
        <div class="tp3-rstack-header">
          <div class="tp3-rstack-slot-tag">${block.title}</div>
          <div class="tp3-rstack-name-ko">${card.nameKo}</div>
          <div class="tp3-rstack-name-en">${card.nameEn}</div>
        </div>
        <div class="tp3-rcard-wrap" onclick="this.classList.toggle('is-flipped')">
          <div class="tp3-rcard-inner">
            <div class="tp3-rcard-face tp3-rcard-back"
                 style="background:${bg};--tp3-rc-color:${card.color}">
              <img class="tp3-card-img" src="${cardBackSrc(card)}" alt="${card.nameKo} 카드 뒷면" loading="lazy" decoding="async" onerror="this.style.display='none'">
              <div class="tp3-rcard-tap-hint">탭해서 확인 ✦</div>
            </div>
            <div class="tp3-rcard-face tp3-rcard-front"
                 style="background:${bg};--tp3-rc-color:${card.color}">
              <img class="tp3-card-img" src="${cardImageSrc(card)}" alt="${card.nameKo}"
                   onerror="this.style.display='none'">
              <div class="tp3-rcard-front-glow"></div>
              <div class="tp3-rcard-front-num">${card.number}</div>
              <div class="tp3-rcard-front-sym">${symHtmlLarge(card)}</div>
              <div class="tp3-rcard-front-name">${card.nameKo}</div>
              <div class="tp3-rcard-front-kw" style="color:${card.color}">${card.keywords.slice(0,2).join(' · ')}</div>
            </div>
          </div>
        </div>
        <p class="tp3-rstack-fortune">${block.message}</p>
        <div class="tp3-rstack-reading">
          <div class="tp3-rstack-label">카드 해석</div>
          <p class="tp3-rstack-msg">${card.loveMeaning || card.moneyMeaning || card.careerMeaning || block.message}</p>
        </div>
        <div class="tp3-rstack-divider"></div>
      </div>`;
  }

  function resultHtml() {
    if (!state.result) return '';
    const r = state.result;
    const names = state.selectedCards.map(c => c.nameKo).join(' · ');
    return `
      <div id="tp3ResultPage">
        <div class="tp3-result-header">
          <button type="button" class="tp3-result-back" id="tp3BackPick" aria-label="뒤로"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5" stroke="white" stroke-width="1.6" stroke-linecap="round"/><path d="M11 6l-6 6 6 6" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <div>
            <div class="tp3-result-title">오늘의 힐링타로</div>
            <div class="tp3-result-sub">${names}</div>
          </div>
        </div>
        <p class="tp3-result-summary">${r.summary}</p>
        <div class="tp3-result-stack">
          ${r.slots.map((block, i) => rcardHtml(block, i)).join('')}
        </div>
        <div class="tp3-result-advice">${r.advice}</div>
        <button type="button" class="tp3-back-link" id="tp3BackPick2">카드 다시 고르기</button>
      </div>`;
  }

  function render() {
    const container = state.container;
    if (!container) return;

    const ready = isReadingReady();
    const readLabel = ready ? '오늘의 힐링타로 보기' : '카드를 3장 선택해 주세요';
    const shuffleLabel = state.isShuffling ? '섞는 중...' : '셔플';

    // ── 결과 페이지 ──
    if (state.result) {
      container.innerHTML = `
        <div class="tp3-root tp3-result-page">
          ${state.menuHtml || ''}
          ${resultHtml()}
        </div>`;
      container.scrollTop = 0;
      document.getElementById('tp3BackPick')?.addEventListener('click', handleBackToPick);
      document.getElementById('tp3BackPick2')?.addEventListener('click', handleBackToPick);
      return;
    }

    // ── 카드 선택 페이지 ──
    container.innerHTML = `
      <div class="tp3-root">
        ${state.menuHtml || ''}
        <p class="tp3-guide">${CAT_GUIDE[state.category] || '오늘의 기운을 생각하며 카드 3장을 선택해주세요.'}</p>
        <div class="tp3-slots" aria-label="선택 슬롯">
          ${slotHtml(0)}${slotHtml(1)}${slotHtml(2)}
        </div>
        <div class="tp3-grid-wrap">
          <div class="tp3-grid${state.isShuffling ? ' is-shuffling is-locked' : ''}" id="tp3Grid">
            ${state.deck.map(card => gridCardHtml(card)).join('')}
          </div>
        </div>
        <div class="tp3-actions">
          <button type="button" class="tp3-btn tp3-btn-shuffle" id="tp3ShuffleBtn" ${state.isShuffling ? 'disabled' : ''}>
            ${shuffleLabel}
          </button>
          <button type="button" class="tp3-btn tp3-btn-read" id="tp3ReadBtn" ${ready && !state.isShuffling ? '' : 'disabled'}>
            ${readLabel}
          </button>
        </div>
      </div>`;

    container.querySelectorAll('.tp3-card-btn[data-card-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-card-id');
        const card = state.deck.find(c => c.id === id);
        if (card) handleSelectCard(card);
      });
    });

    const shuffleBtn = document.getElementById('tp3ShuffleBtn');
    if (shuffleBtn) shuffleBtn.addEventListener('click', handleShuffle);

    const readBtn = document.getElementById('tp3ReadBtn');
    if (readBtn) readBtn.addEventListener('click', handleShowReading);
  }

  function mount(container, options) {
    state.container = container;
    state.menuHtml  = (options && options.menuHtml)  || '';
    state.category  = (options && options.category)  || 'love';
    if (!state.deck.length) {
      const source = getSourceDeck();
      if (!source.length) {
        container.innerHTML = '<div class="tp3-root" style="text-align:center;padding:40px;color:rgba(255,255,255,0.4);font-size:13px">카드 데이터를 불러오는 중...</div>';
        return;
      }
      state.deck = shuffleDeck(source);
    }
    state.selectedCards = [];
    state.flippedCardIds = [];
    state.peekedCardIds = [];
    state.result = null;
    state.isShuffling = false;
    render();
  }

  global.TarotPick3 = {
    mount,
    shuffleDeck,
    generateTarotReading,
    getState: () => ({ ...state }),
    reset: mount,
  };
})(window);
