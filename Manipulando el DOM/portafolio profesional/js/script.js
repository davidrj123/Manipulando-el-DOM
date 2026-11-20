document.addEventListener("DOMContentLoaded", () => {
    // Identifica el apartado activo del menú.
    const currentPage = location.pathname.split("/").pop() || "index.html";
    const navigationLinks = document.querySelectorAll(".nav-link");

    navigationLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // Aparición progresiva de los elementos al entrar en pantalla.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("in-view"));
    }

    // Botón para volver al inicio de la página.
    const topButton = document.getElementById("backToTop");

    if (topButton) {
        window.addEventListener("scroll", () => {
            topButton.classList.toggle("visible", window.scrollY > 450);
        }, { passive: true });

        topButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth"
            });
        });
    }

    // Alterna el tema y conserva la preferencia durante la sesión.
    const themeButton = document.querySelector(".theme-toggle");
    const savedTheme = sessionStorage.getItem("lva-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    if (themeButton) {
        const themeIcon = themeButton.querySelector("i");

        const updateThemeIcon = () => {
            if (!themeIcon) return;

            themeIcon.className = document.body.classList.contains("dark-mode")
                ? "bi bi-sun"
                : "bi bi-moon-stars";
        };

        updateThemeIcon();

        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const selectedTheme = document.body.classList.contains("dark-mode")
                ? "dark"
                : "light";

            sessionStorage.setItem("lva-theme", selectedTheme);
            updateThemeIcon();
        });
    }

    // Anima los contadores cuando se hacen visibles.
    document.querySelectorAll(".counter").forEach((counter) => {
        const targetValue = Number(counter.dataset.count);

        if (!Number.isFinite(targetValue)) return;

        const animateCounter = () => {
            const duration = 900;
            let startTime = null;

            const updateCounter = (currentTime) => {
                if (startTime === null) startTime = currentTime;

                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                const currentValue = Math.floor(targetValue * progress);
                counter.textContent = currentValue.toLocaleString("es");

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = targetValue.toLocaleString("es");
                }
            };

            requestAnimationFrame(updateCounter);
        };

        if ("IntersectionObserver" in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounter();
                    counterObserver.disconnect();
                }
            }, { threshold: 0.6 });

            counterObserver.observe(counter);
        } else {
            animateCounter();
        }
    });

    // Filtra la línea de tiempo por categoría.
    const filterButtons = document.querySelectorAll("[data-filter]");
    const timelineItems = document.querySelectorAll(".timeline-item");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            const selectedFilter = button.dataset.filter;

            timelineItems.forEach((item) => {
                const matchesFilter = selectedFilter === "all" ||
                    item.dataset.category === selectedFilter;

                item.hidden = !matchesFilter;
            });
        });
    });

    // Validación del formulario de contacto en el navegador.
    // El formulario no envía información a un servidor.
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            contactForm.classList.add("was-validated");

            const feedback = document.getElementById("formFeedback");

            if (contactForm.checkValidity()) {
                feedback.textContent = "Los campos se han validado correctamente.";
                contactForm.reset();
                contactForm.classList.remove("was-validated");
            } else {
                feedback.textContent = "Revisa los campos marcados antes de continuar.";
            }
        });
    }
});
