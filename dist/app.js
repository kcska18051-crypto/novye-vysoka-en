(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  document.documentElement.classList.add('motion-ready');
  // Native lazy loading can fetch images several screens before they are needed.
  // Keep large galleries out of the first-screen network queue.
  const loadDeferredImage = (image) => {
    if (!image?.dataset.src) return;
    image.loading = 'eager';
    image.closest('picture')?.querySelectorAll('source[data-srcset]').forEach(source => {
      source.srcset = source.dataset.srcset;
      delete source.dataset.srcset;
    });
    image.src = image.dataset.src;
    delete image.dataset.src;
  };
  const deferredImages = [...document.querySelectorAll('img[data-src]:not(#qe-plan):not(.journey-tab-preview)')];
  if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        loadDeferredImage(entry.target);
        mediaObserver.unobserve(entry.target);
      });
    }, { rootMargin: '400px' });
    deferredImages.forEach(image => mediaObserver.observe(image));
  } else {
    deferredImages.forEach(loadDeferredImage);
  }

  const reveals = [...document.querySelectorAll('.reveal')];
  const showAllReveals = () => reveals.forEach((item) => item.classList.add('is-visible'));
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAllReveals();
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    reveals.forEach((item) => revealObserver.observe(item));
  }

  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) showAllReveals();
  });

  const siteHeader = document.querySelector('.site-header');
  const headerLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const syncHeaderState = () => siteHeader?.classList.toggle('is-scrolled', scrollY > 36);
  addEventListener('scroll', syncHeaderState, { passive: true });
  syncHeaderState();
  if ('IntersectionObserver' in window && headerLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      headerLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .2, .6] });
    headerLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }

  const journeyTrack = document.querySelector('[data-journey-track]');
  const journeyTabs = [...document.querySelectorAll('.journey-tab[data-scene]')];
  const journeyPanels = [...document.querySelectorAll('.journey-panel[data-scene]')];
  const journeyCurrent = document.querySelector('[data-journey-current]');
  const journeyProgress = document.querySelector('[data-journey-progress]');
  const journeyPrev = document.querySelector('[data-journey-prev]');
  const journeyNext = document.querySelector('[data-journey-next]');
  let journeyIndex = 0;
  let journeyFrame = 0;

  let journeyNearby = !('IntersectionObserver' in window);
  const preloadJourneyNeighbors = (index) => {
    if (!journeyNearby) return;
    [index - 1, index, index + 1].forEach((neighborIndex) => {
      const image = journeyPanels[neighborIndex]?.querySelector('img');
      if (image) {
        image.loading = 'eager';
        loadDeferredImage(image);
      }
    });
  };
  if (journeyTrack && !journeyNearby) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      journeyNearby = true;
      preloadJourneyNeighbors(journeyIndex);
      observer.disconnect();
    }, { rootMargin: '400px 0px' });
    observer.observe(journeyTrack);
  }

  const activateScene = (index, { scrollMobile = false, focusTab = false } = {}) => {
    if (!journeyPanels.length) return;
    const previousIndex = journeyIndex;
    journeyIndex = Math.max(0, Math.min(index, journeyPanels.length - 1));
    if (journeyTrack && journeyIndex !== previousIndex) journeyTrack.dataset.direction = journeyIndex > previousIndex ? 'next' : 'previous';
    journeyTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === journeyIndex;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    journeyPanels.forEach((panel, panelIndex) => {
      const active = panelIndex === journeyIndex;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-expanded', String(active));
    });
    if (journeyCurrent) journeyCurrent.textContent = String(journeyIndex + 1);
    if (journeyProgress) {
      journeyProgress.style.width = `${100 / journeyPanels.length}%`;
      journeyProgress.style.transform = `translateX(${journeyIndex * 100}%)`;
    }
    if (journeyPrev) journeyPrev.disabled = journeyIndex === 0;
    if (journeyNext) journeyNext.disabled = journeyIndex === journeyPanels.length - 1;
    preloadJourneyNeighbors(journeyIndex);
    if (focusTab) journeyTabs[journeyIndex]?.focus({ preventScroll: true });
    if (scrollMobile && mobile.matches && journeyTrack) {
      const firstPanelLeft = journeyPanels[0]?.offsetLeft || 0;
      const targetLeft = (journeyPanels[journeyIndex]?.offsetLeft || 0) - firstPanelLeft;
      journeyTrack.scrollTo({
        left: targetLeft,
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    }
  };

  journeyTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateScene(index, { scrollMobile: true }));
    tab.addEventListener('keydown', (event) => {
      const keys = {
        ArrowLeft: Math.max(0, journeyIndex - 1),
        ArrowRight: Math.min(journeyPanels.length - 1, journeyIndex + 1),
        Home: 0,
        End: journeyPanels.length - 1
      };
      if (!(event.key in keys)) return;
      event.preventDefault();
      activateScene(keys[event.key], { scrollMobile: true, focusTab: true });
    });
  });

  journeyPanels.forEach((panel, index) => {
    panel.addEventListener('click', () => activateScene(index, { scrollMobile: true }));
  });
  journeyPrev?.addEventListener('click', () => activateScene(journeyIndex - 1, { scrollMobile: true }));
  journeyNext?.addEventListener('click', () => activateScene(journeyIndex + 1, { scrollMobile: true }));

  const syncJourneyFromScroll = () => {
    if (!journeyTrack || !mobile.matches) return;
    cancelAnimationFrame(journeyFrame);
    journeyFrame = requestAnimationFrame(() => {
      const trackLeft = journeyTrack.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Infinity;
      journeyPanels.forEach((panel, index) => {
        const distance = Math.abs(panel.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      if (closestIndex !== journeyIndex) activateScene(closestIndex);
    });
  };
  journeyTrack?.addEventListener('scroll', syncJourneyFromScroll, { passive: true });
  mobile.addEventListener?.('change', () => activateScene(journeyIndex));
  activateScene(0);

  const enableDragScroll = (track) => {
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let suppressClick = false;
    track?.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      suppressClick = false;
      track.setPointerCapture(pointerId);
      track.classList.add('is-dragging');
    });
    track?.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 6) suppressClick = true;
      track.scrollLeft = startScroll - distance;
    });
    const stopDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      track.releasePointerCapture?.(pointerId);
      pointerId = null;
      track.classList.remove('is-dragging');
    };
    track?.addEventListener('pointerup', stopDrag);
    track?.addEventListener('pointercancel', stopDrag);
    track?.addEventListener('click', (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
  };
  enableDragScroll(document.querySelector('.reels-track'));

  const companyReasons = [...document.querySelectorAll('.company-reason')];
  const activateReason = (selected) => {
    const shouldOpen = selected.getAttribute('aria-expanded') !== 'true';
    companyReasons.forEach((reason) => {
      const active = reason === selected && shouldOpen;
      reason.classList.toggle('is-active', active);
      reason.setAttribute('aria-expanded', String(active));
      const toggle = reason.querySelector('.company-reason-toggle');
      if (toggle) toggle.textContent = active ? '−' : '+';
    });
  };
  companyReasons.forEach((reason) => {
    reason.addEventListener('click', () => activateReason(reason));
  });

  const videoDialog = document.querySelector('#video-dialog');
  const videoFrame = videoDialog?.querySelector('[data-video-frame]');
  const videoTitle = videoDialog?.querySelector('#video-dialog-title');
  const videoClose = videoDialog?.querySelector('.video-dialog-close');
  let videoReturnFocus = null;
  const closeVideo = () => {
    if (!videoDialog) return;
    if (videoDialog.open) videoDialog.close();
    if (videoFrame) videoFrame.replaceChildren();
    videoReturnFocus?.focus({ preventScroll: true });
  };
  const openVideo = (button) => {
    if (!videoDialog || !videoFrame) return;
    const { videoProvider, videoId, videoTitle: title } = button.dataset;
    if (!videoProvider || !videoId) return;
    const sources = {
      rutube: `https://rutube.ru/play/embed/${videoId}?autoplay=1`,
      kinescope: `https://kinescope.io/embed/${videoId}?autoplay=1`
    };
    if (!sources[videoProvider] && videoProvider !== 'local') return;
    videoReturnFocus = button;
    if (forestAudio && !forestAudio.paused) forestAudio.pause();
    if (videoTitle) videoTitle.textContent = title || 'Project video';
    videoDialog.dataset.format = button.classList.contains('reel-card') ? 'vertical' : 'horizontal';
    if (videoProvider === 'local') {
      const video = document.createElement('video');
      video.src = videoId;
      video.controls = true;
      video.playsInline = true;
      video.muted = button.dataset.videoMuted === 'true';
      video.defaultMuted = video.muted;
      video.preload = 'metadata';
      video.poster = button.querySelector('img')?.src || '';
      video.setAttribute('aria-label', title || 'Project video');
      videoFrame.replaceChildren(video);
      if (button.dataset.videoDescription) {
        const description = document.createElement('p');
        description.className = 'video-local-description';
        description.textContent = button.dataset.videoDescription;
        videoFrame.append(description);
      }
      videoDialog.showModal();
      video.play().catch(() => {});
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.src = sources[videoProvider];
    iframe.title = title || 'Project video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    videoFrame.replaceChildren(iframe);
    videoDialog.showModal();
  };
  document.querySelectorAll('[data-video-provider][data-video-id]').forEach((button) => {
    button.addEventListener('click', () => openVideo(button));
  });
  videoClose?.addEventListener('click', closeVideo);
  videoDialog?.addEventListener('click', (event) => {
    if (event.target === videoDialog) closeVideo();
  });
  videoDialog?.addEventListener('close', () => {
    if (videoFrame?.children.length) videoFrame.replaceChildren();
  });

  const leadDialog = document.querySelector('#lead-dialog');
  const leadForm = leadDialog?.querySelector('[data-lead-form]');
  const leadTitle = leadDialog?.querySelector('#lead-dialog-title');
  const leadSubmit = leadDialog?.querySelector('.lead-dialog-submit');
  const leadClose = leadDialog?.querySelector('.lead-dialog-close');
  let leadReturnFocus = null;
  const leadContent = {
    selection: { title: 'Find a plot', submit: 'Get a selection' },
    tour: { title: 'Book a tour', submit: 'Book a tour' },
    installment: { title: 'A plot in instalments', submit: 'Get a consultation' },
    promotion: { title: 'Take part in the promotion', submit: 'Submit an application' }
  };
  const setLeadIntent = (intent) => {
    const selectedIntent = leadContent[intent] ? intent : 'selection';
    const radio = leadForm?.querySelector(`input[name="popup-intent"][value="${selectedIntent}"]`);
    if (radio) radio.checked = true;
    if (leadTitle) leadTitle.textContent = leadContent[selectedIntent].title;
    if (leadSubmit) leadSubmit.textContent = leadContent[selectedIntent].submit;
    const intents = leadForm?.querySelector('.lead-intents');
    if (intents) intents.hidden = selectedIntent === 'promotion' || selectedIntent === 'installment';
    const intro = leadDialog?.querySelector('.lead-dialog-intro p');
    if (intro) intro.textContent = selectedIntent === 'installment'
      ? 'Leave your phone number — we will help you find a plot and explain the purchase terms'
      : selectedIntent === 'promotion'
      ? 'Leave your contact details — the team will contact you and tell you about taking part in the promotion.'
      : 'Leave your contact details — the team will clarify your plans and suggest a suitable next step.';
  };
  const closeLead = () => {
    if (leadDialog?.open) leadDialog.close();
  };
  const openLead = (trigger) => {
    if (!leadDialog) return;
    leadReturnFocus = trigger;
    setLeadIntent(trigger.dataset.leadIntent);
    const status = leadDialog.querySelector('.form-status');
    if (status) status.textContent = '';
    leadForm?.classList.remove('is-error', 'is-loading', 'is-success', 'is-submitted');
    const success = leadForm?.querySelector('.form-success');
    if (success) success.hidden = true;
    if (leadSubmit) {
      leadSubmit.disabled = false;
      leadSubmit.removeAttribute('aria-busy');
    }
    leadDialog.showModal();
  };
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lead-intent]');
    if (!trigger) return;
    event.preventDefault();
    openLead(trigger);
  });
  leadForm?.querySelectorAll('input[name="popup-intent"]').forEach((radio) => {
    radio.addEventListener('change', () => setLeadIntent(radio.value));
  });
  leadClose?.addEventListener('click', closeLead);
  leadDialog?.addEventListener('click', (event) => {
    if (event.target === leadDialog) closeLead();
  });
  leadDialog?.addEventListener('close', () => {
    leadReturnFocus?.focus({ preventScroll: true });
  });

  const soundButton = document.querySelector('.sound-control');
  const floatingBirdButton = document.querySelector('.floating-bird-control');
  const soundStatus = document.querySelector('.sound-status');
  const forestAudio = document.querySelector('#forest-audio');
  const setSoundState = (playing) => {
    [soundButton, floatingBirdButton].forEach((button) => {
      if (!button) return;
      button.setAttribute('aria-pressed', String(playing));
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-label', button === soundButton
        ? `Listen to the forest — ${playing ? 'turn off' : 'turn on'} forest sounds`
        : `Sound — ${playing ? 'turn off' : 'turn on'} forest sounds`);
    });
    const strong = soundButton?.querySelector('strong');
    if (strong) strong.textContent = 'Listen to the forest';
    const floatingLabel = floatingBirdButton?.querySelector('.sound-floating-label');
    if (floatingLabel) floatingLabel.textContent = playing ? 'Sound on' : 'Sound';

  };
  const toggleForestSound = async () => {
    if (!forestAudio) return;
    soundStatus?.classList.add('is-visible');
    if (!forestAudio.paused) {
      forestAudio.pause();
      setSoundState(false);
      return;
    }
    try {
      await forestAudio.play();
      setSoundState(true);
    } catch {
      setSoundState(false);
      if (soundStatus) soundStatus.textContent = 'Unable to play audio — please check your browser settings';
    }
  };
  soundButton?.addEventListener('click', toggleForestSound);
  floatingBirdButton?.addEventListener('click', toggleForestSound);
  const heroSoundRegion = document.querySelector('.hero');
  if (heroSoundRegion && floatingBirdButton && 'IntersectionObserver' in window) {
    const soundObserver = new IntersectionObserver(([entry]) => {
      const visible = !entry.isIntersecting;
      floatingBirdButton.classList.toggle('is-visible', visible);
      floatingBirdButton.inert = !visible;
      floatingBirdButton.tabIndex = visible ? 0 : -1;
    }, { threshold: 0 });
    soundObserver.observe(heroSoundRegion);
  }
  forestAudio?.addEventListener('play', () => {
    setSoundState(true);
    if (soundStatus) soundStatus.textContent = '';
  });
  forestAudio?.addEventListener('pause', () => setSoundState(false));
  forestAudio?.addEventListener('error', () => {
    setSoundState(false);
    if (soundStatus) soundStatus.textContent = 'Audio is temporarily unavailable';
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && forestAudio && !forestAudio.paused) forestAudio.pause();
  });

  const formatPhone = (value) => value;
  const isInternationalPhone = (value) => {
    if (!/^\+[0-9 ()-]+$/.test(value.trim())) return false;
    const normalized = value.trim().replace(/[ ()-]/g, '');
    // E.164 shape check, not a guarantee that the number is assigned/reachable.
    return /^\+[1-9]\d{6,14}$/.test(normalized);
  };
  document.querySelectorAll('[data-demo-form]').forEach((demoForm) => {
    const phone = demoForm.querySelector('input[type="tel"]');
    const submit = demoForm.querySelector('button[type="submit"]');
    const status = demoForm.querySelector('.form-status');
    const error = phone?.parentElement.querySelector('.field-error');
    const success = document.createElement('div');
    success.className = 'form-success';
    success.hidden = true;
    success.setAttribute('role', 'status');
    const successTitle = document.createElement('h3');
    successTitle.tabIndex = -1;
    successTitle.textContent = 'Thank you! Your application has been accepted';
    const successText = document.createElement('p');
    successText.textContent = 'A manager will contact you shortly.';
    success.append(successTitle, successText);
    demoForm.append(success);
    // Backend integration: dispatch only after the server confirms receipt.
    demoForm.addEventListener('lead:success', () => {
      demoForm.classList.remove('is-loading', 'is-error');
      demoForm.classList.add('is-submitted');
      success.hidden = false;
      if (submit) {
        submit.disabled = true;
        submit.removeAttribute('aria-busy');
      }
      successTitle.focus({ preventScroll: true });
    });
    phone?.addEventListener('input', () => {
      phone.value = formatPhone(phone.value);
      phone.setCustomValidity('');
      phone.removeAttribute('aria-invalid');
      if (error) error.textContent = '';
      demoForm.classList.remove('is-error');
    });
    demoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (demoForm.classList.contains('is-loading') || demoForm.classList.contains('is-submitted')) return;
      if (phone && !isInternationalPhone(phone.value)) {
        phone.setCustomValidity('Enter a phone number with a country code and 7–15 digits, e.g. +44 20 7946 0958');
        phone.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = 'Enter a phone number with a country code and 7–15 digits, e.g. +44 20 7946 0958';
      }
      const invalid = demoForm.querySelector(':invalid');
      if (invalid) {
        demoForm.classList.add('is-error');
        demoForm.classList.remove('is-success', 'is-loading');
        if (status) status.textContent = 'Please check the highlighted fields';
        invalid.focus({ preventScroll: true });
        invalid.reportValidity?.();
        return;
      }
      demoForm.classList.remove('is-error', 'is-success');
      demoForm.classList.add('is-loading');
      if (submit) {
        submit.disabled = true;
        submit.setAttribute('aria-busy', 'true');
      }
      if (status) status.textContent = 'Checking the data…';
      setTimeout(() => {
        if (demoForm.classList.contains('is-submitted')) return;
        demoForm.classList.remove('is-loading');
        if (submit) {
          submit.disabled = false;
          submit.removeAttribute('aria-busy');
        }
        if (status) status.textContent = 'Form completed. Submission will be enabled before the website launches.';
      }, reduceMotion.matches ? 0 : 450);
    });
  });

  const tourForm = document.querySelector('#tour [data-demo-form]');
  const tourSubmit = tourForm?.querySelector('[data-tour-submit]');
  const syncTourSubmit = () => {
    const intent = tourForm?.querySelector('input[name="intent"]:checked')?.value;
    if (tourSubmit) tourSubmit.textContent = intent === 'video' ? 'Get a video of the plot' : 'Book a tour';
  };
  tourForm?.querySelectorAll('input[name="intent"]').forEach((option) => option.addEventListener('change', syncTourSubmit));
  syncTourSubmit();

  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('[data-menu-label]').textContent = 'Menu';
    mobileMenu.hidden = true;
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.querySelector('[data-menu-label]').textContent = open ? 'Menu' : 'Close';
    if (mobileMenu) mobileMenu.hidden = open;
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!siteHeader?.contains(event.target) && !mobileMenu?.contains(event.target)) closeMenu();
  });
  matchMedia('(min-width: 1181px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
})();
