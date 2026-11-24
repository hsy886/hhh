/* ==========================================================================
   He Siyu — portfolio interactions
   No dependencies. All content is in assets/js/content.js
   ========================================================================== */

(() => {
  "use strict";

  const data = window.PORTFOLIO;
  if (!data || !Array.isArray(data.projects) || !data.projects.length) {
    console.error("Portfolio content is missing. Check assets/js/content.js.");
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const profile = data.profile;
  const projects = data.projects;
  const projectCount = projects.length;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const state = {
    route: { name: "home" },
    current: 0,
    stageLocked: false,
    stageUserPaused: false,
    activeVideo: null,
    activeProjectSlug: null,
    projectCleanup: null,
    worksBuilt: false,
    worksScroll: 0,
    aboutBuilt: false,
    aboutScroll: 0,
    contactReturnHash: "#/",
    contactBuilt: false,
    toastTimer: null,
    loaderDone: false,
    swipeSuppressUntil: 0
  };

  const refs = {};

  const pad2 = (value) => String(value).padStart(2, "0");
  const pad3 = (value) => String(value).padStart(3, "0");

  function escapeHTML(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return "00:00";
    const total = Math.floor(value);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${pad2(minutes)}:${pad2(seconds)}`;
  }

  function getProjectFile(project) {
    if (!project || !project.video) return "still-image.jpg";
    return project.video.split("/").pop() || "selected-study.mp4";
  }

  function getProjectBySlug(slug) {
    return projects.find((project) => project.slug === slug) || null;
  }

  function hashForRoute(route) {
    if (!route || route.name === "home") return "#/";
    if (route.name === "project") return `#/work/${route.slug}`;
    return `#/${route.name}`;
  }

  function parseRoute() {
    let raw = "";
    try {
      raw = decodeURIComponent((window.location.hash || "").replace(/^#\/?/, ""));
    } catch {
      raw = "";
    }
    raw = raw.replace(/\/+$/, "");

    if (!raw) return { name: "home" };
    if (raw === "works") return { name: "works" };
    if (raw === "about") return { name: "about" };
    if (raw === "contact") return { name: "contact" };
    if (raw.indexOf("work/") === 0) {
      const slug = raw.slice(5);
      if (getProjectBySlug(slug)) return { name: "project", slug };
    }
    return { name: "home" };
  }

  function cacheRefs() {
    refs.header = $("#site-header");
    refs.home = $("#home-view");
    refs.stage = $("#stage");
    refs.stageSlides = $("#stage-slides");
    refs.stageAnnouncer = $("#stage-announcer");
    refs.stageLink = $("#stage-link");
    refs.stageTitle = $("#stage-title");
    refs.stageCategory = $("#stage-category");
    refs.stageContext = $("#stage-context");
    refs.stagePosition = $("#stage-position");
    refs.stageDuration = $("#stage-duration");
    refs.stageYear = $("#stage-year");
    refs.stageRoles = $("#stage-roles");
    refs.stagePlay = $("#stage-play");
    refs.stageCountTotal = $(".stage-count__total");
    refs.homeBgPoster = $("#home-bg-poster");
    refs.homeBgVideo = $("#home-bg-video");
    refs.ambient = $("#home-ambient");
    refs.progressFill = $("#home-progress-fill");
    refs.progressValue = $("#home-progress-value");
    refs.homeCounter = $("#home-counter");
    refs.homePrev = $("#home-prev");
    refs.homeNext = $("#home-next");

    refs.worksView = $("#works-view");
    refs.worksScroll = $("#works-scroll");
    refs.worksList = $("#works-list");
    refs.worksHeading = $("#works-heading");
    refs.worksPreview = $("#works-preview");
    refs.worksPreviewImage = $("#works-preview-image");
    refs.worksPreviewLabel = $("#works-preview-label");

    refs.aboutView = $("#about-view");
    refs.aboutScroll = $("#about-scroll");
    refs.aboutHeading = $("#about-heading");
    refs.aboutCopy = $("#about-copy");
    refs.aboutPractice = $("#about-practice");
    refs.aboutInfo = $("#about-info");
    refs.aboutClosing = $("#about-closing");

    refs.projectView = $("#project-view");
    refs.projectScroll = $("#project-scroll");
    refs.projectContent = $("#project-content");

    refs.contactView = $("#contact-view");
    refs.contactClose = $("#contact-close");
    refs.contactHome = $("#contact-home");
    refs.contactEmail = $("#contact-email");
    refs.contactEmailText = $("#contact-email-text");
    refs.copyEmail = $("#copy-email");
    refs.socialList = $("#social-list");
    refs.toast = $("#toast");
    refs.cursor = $("#cursor");
    refs.cursorLabel = $("#cursor-label");
    refs.loader = $("#loader");
    refs.loaderPercent = $("#loader-percent");
    refs.loaderBar = $("#loader-bar");
    refs.loaderFile = $("#loader-file");
    refs.routeAnnouncer = $("#route-announcer");
    refs.navLinks = $$(".nav-link");
  }

  function bindProfile() {
    $$(".js-name").forEach((el) => (el.textContent = profile.name));
    $$(".js-name-cn").forEach((el) => (el.textContent = profile.nameCn));
    $$(".js-role").forEach((el) => (el.textContent = profile.shortRole || profile.role));
    $$(".js-discipline").forEach((el) => (el.textContent = profile.discipline));
    $$(".js-statement").forEach((el) => (el.textContent = profile.statement));
    $$(".js-availability").forEach((el) => (el.textContent = profile.availability));
    $$(".js-location").forEach((el) => (el.textContent = profile.location));

    const emailText = profile.email;
    if (refs.contactEmail) refs.contactEmail.href = `mailto:${emailText}`;
    if (refs.contactEmailText) refs.contactEmailText.textContent = emailText;

    const count = pad2(projectCount);
    $$(".nav-link__count").forEach((el) => (el.textContent = count));
    refs.stageCountTotal.textContent = ` / ${count}`;
    refs.homeCounter.textContent = `01 / ${count}`;
    refs.loaderFile.textContent = getProjectFile(projects[0]);

    const year = String(new Date().getFullYear());
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = year;
  }

  function buildAbout() {
    if (state.aboutBuilt) return;
    const about = data.about || {};
    const lead = about.lead || "I make images of places that almost exist.";

    if (refs.aboutHeading) refs.aboutHeading.textContent = lead;
    if (refs.aboutCopy) {
      refs.aboutCopy.innerHTML = (about.paragraphs || [])
        .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
        .join("");
    }
    if (refs.aboutPractice) {
      refs.aboutPractice.innerHTML = `<dl class="practice-list">${(about.practice || [])
        .map(
          (item) =>
            `<div class="practice-item"><dt>${escapeHTML(item.label)}</dt><dd>${escapeHTML(item.text)}</dd></div>`
        )
        .join("")}</dl>`;
    }
    if (refs.aboutInfo) {
      refs.aboutInfo.innerHTML = (about.info || [])
        .map(
          (item) =>
            `<div><dt>${escapeHTML(item.label)}</dt><dd>${escapeHTML(item.value)}</dd></div>`
        )
        .join("");
    }
    if (refs.aboutClosing) refs.aboutClosing.textContent = about.closing || "";

    state.aboutBuilt = true;
  }

  function buildContact() {
    if (state.contactBuilt) return;
    const socials = Array.isArray(profile.socials) ? profile.socials.filter((item) => item.url) : [];

    if (refs.socialList) {
      if (!socials.length) {
        refs.socialList.hidden = true;
      } else {
        refs.socialList.innerHTML = socials
          .map(
            (social) =>
              `<li><a href="${escapeHTML(social.url)}" target="_blank" rel="noopener noreferrer" data-cursor="${escapeHTML(social.label)}">${escapeHTML(social.label)} ↗</a></li>`
          )
          .join("");
      }
    }

    state.contactBuilt = true;
  }

  /* ------------------------------------------------------------------------
     Home / selected work stage
     ------------------------------------------------------------------------ */

  function titleMarkup(project) {
    return (project.titleLines || [project.title])
      .map(
        (line, index) =>
          `<span class="title-line" style="--line-index:${index}"><span>${escapeHTML(line)}</span></span>`
      )
      .join("");
  }

  function createStageSlide(project) {
    const slide = document.createElement("div");
    slide.className = "stage-slide";
    slide.dataset.slug = project.slug;

    const poster = document.createElement("img");
    poster.src = project.poster;
    poster.alt = `Still from ${project.title}`;
    poster.decoding = "async";
    poster.draggable = false;
    slide.appendChild(poster);

    let video = null;
    if (project.video) {
      video = document.createElement("video");
      video.src = project.video;
      video.poster = project.poster;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-hidden", "true");
      video.setAttribute("tabindex", "-1");
      video.addEventListener("playing", () => {
        video.classList.add("is-playing");
        if (video === state.activeVideo) {
          refs.stagePlay.classList.remove("is-paused");
          refs.stagePlay.setAttribute("aria-label", "Pause background video");
        }
      });
      video.addEventListener("pause", () => {
        if (video === state.activeVideo) {
          refs.stagePlay.classList.add("is-paused");
          refs.stagePlay.setAttribute("aria-label", "Play background video");
        }
      });
      video.addEventListener("error", () => {
        video.classList.remove("is-playing");
        if (video === state.activeVideo) {
          refs.stagePlay.classList.add("is-paused");
        }
      });
      slide.appendChild(video);
    }

    return { slide, video };
  }

  function setActiveStageSlide(project, immediate = false) {
    // Remove any stale slides left by a fast sequence.
    $$(".stage-slide:not(.is-active)", refs.stageSlides).forEach((slide) => {
      const video = slide.querySelector("video");
      if (video) video.pause();
      slide.remove();
    });

    const previousSlide = refs.stageSlides.querySelector(".stage-slide.is-active");
    const previousVideo = previousSlide ? previousSlide.querySelector("video") : null;
    if (previousVideo) previousVideo.pause();

    const { slide, video } = createStageSlide(project);
    refs.stageSlides.appendChild(slide);
    if (immediate) {
      slide.classList.add("is-active");
    } else {
      requestAnimationFrame(() => slide.classList.add("is-active"));
    }

    if (previousSlide) {
      previousSlide.classList.remove("is-active");
      previousSlide.classList.add("is-leaving");
      window.setTimeout(() => previousSlide.remove(), 950);
    }

    state.activeVideo = video;
    refs.stage.dataset.fit = project.fit || "cover";
    refs.stagePlay.hidden = !video;
    refs.stagePlay.classList.add("is-paused");
    refs.stagePlay.setAttribute("aria-label", "Play background video");

    if (video && !reduceMotion) {
      video.addEventListener(
        "canplay",
        () => {
          if (
            state.activeVideo === video &&
            state.route.name === "home" &&
            !state.stageUserPaused &&
            !document.hidden
          ) {
            video.play().catch(() => {});
          }
        },
        { once: true }
      );
    }
  }

  function setHomeBackground(project) {
    const bg = refs.homeBgVideo;
    const poster = refs.homeBgPoster;
    if (!bg || !poster) return;

    if (poster.getAttribute("src") !== project.poster) {
      poster.src = project.poster;
    }

    const source = project.backgroundVideo;
    if (!source) {
      bg.classList.remove("is-visible");
      bg.pause();
      bg.removeAttribute("src");
      delete bg.dataset.src;
      try {
        bg.load();
      } catch {
        /* noop */
      }
      return;
    }

    if (bg.dataset.src === source) {
      startHomeBackground();
      return;
    }

    bg.pause();
    bg.classList.remove("is-visible");
    bg.dataset.src = source;
    bg.src = source;
    bg.load();
    startHomeBackground();
  }

  function startHomeBackground() {
    const bg = refs.homeBgVideo;
    if (
      !bg ||
      !bg.getAttribute("src") ||
      state.route.name !== "home" ||
      reduceMotion ||
      state.stageUserPaused ||
      document.hidden
    ) {
      return;
    }
    bg.muted = true;
    const promise = bg.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => bg.classList.remove("is-visible"));
    }
  }

  function startStageVideo() {
    if (
      state.route.name !== "home" ||
      reduceMotion ||
      state.stageUserPaused ||
      document.hidden
    ) {
      return;
    }

    startHomeBackground();

    if (!state.activeVideo) return;
    state.activeVideo.muted = true;
    const promise = state.activeVideo.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        refs.stagePlay.classList.add("is-paused");
        refs.stagePlay.setAttribute("aria-label", "Play background video");
      });
    }
  }

  function pauseStageVideo() {
    if (state.activeVideo) state.activeVideo.pause();
    if (refs.homeBgVideo) refs.homeBgVideo.pause();
  }

  function setStageText(project) {
    refs.stageCategory.textContent = project.category;
    refs.stageContext.textContent = project.context;
    refs.stagePosition.textContent = pad2(state.current + 1);
    refs.stageDuration.textContent = project.duration;
    refs.stageYear.textContent = project.year;
    refs.stageRoles.innerHTML = (project.roles || [])
      .map((role) => `<li>${escapeHTML(role)}</li>`)
      .join("");

    refs.stageLink.href = `#/work/${project.slug}`;
    refs.stageLink.setAttribute("aria-label", `Open study ${project.title}`);
    if (refs.stageAnnouncer) {
      refs.stageAnnouncer.textContent = `Selected study ${state.current + 1} of ${projectCount}: ${project.title}. ${project.category}, ${project.year}.`;
    }

    refs.stageTitle.classList.remove("is-in", "is-out");
    refs.stageTitle.innerHTML = titleMarkup(project);
    void refs.stageTitle.offsetWidth;
    requestAnimationFrame(() => {
      refs.stageTitle.classList.add("is-in");
    });

    refs.stage.style.setProperty("--accent", project.accent || "#ff4d2e");
    refs.home.style.setProperty("--accent", project.accent || "#ff4d2e");
    setHomeBackground(project);

    const percent = ((state.current + 1) / projectCount) * 100;
    refs.progressFill.style.height = `${percent}%`;
    refs.progressValue.textContent = pad2(state.current + 1);
    refs.homeCounter.textContent = `${pad2(state.current + 1)} / ${pad2(projectCount)}`;
    refs.loaderFile.textContent = getProjectFile(project);

    refs.stagePlay.hidden = !project.video;
    refs.stagePlay.classList.add("is-paused");
    refs.stagePlay.setAttribute("aria-label", "Play background video");

    window.setTimeout(() => preloadPoster((state.current + 1) % projectCount), 500);
    window.setTimeout(() => preloadPoster((state.current - 1 + projectCount) % projectCount), 950);
  }

  function preloadPoster(index) {
    const project = projects[index];
    if (!project) return;
    const img = new Image();
    img.decoding = "async";
    img.src = project.poster;
  }

  function changeStage(direction) {
    if (state.stageLocked) return;
    if (projectCount < 2) return;

    const nextIndex = (state.current + direction + projectCount) % projectCount;
    const nextProject = projects[nextIndex];

    state.stageLocked = true;
    state.stageUserPaused = false;
    refs.stage.classList.add("is-swapping", "is-changing");
    refs.stageTitle.classList.remove("is-in");
    refs.stageTitle.classList.add("is-out");
    refs.stagePlay.classList.add("is-paused");
    pauseStageVideo();

    const apply = () => {
      state.current = nextIndex;
      setStageText(nextProject);
      setActiveStageSlide(nextProject, false);
      refs.stage.classList.remove("is-swapping");
      startStageVideo();
      window.setTimeout(() => refs.stage.classList.remove("is-changing"), 120);
    };

    if (reduceMotion) {
      apply();
      state.stageLocked = false;
    } else {
      window.setTimeout(apply, 240);
      window.setTimeout(() => {
        state.stageLocked = false;
      }, 980);
    }
  }

  function initHome() {
    if (refs.homeBgVideo) {
      refs.homeBgVideo.addEventListener("playing", () => {
        refs.homeBgVideo.classList.add("is-visible");
      });
      refs.homeBgVideo.addEventListener("error", () => {
        refs.homeBgVideo.classList.remove("is-visible");
      });
    }

    setStageText(projects[0]);
    setActiveStageSlide(projects[0], true);
    refs.stageTitle.classList.remove("is-out");
    refs.stageTitle.classList.add("is-in");

    refs.homePrev.addEventListener("click", () => changeStage(-1));
    refs.homeNext.addEventListener("click", () => changeStage(1));

    refs.stagePlay.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!state.activeVideo) return;
      if (state.activeVideo.paused) {
        state.stageUserPaused = false;
        startStageVideo();
      } else {
        state.stageUserPaused = true;
        state.activeVideo.pause();
      }
    });

    // Wheel gestures move through the index instead of scrolling.
    let wheelAccumulator = 0;
    let wheelResetTimer = 0;
    window.addEventListener(
      "wheel",
      (event) => {
        if (state.route.name !== "home") return;
        event.preventDefault();
        if (state.stageLocked) return;

        const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        wheelAccumulator += event.deltaY * multiplier;
        window.clearTimeout(wheelResetTimer);
        wheelResetTimer = window.setTimeout(() => {
          wheelAccumulator = 0;
        }, 220);

        if (Math.abs(wheelAccumulator) > 34) {
          const direction = wheelAccumulator > 0 ? 1 : -1;
          wheelAccumulator = 0;
          changeStage(direction);
        }
      },
      { passive: false }
    );

    // Touch / pen swipe.
    let touchStart = null;
    refs.home.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") return;
      touchStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    });
    refs.home.addEventListener("pointerup", (event) => {
      if (!touchStart || event.pointerId !== touchStart.id) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 46) return;
      state.swipeSuppressUntil = Date.now() + 450;
      const next = Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0;
      changeStage(next ? 1 : -1);
    });
    refs.home.addEventListener("pointercancel", () => {
      touchStart = null;
    });
    refs.home.addEventListener(
      "click",
      (event) => {
        if (Date.now() < state.swipeSuppressUntil) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseStageVideo();
      } else if (state.route.name === "home" && !state.stageUserPaused) {
        startStageVideo();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Works index
     ------------------------------------------------------------------------ */

  function buildWorks() {
    if (state.worksBuilt) return;

    refs.worksList.innerHTML = projects
      .map(
        (project, index) => `
        <a class="work-row" href="#/work/${escapeHTML(project.slug)}"
           data-slug="${escapeHTML(project.slug)}"
           data-poster="${escapeHTML(project.poster)}"
           data-fit="${escapeHTML(project.fit || "cover")}"
           data-cursor="Open"
           aria-label="Open study ${escapeHTML(project.title)}">
          <span class="work-row__num">${pad2(index + 1)}</span>
          <span class="work-row__title">${escapeHTML(project.title)}</span>
          <span class="work-row__meta"><span>${escapeHTML(project.category)}</span><span>${escapeHTML(project.year)}</span></span>
          <span class="work-row__arrow" aria-hidden="true">↗</span>
        </a>`
      )
      .join("");

    if (finePointer) {
      const rows = $$(".work-row", refs.worksList);
      rows.forEach((row) => {
        row.addEventListener("mouseenter", (event) => showWorksPreview(row, event));
        row.addEventListener("mousemove", (event) => moveWorksPreview(event));
        row.addEventListener("mouseleave", hideWorksPreview);
        row.addEventListener("focus", () => hideWorksPreview());
      });
      refs.worksScroll.addEventListener("scroll", hideWorksPreview, { passive: true });
      window.addEventListener("resize", hideWorksPreview);
    }

    state.worksBuilt = true;
  }

  function showWorksPreview(row, event) {
    if (!refs.worksPreview || !row.dataset.poster) return;
    const poster = row.dataset.poster;
    if (refs.worksPreviewImage.getAttribute("src") !== poster) {
      refs.worksPreviewImage.src = poster;
      refs.worksPreviewImage.alt = "";
    }
    refs.worksPreview.classList.toggle("is-contain", row.dataset.fit === "contain");
    refs.worksPreviewLabel.textContent = "View study";
    moveWorksPreview(event);
    refs.worksPreview.classList.add("is-visible");
  }

  function moveWorksPreview(event) {
    if (!refs.worksPreview) return;
    const pad = 18;
    const offset = 30;
    const width = refs.worksPreview.offsetWidth || 220;
    const height = refs.worksPreview.offsetHeight || 124;

    // Keep the preview out of the title column; it lives in the open right field.
    let x = Math.max(event.clientX + width / 2 + offset, window.innerWidth * 0.59);
    if (x + width / 2 > window.innerWidth - pad) {
      x = window.innerWidth - width / 2 - pad;
    }
    const y = Math.min(
      Math.max(event.clientY, height / 2 + pad),
      window.innerHeight - height / 2 - pad
    );
    refs.worksPreview.style.setProperty("--preview-x", `${x}px`);
    refs.worksPreview.style.setProperty("--preview-y", `${y}px`);
  }

  function hideWorksPreview() {
    if (refs.worksPreview) refs.worksPreview.classList.remove("is-visible");
  }

  /* ------------------------------------------------------------------------
     Project page + custom player
     ------------------------------------------------------------------------ */

  function playerMarkup(project) {
    return `
      <figure class="player" id="project-player">
        <div class="player-stage">
          <video class="player-video" id="project-video"
            src="${escapeHTML(project.video)}"
            poster="${escapeHTML(project.poster)}"
            preload="auto" muted playsinline
            aria-label="${escapeHTML(project.title)} study clip"></video>
          <img class="player-poster" src="${escapeHTML(project.poster)}" alt="" aria-hidden="true">
          <button class="player-hit" type="button" aria-label="Play ${escapeHTML(project.title)} clip" data-player-hit data-cursor="Play">
            <span class="player-badge" data-player-badge>Play</span>
          </button>
          <span class="player-error">Video unavailable</span>
        </div>
        <figcaption class="player-bar">
          <button class="player-button" type="button" data-player-toggle aria-label="Play video">Play</button>
          <span class="player-time"><span data-player-current>00:00</span><i>/</i><span data-player-duration>${escapeHTML(project.duration)}</span></span>
          <input class="player-range" type="range" min="0" max="100" step="0.1" value="0" aria-label="Seek video" data-player-range>
          ${project.hasAudio ? '<button class="player-button" type="button" data-player-mute aria-label="Turn sound on">Sound off</button>' : ""}
          <button class="player-button" type="button" data-player-fullscreen aria-label="Enter full screen">Full screen</button>
        </figcaption>
      </figure>`;
  }

  function galleryMarkup(project) {
    const stills = project.stills || [];
    return `
      <div class="project-gallery">
        ${stills
          .map(
            (src, index) => `
            <figure>
              <img src="${escapeHTML(src)}" alt="${escapeHTML(project.title)} study, view ${index + 1}" loading="lazy" decoding="async">
              <figcaption>Still ${pad2(index + 1)} / ${escapeHTML(project.title)}</figcaption>
            </figure>`
          )
          .join("")}
      </div>`;
  }

  function renderProject(slug) {
    const index = projects.findIndex((project) => project.slug === slug);
    if (index < 0) return false;
    const project = projects[index];
    const next = projects[(index + 1) % projectCount];
    const number = pad2(index + 1);

    state.activeProjectSlug = slug;
    refs.projectView.style.setProperty("--accent", project.accent || "#ff4d2e");
    refs.stage.style.setProperty("--accent", project.accent || "#ff4d2e");

    const description = (project.description || [])
      .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
      .join("");

    refs.projectContent.innerHTML = `
      <div class="project-topline">
        <div class="project-topline__left">
          <a href="#/works" data-cursor="Back to index">← All studies</a>
          <span>${number} / ${pad2(projectCount)}</span>
        </div>
        <span>${escapeHTML(project.category)} / ${escapeHTML(project.year)}</span>
      </div>

      <header class="project-intro">
        <div class="project-title-block">
          <p class="project-category"><span class="live-dot" aria-hidden="true"></span>${escapeHTML(project.category)} <span class="project-category__slash">/</span> ${escapeHTML(project.context)}</p>
          <h2 class="project-title" id="project-title" tabindex="-1">${(project.titleLines || [project.title])
            .map((line) => `<span>${escapeHTML(line)}</span>`)
            .join("")}</h2>
          <div class="project-submeta">
            <span>${escapeHTML(project.duration)}</span>
            <span>${escapeHTML(project.year)}</span>
            <span>${escapeHTML(project.context)}</span>
            <span>${escapeHTML(profile.location)}</span>
          </div>
        </div>

        <div class="project-summary">
          <p class="project-summary-synopsis">${escapeHTML(project.synopsis)}</p>
          <div class="project-summary-body">${description}</div>
        </div>
      </header>

      <div class="project-media">
        ${project.video ? playerMarkup(project) : galleryMarkup(project)}
      </div>

      <section class="project-details" aria-label="Study notes">
        <div class="project-credits">
          <h3>Notes</h3>
          <dl class="credits-list">
            ${(project.notes || project.credits || [])
              .map(
                (note) =>
                  `<div><dt>${escapeHTML(note.label)}</dt><dd>${escapeHTML(note.value)}</dd></div>`
              )
              .join("")}
          </dl>
        </div>
        <div class="project-roles-detail">
          <h3>Focus</h3>
          <ul class="role-detail-list">
            ${project.roles.map((role) => `<li>${escapeHTML(role)}</li>`).join("")}
          </ul>
        </div>
        <div class="project-about-detail">
          <h3>Details</h3>
          <p>${escapeHTML(project.category)} / ${escapeHTML(project.context)}. ${escapeHTML(project.duration)}. ${escapeHTML(project.year)}.</p>
          <p>For process notes, project files or a conversation about the exercise, <a class="inline-link" href="#/contact">get in touch ↗</a>.</p>
        </div>
      </section>

      <nav class="project-next" aria-label="Next study">
        <span class="project-next__label">Next study</span>
        <a class="project-next__link" href="#/work/${escapeHTML(next.slug)}" data-cursor="Next study">
          <span>${escapeHTML(next.title)}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <footer class="project-foot">
        <a class="text-link" href="#/works">Back to index</a>
        <p>${escapeHTML(project.title)} / ${number} of ${pad2(projectCount)}</p>
        <a class="text-link" href="#/contact">Contact ↗</a>
      </footer>`;

    if (project.video) {
      initProjectPlayer(project);
    }

    return true;
  }

  function initProjectPlayer(project) {
    const player = $("#project-player");
    if (!player) return;
    const video = $("#project-video");
    const posterOverlay = $(".player-poster", player);
    const hit = $("[data-player-hit]", player);
    const badge = $("[data-player-badge]", player);
    const toggleButton = $("[data-player-toggle]", player);
    const muteButton = $("[data-player-mute]", player);
    const fullscreenButton = $("[data-player-fullscreen]", player);
    const range = $("[data-player-range]", player);
    const currentLabel = $("[data-player-current]", player);
    const durationLabel = $("[data-player-duration]", player);

    if (!video || !hit || !range) return;

    let cleanupDone = false;
    let posterHidden = false;

    video.muted = true;
    video.volume = 0.85;

    const hidePoster = () => {
      if (posterHidden || !posterOverlay) return;
      if (video.paused && video.currentTime < 0.05) return;
      posterHidden = true;
      posterOverlay.classList.add("is-hidden");
      window.setTimeout(() => posterOverlay.remove(), 700);
    };

    if (typeof video.requestVideoFrameCallback === "function") {
      const requestFirstFrame = () => {
        video.requestVideoFrameCallback(() => {
          if (video.paused && video.currentTime < 0.05) {
            requestFirstFrame();
            return;
          }
          hidePoster();
        });
      };
      requestFirstFrame();
    } else {
      video.addEventListener("playing", hidePoster, { once: true });
    }

    const updateRange = (percent) => {
      const safe = Math.min(100, Math.max(0, percent || 0));
      range.value = String(safe);
      range.style.setProperty("--progress", `${safe}%`);
    };

    const updateTime = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      if (currentLabel) currentLabel.textContent = formatTime(current);
      if (durationLabel) durationLabel.textContent = duration ? formatTime(duration) : project.duration;
      updateRange(duration ? (current / duration) * 100 : 0);
      range.setAttribute(
        "aria-valuetext",
        `${formatTime(current)} of ${duration ? formatTime(duration) : project.duration}`
      );
    };

    const syncPlaybackUI = () => {
      const paused = video.paused;
      player.classList.toggle("is-paused", paused);
      player.classList.toggle("is-playing", !paused);
      const label = paused ? "Play" : "Pause";
      if (toggleButton) {
        toggleButton.textContent = label;
        toggleButton.setAttribute("aria-label", `${label} video`);
      }
      if (badge) badge.textContent = label;
      hit.setAttribute("aria-label", `${label} ${project.title} clip`);
      hit.dataset.cursor = label;
    };

    const togglePlayback = () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        if (durationLabel) durationLabel.textContent = formatTime(video.duration);
      }
      updateTime();
    };

    const onTimeUpdate = () => updateTime();

    const onSeek = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const percent = Number(range.value) / 100;
      const nextTime = Math.min(video.duration - 0.02, Math.max(0, percent * video.duration));
      video.currentTime = nextTime;
      updateRange(Number(range.value));
    };

    const onRangeInput = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const percent = Number(range.value) / 100;
      video.currentTime = Math.max(0, percent * video.duration);
      range.style.setProperty("--progress", `${percent * 100}%`);
      if (currentLabel) currentLabel.textContent = formatTime(video.currentTime);
    };

    const onMute = () => {
      video.muted = !video.muted;
      if (muteButton) {
        muteButton.textContent = video.muted ? "Sound off" : "Sound on";
        muteButton.setAttribute("aria-label", video.muted ? "Turn sound on" : "Turn sound off");
      }
    };

    const onFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (player.requestFullscreen) {
          await player.requestFullscreen();
        }
      } catch {
        /* fullscreen can fail in embedded browsers */
      }
    };

    const onFullscreenChange = () => {
      if (!fullscreenButton) return;
      const isFullscreen = document.fullscreenElement === player;
      fullscreenButton.textContent = isFullscreen ? "Exit full screen" : "Full screen";
      fullscreenButton.setAttribute(
        "aria-label",
        isFullscreen ? "Exit full screen" : "Enter full screen"
      );
    };

    const onPlay = () => syncPlaybackUI();
    const onPause = () => syncPlaybackUI();
    const onEnded = () => {
      syncPlaybackUI();
      updateRange(100);
    };
    const onError = () => {
      if (cleanupDone) return;
      player.classList.add("has-error");
      player.classList.add("is-paused");
    };
    const onCanPlay = () => {
      if (
        state.route.name === "project" &&
        state.route.slug === project.slug &&
        !reduceMotion &&
        video.paused
      ) {
        video.play().catch(() => {});
      }
    };

    hit.addEventListener("click", togglePlayback);
    if (toggleButton) toggleButton.addEventListener("click", togglePlayback);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    video.addEventListener("canplay", onCanPlay, { once: true });
    range.addEventListener("input", onRangeInput);
    range.addEventListener("change", onSeek);
    if (muteButton) muteButton.addEventListener("click", onMute);
    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", onFullscreen);
      document.addEventListener("fullscreenchange", onFullscreenChange);
      const canFullscreen = Boolean(document.fullscreenEnabled && player.requestFullscreen);
      if (!canFullscreen) fullscreenButton.hidden = true;
    }

    syncPlaybackUI();
    updateTime();

    if (!reduceMotion) {
      if (video.readyState >= 2) {
        video.play().catch(() => {});
      }
    }

    state.projectCleanup = () => {
      cleanupDone = true;
      video.pause();
      if (document.fullscreenElement === player && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      video.removeEventListener("canplay", onCanPlay);
      range.removeEventListener("input", onRangeInput);
      range.removeEventListener("change", onSeek);
      if (muteButton) muteButton.removeEventListener("click", onMute);
      if (fullscreenButton) {
        fullscreenButton.removeEventListener("click", onFullscreen);
        document.removeEventListener("fullscreenchange", onFullscreenChange);
      }
      video.removeAttribute("src");
      video.pause();
      try {
        video.load();
      } catch {
        /* noop */
      }
    };
  }

  function cleanupProject() {
    if (typeof state.projectCleanup === "function") {
      state.projectCleanup();
      state.projectCleanup = null;
    }
    state.activeProjectSlug = null;
  }

  /* ------------------------------------------------------------------------
     Routing and page state
     ------------------------------------------------------------------------ */

  function setPageOpen(element, open) {
    if (!element) return;
    element.classList.toggle("is-open", open);
    element.inert = !open;
    element.setAttribute("aria-hidden", String(!open));
  }

  function setActiveNav(routeName) {
    let active = routeName;
    if (routeName === "project") active = "works";
    refs.navLinks.forEach((link) => {
      if (link.dataset.nav === active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function setDocumentMetadata(route) {
    let title = "He Siyu — 3D & CG Student";
    let announcement = "";
    if (route.name === "works") {
      title = "Selected studies — He Siyu";
      announcement = "Selected studies. Six 3D exercises.";
    } else if (route.name === "about") {
      title = "About — He Siyu";
      announcement = "About He Siyu. Second-year 3D practice.";
    } else if (route.name === "contact") {
      title = "Contact — He Siyu";
      announcement = "Contact. Student work, feedback welcome.";
    } else if (route.name === "project") {
      const project = getProjectBySlug(route.slug);
      if (project) {
        const index = projects.indexOf(project);
        title = `${project.title} — He Siyu`;
        announcement = `Study ${index + 1} of ${projectCount}: ${project.title}. ${project.category}, ${project.year}.`;
      }
    } else {
      announcement = "";
    }
    document.title = title;
    if (refs.routeAnnouncer) refs.routeAnnouncer.textContent = announcement;
  }

  function focusWhenReady(element, delay = 80) {
    if (!element) return;
    window.setTimeout(() => {
      if (!element.isConnected) return;
      try {
        element.focus({ preventScroll: true });
      } catch {
        element.focus();
      }
    }, delay);
  }

  function applyRoute(route, options = {}) {
    const previous = state.route;
    const initial = Boolean(options.initial);
    const isContact = route.name === "contact";

    if (previous.name === "works" && route.name !== "works" && refs.worksScroll) {
      state.worksScroll = refs.worksScroll.scrollTop;
    }
    if (previous.name === "about" && route.name !== "about" && refs.aboutScroll) {
      state.aboutScroll = refs.aboutScroll.scrollTop;
    }

    if (previous.name !== route.name) {
      hideWorksPreview();
      if (refs.cursor) {
        refs.cursor.classList.remove("has-label");
        if (refs.cursorLabel) refs.cursorLabel.textContent = "";
      }
    }

    if (isContact && previous.name !== "contact") {
      state.contactReturnHash = hashForRoute(previous);
    }

    if (previous.name === "project" && (route.name !== "project" || route.slug !== previous.slug)) {
      cleanupProject();
    }

    if (route.name !== "home") {
      pauseStageVideo();
    }

    // Set the route before rendering/playback so all helpers see the new state.
    state.route = route;

    setPageOpen(refs.worksView, route.name === "works");
    setPageOpen(refs.aboutView, route.name === "about");
    setPageOpen(refs.projectView, route.name === "project");

    refs.contactView.classList.toggle("is-open", isContact);
    refs.contactView.inert = !isContact;
    refs.contactView.setAttribute("aria-hidden", String(!isContact));

    refs.home.inert = route.name !== "home";
    refs.home.setAttribute("aria-hidden", String(route.name !== "home"));

    refs.header.inert = isContact;
    refs.header.setAttribute("aria-hidden", String(isContact));

    document.body.classList.toggle("is-contact", isContact);
    document.body.classList.toggle("theme-light", isContact);
    document.body.dataset.route = route.name;

    setActiveNav(route.name);
    setDocumentMetadata(route);

    if (route.name === "works") {
      buildWorks();
      requestAnimationFrame(() => {
        if (refs.worksScroll) refs.worksScroll.scrollTop = state.worksScroll;
      });
      if (!initial) focusWhenReady(refs.worksHeading);
    }

    if (route.name === "about") {
      buildAbout();
      requestAnimationFrame(() => {
        if (refs.aboutScroll) refs.aboutScroll.scrollTop = state.aboutScroll;
      });
      if (!initial) focusWhenReady(refs.aboutHeading);
    }

    if (route.name === "project") {
      const rendered = renderProject(route.slug);
      if (!rendered) {
        window.location.hash = "#/works";
        return;
      }
      if (refs.projectScroll) refs.projectScroll.scrollTop = 0;
      if (!initial) {
        const title = $("#project-title");
        focusWhenReady(title);
      }
    }

    if (route.name === "contact") {
      buildContact();
      if (refs.contactView) refs.contactView.scrollTop = 0;
      focusWhenReady(refs.contactClose, 240);
    }

    if (route.name === "home") {
      if (!initial && previous.name !== "home") {
        focusWhenReady($(".brand"));
      }
      if (!reduceMotion && !state.stageUserPaused) {
        startStageVideo();
      }
    }

    // Save what a direct close from contact should return to.
    if (route.name !== "contact") {
      state.contactReturnHash = hashForRoute(route);
    }
  }

  function navigateHome() {
    window.location.hash = "#/";
  }

  function closeContact() {
    const target = state.contactReturnHash && state.contactReturnHash !== "#/contact"
      ? state.contactReturnHash
      : "#/";
    window.location.hash = target;
  }

  function handleEscape(event) {
    if (event.key !== "Escape") return;
    if (document.fullscreenElement) return; // let the browser exit fullscreen first
    if (state.route.name === "contact") {
      event.preventDefault();
      closeContact();
      return;
    }
    if (state.route.name === "project") {
      event.preventDefault();
      window.location.hash = "#/works";
      return;
    }
    if (state.route.name === "works" || state.route.name === "about") {
      event.preventDefault();
      navigateHome();
    }
  }

  function handleGlobalKeys(event) {
    if (event.key === "Escape") {
      handleEscape(event);
      return;
    }

    if (state.route.name !== "home") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target instanceof HTMLElement) {
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      changeStage(1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      changeStage(-1);
    }
  }

  function trapContactFocus(event) {
    if (state.route.name !== "contact" || event.key !== "Tab") return;
    const focusables = $$(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      refs.contactView
    ).filter((element) => element.offsetParent !== null || element === document.activeElement);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (!refs.contactView.contains(active)) {
      event.preventDefault();
      first.focus();
      return;
    }
    if (!focusables.includes(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------------------------------------------------
     Contact helpers
     ------------------------------------------------------------------------ */

  function showToast(message) {
    if (!refs.toast) return;
    refs.toast.textContent = message;
    refs.toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => {
      refs.toast.classList.remove("is-visible");
    }, 2200);
  }


  async function copyEmailAddress() {
    const email = profile.email;
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (!copied) {
      const temp = document.createElement("textarea");
      temp.value = email;
      temp.setAttribute("readonly", "");
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      temp.style.pointerEvents = "none";
      document.body.appendChild(temp);
      temp.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      temp.remove();
    }
    showToast(copied ? "Email copied" : "Copy failed — select the address instead");
    if (refs.copyEmail) {
      const original = "Copy email";
      refs.copyEmail.textContent = copied ? "Copied" : "Select to copy";
      window.setTimeout(() => {
        refs.copyEmail.textContent = original;
      }, 1800);
    }
  }

  /* ------------------------------------------------------------------------
     Cursor
     ------------------------------------------------------------------------ */

  function initCursor() {
    if (!finePointer || !refs.cursor) return;
    document.documentElement.classList.add("has-custom-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let visible = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      refs.cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      window.requestAnimationFrame(render);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        targetX = event.clientX;
        targetY = event.clientY;
        if (!visible) {
          visible = true;
          refs.cursor.classList.add("is-visible");
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      visible = false;
      refs.cursor.classList.remove("is-visible");
    });

    document.addEventListener("mouseover", (event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-cursor]") : null;
      if (target && target.getAttribute("data-cursor")) {
        refs.cursorLabel.textContent = target.getAttribute("data-cursor");
        refs.cursor.classList.add("has-label");
      } else {
        refs.cursor.classList.remove("has-label");
        refs.cursorLabel.textContent = "";
      }
    });

    document.addEventListener("click", () => {
      if (!visible) return;
      refs.cursor.classList.remove("has-label");
      refs.cursorLabel.textContent = "";
    });

    render();
  }

  /* ------------------------------------------------------------------------
     Loader
     ------------------------------------------------------------------------ */

  function startLoader() {
    const loader = refs.loader;
    if (!loader) {
      document.body.classList.add("is-ready");
      return;
    }

    let value = 0;
    const duration = reduceMotion ? 350 : 1150;

    const paint = () => {
      const percent = Math.min(100, Math.max(0, value));
      if (refs.loaderPercent) refs.loaderPercent.textContent = pad3(Math.floor(percent));
      if (refs.loaderBar) refs.loaderBar.style.transform = `scaleX(${percent / 100})`;
    };

    paint();
    const started = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const progress = Math.min(91, Math.floor((elapsed / duration) * 92));
      value = Math.max(value, progress);
      paint();
    }, 45);

    const posterReady = new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = projects[0].poster;
      if (image.complete) resolve();
    });

    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const minimum = new Promise((resolve) => window.setTimeout(resolve, duration));
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 4600));

    Promise.race([Promise.all([posterReady, fontsReady, minimum]), timeout]).then(() => {
      window.clearInterval(interval);
      value = 100;
      paint();
      window.setTimeout(() => {
        loader.classList.add("is-done");
        document.body.classList.add("is-ready");
        state.loaderDone = true;
        if (state.route.name === "home" && !reduceMotion) startStageVideo();
        window.setTimeout(() => {
          loader.hidden = true;
          loader.setAttribute("aria-hidden", "true");
        }, reduceMotion ? 300 : 1100);
      }, reduceMotion ? 80 : 340);
    });
  }

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */

  function init() {
    cacheRefs();
    bindProfile();
    buildAbout();
    buildContact();
    initHome();
    buildWorks();
    initCursor();

    refs.contactClose.addEventListener("click", closeContact);
    refs.contactHome.addEventListener("click", navigateHome);
    refs.copyEmail.addEventListener("click", copyEmailAddress);
    $$("[data-go-home]").forEach((button) => button.addEventListener("click", navigateHome));

    window.addEventListener("hashchange", () => applyRoute(parseRoute()));
    window.addEventListener("keydown", handleGlobalKeys);
    window.addEventListener("keydown", trapContactFocus);
    window.addEventListener("resize", hideWorksPreview);

    applyRoute(parseRoute(), { initial: true });
    startLoader();

    // Quietly warm the remaining posters once the page is idle.
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1200));
    idle(() => {
      projects.slice(1).forEach((project) => {
        const image = new Image();
        image.decoding = "async";
        image.src = project.poster;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
