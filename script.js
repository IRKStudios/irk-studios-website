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
    master: [0.7081,0.7331,0.8132,0.8993,0.8944,0.9255,0.6341,0.7425,0.9326,0.9062,0.6237,0.8161,0.8609,0.9004,0.6788,0.869,0.9426,0.912,0.8582,0.9497,0.9348,0.7835,0.8084,0.9537,0.9125,0.7496,0.863,0.918,0.9123,0.7352,0.8935,0.9528,0.9176,0.941,0.9491,0.9424,0.7812,0.8196,0.9618,0.9107,0.7288,0.8772,0.9129,0.9185,0.7161,0.9028,0.9417,0.9049,0.9188,0.9479,0.9302,0.6966,0.8068,0.9312,0.9291,0.7169,0.8846,0.9355,0.8995,0.6916,0.9043,0.9707,0.7356,0.5763,0.9401,0.8166,0.7656,0.8364,0.9515,0.9218,0.6917,0.9624,0.9388,0.8576,0.7264,0.9122,0.9471,0.9163,0.925,0.9777,0.919,0.7983,0.8665,0.9381,0.9148,0.7631,0.9064,0.9382,0.8307,0.7829,0.9416,0.953,0.9103,0.9321,0.9791,0.9869,0.9737,0.9771,0.9685,0.9855,0.9874,0.953,0.9727,0.9819,0.9612,0.9655,0.9873,0.9744,0.9595,0.9933,0.9838,0.9721,0.9696,0.9802,0.9588,0.9787,0.9522,0.9807,0.973,0.9677,0.9613,0.973,0.9494,0.8021,0.7685,0.8552,0.9363,1.0,0.9431,0.9146,0.7602,0.9062,0.9639,0.8176,0.7961,0.9075,0.921,0.9295,0.9928,0.9503,0.9216,0.712,0.8954,0.9565,0.8873,0.7622,0.9149,0.9826,0.8231,0.756,0.978,0.9418,0.9023,0.8241,0.1345,0.06,0.06,0.06,0.06,0.06]
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

    audio.addEventListener('loadedmetadata', function () {
      durationEl.textContent = formatTime(audio.duration);
    });

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

    waveTrack.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
      if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); }
    });
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

})();
