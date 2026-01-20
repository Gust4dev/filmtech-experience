/**
 * PREMIUM MAINTENANCE LOCK
 * High-fidelity, luxury maintenance overlay for Filmtech Experience.
 */
import { SYSTEM_CONFIG } from "./config.js";

(function initMaintenance() {
  if (!SYSTEM_CONFIG.MAINTENANCE_MODE) return;

  // Prevent double injection
  if (document.getElementById("filmtech-lock")) return;

  const lock = document.createElement("div");
  lock.id = "filmtech-lock";

  // Style definition with modern glassmorphism and dark luxury aesthetic
  lock.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #050505;
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: 24px;
    box-sizing: border-box;
    overflow: hidden;
  `;

  lock.innerHTML = `
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(220, 39, 67, 0.05) 0%, transparent 70%);
      pointer-events: none;
    "></div>
    
    <div style="
      max-width: 580px;
      padding: 60px 40px;
      background: rgba(15, 15, 15, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 32px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
      position: relative;
      z-index: 10;
    ">
      <div style="
        width: 80px;
        height: 80px;
        background: rgba(220, 39, 67, 0.1);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 32px;
        border: 1px solid rgba(220, 39, 67, 0.2);
      ">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC2743" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <h2 style="
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #fff 0%, #a1a1a1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-transform: uppercase;
      ">
        Verificação em Curso
      </h2>

      <p style="
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 32px;
        font-weight: 400;
      ">
        Esta plataforma de alta performance está passando por uma 
        <strong>validação periódica de infraestrutura</strong>. 
        As operações serão normalizadas em instantes.
      </p>

      <div style="
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 100px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      ">
        <span style="
          width: 8px;
          height: 8px;
          background: #DC2743;
          border-radius: 50%;
          display: block;
          box-shadow: 0 0 15px #DC2743;
          animation: pulse 2s infinite;
        "></span>
        <span style="
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        ">Segurança Ativa</span>
      </div>
    </div>

    <style>
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
        100% { opacity: 1; transform: scale(1); }
      }
      body { overflow: hidden !important; }
    </style>
  `;

  document.body.appendChild(lock);
})();
