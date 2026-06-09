/* =============================================================
   notify.js  —  Shared notification component for Get Buff'd
   
   Exposes two functions used across all pages:
   
     showToast(message, isError)
       → Sliding toast at the bottom-right corner.
       → Used when a logged-in user performs a save action.
       → isError (optional, default false) switches the accent
         colour from green to orange.
   
     showGuestModal(message)
       → Centred modal overlay requiring the user to click OK.
       → Used when a guest user tries to perform a save action.
       → Always includes a Log In button that goes to login.html.
   
   Usage:
     1. Add <script src="js/notify.js"></script> to your page.
     2. Call showToast() or showGuestModal() anywhere in your JS.
   
   No dependencies — pure vanilla JS.
============================================================= */


/* ─────────────────────────────────────────────
   INJECT STYLES
   We inject the CSS once at runtime so pages
   don't need a separate stylesheet link.
───────────────────────────────────────────── */
(function injectNotifyStyles() {
    if (document.getElementById('notify-styles')) return; // already injected

    const style = document.createElement('style');
    style.id = 'notify-styles';
    style.textContent = `
    /* ── Toast ── */
    .buff-toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: var(--dark-card, #22252b);
      border-left: 4px solid var(--green, #5be662);
      color: var(--white, #f7f7f7);
      padding: 14px 20px;
      border-radius: 4px;
      font-size: 0.84rem;
      font-weight: 600;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      z-index: 9999;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      max-width: 300px;
      font-family: 'Poppins', sans-serif;
    }
 
    .buff-toast.show {
      transform: translateX(0);
    }
 
    .buff-toast.error {
      border-left-color: var(--orange, #ff4d00);
    }
 
    /* ── Guest Modal Overlay ── */
    .buff-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }
 
    .buff-modal-overlay.show {
      opacity: 1;
    }
 
    .buff-modal {
      background: var(--dark-card, #22252b);
      border-top: 4px solid var(--orange, #ff4d00);
      border-radius: 6px;
      padding: 36px 32px 28px;
      max-width: 380px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      transform: translateY(-16px);
      transition: transform 0.2s ease;
    }
 
    .buff-modal-overlay.show .buff-modal {
      transform: translateY(0);
    }
 
    .buff-modal-icon {
      font-size: 2rem;
      margin-bottom: 14px;
    }
 
    .buff-modal-message {
      color: var(--white, #f7f7f7);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 24px;
      line-height: 1.5;
    }
 
    .buff-modal-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
 
    .buff-modal-btn-ok {
      background: transparent;
      border: 2px solid rgba(247, 247, 247, 0.25);
      color: var(--white, #f7f7f7);
      padding: 9px 24px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: border-color 0.2s ease, color 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }
 
    .buff-modal-btn-ok:hover {
      border-color: var(--white, #f7f7f7);
    }
 
    .buff-modal-btn-login {
      background: var(--orange, #ff4d00);
      border: 2px solid var(--orange, #ff4d00);
      color: var(--white, #f7f7f7);
      padding: 9px 24px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }
 
    .buff-modal-btn-login:hover {
      opacity: 0.85;
      color: var(--white, #f7f7f7);
      text-decoration: none;
    }
  `;
    document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */

// Create the toast element once and reuse it
let _toastEl = null;
let _toastTimer = null;

function _getToastEl() {
    if (_toastEl) return _toastEl;

    _toastEl = document.createElement('div');
    _toastEl.className = 'buff-toast';
    document.body.appendChild(_toastEl);
    return _toastEl;
}

/**
 * showToast(message, isError)
 * 
 * Shows a sliding toast at the bottom-right of the screen.
 * Auto-dismisses after 2800ms.
 * 
 * @param {string}  message  - Text to display in the toast.
 * @param {boolean} isError  - If true, uses orange accent instead of green.
 */
function showToast(message, isError = false) {
    const toast = _getToastEl();

    toast.textContent = message;
    toast.className = 'buff-toast' + (isError ? ' error' : '');

    // Force a reflow so re-triggering the animation works
    void toast.offsetWidth;

    toast.classList.add('show');

    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ─────────────────────────────────────────────
   GUEST MODAL
───────────────────────────────────────────── */

/**
 * showGuestModal(message)
 * 
 * Shows a centred modal overlay for guest users.
 * Requires the user to click OK or Log In to dismiss.
 * 
 * @param {string} message - Text to display in the modal body.
 */
function showGuestModal(message) {
    // Remove any existing modal before creating a new one
    const existing = document.getElementById('buff-guest-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'buff-modal-overlay';
    overlay.id = 'buff-guest-modal-overlay';

    overlay.innerHTML = `
    <div class="buff-modal" role="dialog" aria-modal="true" aria-labelledby="buff-modal-msg">
      <div class="buff-modal-icon">😅</div>
      <p class="buff-modal-message" id="buff-modal-msg">${message}</p>
      <div class="buff-modal-actions">
        <button class="buff-modal-btn-ok" id="buff-modal-ok">OK</button>
        <a class="buff-modal-btn-login" href="login.html">Log In</a>
      </div>
    </div>
  `;

    document.body.appendChild(overlay);

    // Trigger the fade-in on next frame
    requestAnimationFrame(() => overlay.classList.add('show'));

    function closeModal() {
        overlay.classList.remove('show');
        // Remove from DOM after the transition finishes
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }

    document.getElementById('buff-modal-ok').addEventListener('click', closeModal);

    // Also close if user clicks the backdrop itself
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });
}