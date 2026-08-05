/* ============================================================
   WENLAMBO — Custom interactions
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* --- 1. Scroll button -> smooth scroll to the block links --- */
    var scrollBtn = document.querySelector('.scroll');
    var blockLinks = document.querySelector('.block_links');
    if (scrollBtn && blockLinks) {
      scrollBtn.addEventListener('click', function (e) {
        e.preventDefault();
        blockLinks.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    /* --- 1b. Copy CA to clipboard on click --- */
    var copyText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // fallback for non-secure contexts (e.g. opened via file://)
      return new Promise(function (resolve, reject) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy') ? resolve() : reject(); }
        catch (err) { reject(err); }
        document.body.removeChild(ta);
      });
    };

    document.querySelectorAll('.ca, .ca_mobile').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var original = btn.textContent;
        var toCopy = btn.getAttribute('data-ca') || original;
        copyText(toCopy).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = original; }, 1200);
        }).catch(function () {});
      });
    });

    /* --- 2. Mobile hamburger menu --- */
    var hamburger = document.getElementById('wl-hamburger');
    var mobileMenu = document.getElementById('wl-mobile-menu');
    if (hamburger && mobileMenu) {
      var setOpen = function (open) {
        hamburger.classList.toggle('active', open);
        mobileMenu.classList.toggle('open', open);
        document.body.classList.toggle('wl-lock', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      var toggle = function () { setOpen(!mobileMenu.classList.contains('open')); };

      hamburger.addEventListener('click', toggle);
      hamburger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });

      // close when a menu item is tapped
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setOpen(false); });
      });

      // close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
    }

    /* --- 3. Scroll reveal (added via JS so no-JS users still see content) --- */
    var revealTargets = [];
    ['.block_para', '.para1', '.video', '.title_dark', '.meme',
     '.title_light', '.how', '.block_footer']
      .forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) { revealTargets.push(el); });
      });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('wl-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      revealTargets.forEach(function (el, i) {
        el.classList.add('wl-reveal');
        // gentle stagger for grid items
        if (el.classList.contains('meme')) {
          el.style.transitionDelay = (i % 4) * 0.08 + 's';
        }
        io.observe(el);
      });
    }
  });
})();
