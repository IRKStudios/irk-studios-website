/* ==========================================================================
   IRK.Studios — Script
   Vanilla JS only. No frameworks, no build step.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Precomputed waveform peak data (0..1) for the before/after players.
     Generated ahead of time from the real audio files so the waveform
     shape shown is accurate, without needing to decode audio at runtime
     (which keeps this working even when the site is opened as a local
     file, with no server).
     ------------------------------------------------------------------ */
  var WAVE_PEAKS = {
    maqueta: [0.06,0.06,0.06,0.06,0.6547,0.4036,0.5554,0.5301,0.4268,0.632,0.9348,0.6285,0.9507,0.8734,0.77,0.8526,0.9009,0.8986,0.4409,0.5686,0.3815,0.2989,0.6574,0.5598,0.8367,0.6771,0.7388,0.4833,0.2808,0.3902,0.3694,0.7147,0.5484,0.7493,0.6325,0.6166,0.4692,0.266,0.4045,0.3615,0.7027,0.6896,0.8789,0.8332,0.7711,0.6237,0.8989,0.7084,0.8685,0.9153,0.7566,0.9867,0.8295,0.7496,0.5947,0.4881,0.5657,0.5401,0.9003,0.7985,0.976,0.9418,0.8851,0.5199,0.3246,0.5372,0.5892,1.0,0.7215,0.9042,0.8459,0.8263,0.6385,0.4754,0.583,0.5681,0.93,0.9235,0.9518,0.7959,0.8701,0.8895,0.932,0.9588,0.747,0.9939,0.887,0.9072,0.8287,0.8372,0.5077,0.5719,0.5506,0.447,0.993,0.8757,0.8801,0.8896,0.8509,0.5782,0.5524,0.561,0.539,0.9546,0.881,0.944,0.9386,0.8778,0.6137,0.5689,0.4919,0.5716,0.9756,0.9025,0.9122,0.8829,0.8047,0.7401,0.8817,0.9122,0.6598,0.8983,0.8602,0.8272,0.8673,0.7686,0.471,0.6314,0.404,0.6178,0.9525,0.7779,0.8074,0.9523,0.6911,0.4868,0.5708,0.4989,0.71,0.9299,0.8781,0.8595,0.9165,0.7297,0.5009,0.7187,0.5768,0.861,0.951,0.9007,0.7902,0.9367,0.6187,0.4489,0.3897,0.4251,0.6847,0.8164,0.6526,0.6236],
    master: [0.5933,0.7345,0.6803,0.7226,0.7478,0.8174,0.8078,0.9194,0.8915,0.8609,0.9444,0.9071,0.8716,0.6177,0.6277,0.4265,0.9121,0.8778,0.9489,0.9335,0.8201,0.5481,0.5845,0.6443,0.9028,0.8764,0.8272,0.9895,0.7465,0.6677,0.6626,0.6803,0.9734,0.9258,0.8944,0.9289,0.8602,0.9341,0.8412,0.854,0.9134,0.9406,0.9349,0.8822,0.7463,0.7268,0.6317,0.919,0.8848,0.9832,0.9582,0.8289,0.6093,0.7319,0.7379,0.9573,0.8898,0.9418,0.9822,0.8342,0.5512,0.7822,0.7058,0.9786,0.9548,0.9076,0.9876,0.8745,0.9568,0.9314,0.9491,0.9229,0.987,0.9069,0.8983,0.7208,0.7322,0.6434,0.9265,0.8904,0.9846,0.9388,0.8736,0.6507,0.7459,0.7018,0.9563,0.9238,0.9286,0.9503,0.83,0.7251,0.7113,0.7103,0.9791,0.9588,0.8639,0.977,0.8276,0.9702,0.9494,0.9131,0.9152,0.9586,0.9331,0.8921,0.6553,0.6833,0.5376,0.9108,0.8852,0.9602,0.9677,0.904,0.5294,0.685,0.6466,0.9366,0.9264,0.9682,0.9982,0.8245,0.5423,0.7273,0.6651,0.9822,0.9468,0.9144,0.9816,0.5627,0.5162,0.5706,0.8299,0.9589,0.9345,0.8683,0.4844,0.6626,0.7838,0.7759,0.8967,0.8687,1.0,0.9621,0.8926,0.6193,0.7755,0.8781,0.9901,0.9334,0.9623,0.9662,0.8669,0.6324,0.7094,0.7153,0.9755,0.9518,0.9058,0.9718]
  };

  /* ------------------------------------------------------------------
     Nav: background on scroll + mobile menu toggle
     ------------------------------------------------------------------ */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  /* ------------------------------------------------------------------
     Subtle hero parallax (glow + watermark drift slightly on scroll)
     ------------------------------------------------------------------ */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroGlow = document.querySelector('.hero__glow');
  var heroWatermark = document.querySelector('.hero__watermark');
  var heroSection = document.querySelector('.hero');

  if (!prefersReducedMotion && heroSection) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var heroHeight = heroSection.offsetHeight;
        if (y < heroHeight) {
          if (heroGlow) heroGlow.style.transform = 'translate(-50%, ' + (y * 0.18) + 'px)';
          if (heroWatermark) heroWatermark.style.transform = 'translateY(' + (y * -0.08) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     ------------------------------------------------------------------ */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------
     Hero ambient EQ bars (decorative, generated from master peaks)
     ------------------------------------------------------------------ */
  var heroEq = document.getElementById('heroEq');
  if (heroEq) {
    var eqSource = WAVE_PEAKS.master;
    var eqBars = 48;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < eqBars; i++) {
      var span = document.createElement('span');
      var peak = eqSource[Math.floor(i * (eqSource.length / eqBars))] || 0.5;
      span.style.height = Math.max(10, peak * 100) + '%';
      span.style.animationDelay = (i * 0.06) + 's';
      span.style.animationDuration = (2 + (i % 5) * 0.3) + 's';
      frag.appendChild(span);
    }
    heroEq.appendChild(frag);
  }

  /* ------------------------------------------------------------------
     Waveform players
     ------------------------------------------------------------------ */
  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function buildBars(container, peaks) {
    var frag = document.createDocumentFragment();
    peaks.forEach(function (p) {
      var bar = document.createElement('span');
      bar.style.height = Math.max(8, p * 100) + '%';
      frag.appendChild(bar);
    });
    container.appendChild(frag);
  }

  var wavePlayers = document.querySelectorAll('.wave-player');

  wavePlayers.forEach(function (player) {
    var trackKey = player.getAttribute('data-track');
    var peaks = WAVE_PEAKS[trackKey] || [];
    var audio = player.querySelector('.wave-audio');
    var playBtn = player.querySelector('.wave-play');
    var iconPlay = player.querySelector('.icon-play');
    var iconPause = player.querySelector('.icon-pause');
    var waveTrack = player.querySelector('.wave-track');
    var barsBg = player.querySelector('.wave-bars--bg');
    var barsFg = player.querySelector('.wave-bars--fg');
    var progressEl = player.querySelector('.wave-progress');
    var playheadEl = player.querySelector('.wave-playhead');
    var currentEl = player.querySelector('.wave-time__current');
    var durationEl = player.querySelector('.wave-time__duration');

    buildBars(barsBg, peaks);
    buildBars(barsFg, peaks);

    function showDuration() {
      durationEl.textContent = formatTime(audio.duration);
    }
    audio.addEventListener('loadedmetadata', showDuration);
    // Metadata may have already loaded before this listener was attached
    // (fast local/cached loads can beat script execution) — check directly too.
    if (audio.readyState >= 1) showDuration();

    function setProgress(ratio) {
      ratio = Math.min(1, Math.max(0, ratio));
      progressEl.style.width = (ratio * 100) + '%';
      if (playheadEl) playheadEl.style.left = (ratio * 100) + '%';
      waveTrack.setAttribute('aria-valuenow', Math.round(ratio * 100));
    }

    audio.addEventListener('timeupdate', function () {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
      currentEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', function () {
      iconPlay.hidden = false;
      iconPause.hidden = true;
      setProgress(0);
    });

    function pauseOthers() {
      wavePlayers.forEach(function (other) {
        if (other === player) return;
        var otherAudio = other.querySelector('.wave-audio');
        if (!otherAudio.paused) {
          otherAudio.pause();
          other.querySelector('.icon-play').hidden = false;
          other.querySelector('.icon-pause').hidden = true;
        }
      });
    }

    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        pauseOthers();
        audio.play();
        iconPlay.hidden = true;
        iconPause.hidden = false;
      } else {
        audio.pause();
        iconPlay.hidden = false;
        iconPause.hidden = true;
      }
    });

    function seekFromEvent(clientX) {
      var rect = waveTrack.getBoundingClientRect();
      var ratio = (clientX - rect.left) / rect.width;
      ratio = Math.min(1, Math.max(0, ratio));
      if (audio.duration) audio.currentTime = ratio * audio.duration;
      setProgress(ratio);
    }

    var isDragging = false;

    waveTrack.addEventListener('pointerdown', function (e) {
      isDragging = true;
      waveTrack.setPointerCapture(e.pointerId);
      seekFromEvent(e.clientX);
    });

    waveTrack.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      seekFromEvent(e.clientX);
    });

    function endDrag(e) {
      isDragging = false;
    }
    waveTrack.addEventListener('pointerup', endDrag);
    waveTrack.addEventListener('pointercancel', endDrag);

    function skip(seconds) {
      if (!audio.duration) return;
      audio.currentTime = Math.min(audio.duration, Math.max(0, audio.currentTime + seconds));
    }

    waveTrack.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') skip(5);
      if (e.key === 'ArrowLeft') skip(-5);
    });

    var skipBackBtn = player.querySelector('.wave-skip--back');
    var skipForwardBtn = player.querySelector('.wave-skip--forward');
    if (skipBackBtn) skipBackBtn.addEventListener('click', function () { skip(-5); });
    if (skipForwardBtn) skipForwardBtn.addEventListener('click', function () { skip(5); });
  });

  /* ------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------ */
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq__item').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Contact form (FormSubmit — no backend required)
     Submits via fetch to FormSubmit's AJAX endpoint so the visitor gets
     inline success/error feedback without leaving the page. If fetch
     fails for any reason, the form still has a valid action/method, so
     it degrades gracefully to a normal POST submission.
     ------------------------------------------------------------------ */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: if this hidden field got filled in, it was a bot — do nothing.
      var honey = contactForm.querySelector('.contact-form__honey');
      if (honey && honey.value) return;

      var statusEl = contactForm.querySelector('.contact-form__status');
      var submitBtn = contactForm.querySelector('.contact-form__submit');
      var submitText = contactForm.querySelector('.contact-form__submit-text');

      submitBtn.disabled = true;
      submitText.textContent = 'Enviando…';
      statusEl.textContent = '';
      statusEl.className = 'contact-form__status';

      var payload = {};
      new FormData(contactForm).forEach(function (value, key) { payload[key] = value; });

      var ajaxUrl = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('request failed');
          return res.json();
        })
        .then(function () {
          statusEl.textContent = 'Mensaje enviado. ¡Gracias! Te responderé pronto.';
          statusEl.classList.add('contact-form__status--ok');
          contactForm.reset();
        })
        .catch(function () {
          statusEl.textContent = 'No se pudo enviar el mensaje. Escríbeme directo a irk.studioss@gmail.com.';
          statusEl.classList.add('contact-form__status--error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitText.textContent = 'Enviar mensaje';
        });
    });
  }

})();
