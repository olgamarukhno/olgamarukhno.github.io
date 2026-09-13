const menu = document.querySelector("[data-mobile-menu]");
const toggle = document.querySelector("[data-menu-toggle]");
const closeButton = document.querySelector("[data-menu-close]");
const menuLinks = document.querySelectorAll("[data-menu-link]");
const header = document.querySelector("[data-header]");

function openMenu() {
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

toggle.addEventListener("click", () => {
  menu.classList.contains("is-open") ? closeMenu() : openMenu();
});

closeButton.addEventListener("click", closeMenu);
menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateHeaderOnScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

const aboutRevealItems = document.querySelectorAll("[data-about-reveal]");

const aboutRevealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

aboutRevealItems.forEach((item) => {
  aboutRevealObserver.observe(item);
});

const elegantStats = document.querySelector(".stats-elegant");
const elegantItems = document.querySelectorAll(".stats-elegant__item");
const elegantCounters = document.querySelectorAll(
  ".stats-elegant [data-count]",
);

let elegantStatsStarted = false;

function runElegantCounter(element) {
  const target = Number(element.dataset.count);
  const duration = 1700;
  const start = performance.now();

  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);

    element.textContent = Math.floor(target * eased).toLocaleString("uk-UA");

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString("uk-UA");
    }
  }

  requestAnimationFrame(update);
}

const elegantStatsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || elegantStatsStarted) return;

      elegantStatsStarted = true;

      elegantItems.forEach((item) => {
        item.classList.add("is-visible");
      });

      elegantCounters.forEach((counter) => {
        runElegantCounter(counter);
      });

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.25,
  },
);

if (elegantStats) {
  elegantStatsObserver.observe(elegantStats);
}

const areasSlider = document.querySelector(".areas-slider");

if (areasSlider) {
  const track = areasSlider.querySelector("[data-areas-track]");
  const cards = [...areasSlider.querySelectorAll(".areas-card")];
  const prevButtons = areasSlider.querySelectorAll("[data-areas-prev]");
  const nextButtons = areasSlider.querySelectorAll("[data-areas-next]");
  const currentCounter = areasSlider.querySelector("[data-areas-current]");
  const progress = areasSlider.querySelector("[data-areas-progress]");

  let currentIndex = 0;

  function getVisibleCards() {
    return window.innerWidth <= 760 ? 1 : 2;
  }

  function getMaxIndex() {
    return cards.length - getVisibleCards();
  }

  function updateAreasSlider() {
    const visibleCards = getVisibleCards();
    const gap = window.innerWidth <= 760 ? 0 : 24;
    const viewportWidth = track.parentElement.clientWidth;

    const cardWidth =
      visibleCards === 1 ? viewportWidth : (viewportWidth - gap) / visibleCards;

    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    if (currentCounter) {
      currentCounter.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    if (progress) {
      const progressStep = 100 / cards.length;
      progress.style.width = `${progressStep}%`;
      progress.style.transform = `translateX(${currentIndex * 100}%)`;
    }

    prevButtons.forEach((button) => {
      button.disabled = currentIndex === 0;
    });

    nextButtons.forEach((button) => {
      button.disabled = currentIndex >= getMaxIndex();
    });
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex += 1;
        updateAreasSlider();
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateAreasSlider();
      }
    });
  });

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].clientX;

      const distance = touchStartX - touchEndX;

      if (Math.abs(distance) < 45) return;

      if (distance > 0 && currentIndex < getMaxIndex()) {
        currentIndex += 1;
      }

      if (distance < 0 && currentIndex > 0) {
        currentIndex -= 1;
      }

      updateAreasSlider();
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updateAreasSlider();
  });

  updateAreasSlider();
}

const methodItems = document.querySelectorAll(".methods-item");

methodItems.forEach((item) => {
  const button = item.querySelector(".methods-item__head");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    methodItems.forEach((otherItem) => {
      otherItem.classList.remove("is-open");

      const otherButton = otherItem.querySelector(".methods-item__head");
      otherButton.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const servicesSlider = document.querySelector(".services-slider");

if (servicesSlider) {
  const track = servicesSlider.querySelector("[data-services-track]");
  const cards = [...servicesSlider.querySelectorAll(".service-card")];
  const prevButtons = servicesSlider.querySelectorAll("[data-services-prev]");
  const nextButtons = servicesSlider.querySelectorAll("[data-services-next]");
  const currentCounter = servicesSlider.querySelector(
    "[data-services-current]",
  );
  const progress = servicesSlider.querySelector("[data-services-progress]");

  let currentIndex = 0;

  function getServicesVisibleCards() {
    return window.innerWidth <= 760 ? 1 : 2;
  }

  function getServicesMaxIndex() {
    return cards.length - getServicesVisibleCards();
  }

  function updateServicesSlider() {
    const visibleCards = getServicesVisibleCards();
    const gap = window.innerWidth <= 760 ? 0 : 24;
    const viewportWidth = track.parentElement.clientWidth;

    const cardWidth =
      visibleCards === 1 ? viewportWidth : (viewportWidth - gap) / visibleCards;

    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    if (currentCounter) {
      currentCounter.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    if (progress) {
      const progressStep = 100 / cards.length;
      progress.style.width = `${progressStep}%`;
      progress.style.transform = `translateX(${currentIndex * 100}%)`;
    }

    prevButtons.forEach((button) => {
      button.disabled = currentIndex === 0;
    });

    nextButtons.forEach((button) => {
      button.disabled = currentIndex >= getServicesMaxIndex();
    });
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentIndex < getServicesMaxIndex()) {
        currentIndex += 1;
        updateServicesSlider();
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateServicesSlider();
      }
    });
  });

  let touchStartX = 0;

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchStartX - touchEndX;

      if (Math.abs(distance) < 45) return;

      if (distance > 0 && currentIndex < getServicesMaxIndex()) {
        currentIndex += 1;
      }

      if (distance < 0 && currentIndex > 0) {
        currentIndex -= 1;
      }

      updateServicesSlider();
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    currentIndex = Math.min(currentIndex, getServicesMaxIndex());
    updateServicesSlider();
  });

  updateServicesSlider();
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-item__head");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("is-open");

      const otherButton = otherItem.querySelector(".faq-item__head");
      otherButton.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});
