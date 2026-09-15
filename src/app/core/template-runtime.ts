import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Port a TypeScript de assets/js/main.js (template "Moderna").
 *
 * El script original corria una sola vez, en el evento `load` de cada pagina.
 * Como ahora el sitio es una SPA, la inicializacion de los plugins se separa
 * en dos partes:
 *
 *  - `startGlobalListeners()`: listeners que viven mientras dure la app
 *    (clase `.scrolled` del body, boton de "volver arriba", preloader).
 *  - `refresh()`: re-inicializa los plugins que dependen del DOM de la pagina
 *    (AOS, GLightbox, PureCounter, Swiper, carruseles, Isotope, Waypoints)
 *    despues de cada navegacion.
 */
@Injectable({ providedIn: 'root' })
export class TemplateRuntime {
  private readonly document = inject(DOCUMENT);

  private lightbox: { destroy(): void } | null = null;
  private swipers: Swiper[] = [];
  private isotopes: Isotope[] = [];
  private waypoints: Waypoint[] = [];
  private globalListenersStarted = false;

  /** Listeners que solo deben registrarse una vez por sesion. */
  startGlobalListeners(): void {
    if (this.globalListenersStarted) {
      return;
    }
    this.globalListenersStarted = true;

    const onScroll = () => {
      this.toggleScrolled();
      this.toggleScrollTop();
    };

    this.document.addEventListener('scroll', onScroll);
    onScroll();

    this.removePreloader();
  }

  /** Aplica la clase `.scrolled` al body al bajar mas de 100px. */
  private toggleScrolled(): void {
    const body = this.document.querySelector('body');
    const header = this.document.querySelector('#header');
    if (!body || !header) {
      return;
    }
    const isSticky =
      header.classList.contains('scroll-up-sticky') ||
      header.classList.contains('sticky-top') ||
      header.classList.contains('fixed-top');
    if (!isSticky) {
      return;
    }
    if (window.scrollY > 100) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }
  }

  /** Muestra u oculta el boton de "volver arriba". */
  private toggleScrollTop(): void {
    const scrollTop = this.document.querySelector('.scroll-top');
    if (!scrollTop) {
      return;
    }
    if (window.scrollY > 100) {
      scrollTop.classList.add('active');
    } else {
      scrollTop.classList.remove('active');
    }
  }

  private removePreloader(): void {
    const preloader = this.document.querySelector('#preloader');
    preloader?.remove();
  }

  /** Re-inicializa todos los plugins de la pagina que se acaba de renderizar. */
  refresh(): void {
    this.teardown();
    this.initAos();
    this.buildCarouselIndicators();
    this.initCarousels();
    this.initLightbox();
    this.initCounters();
    this.initSwipers();
    this.initSkillsAnimation();
    this.initIsotope();
    this.bindEmailForms();
  }

  /** Libera las instancias creadas por la pagina anterior. */
  private teardown(): void {
    this.lightbox?.destroy();
    this.lightbox = null;

    for (const swiper of this.swipers) {
      swiper.destroy(true, true);
    }
    this.swipers = [];

    for (const isotope of this.isotopes) {
      isotope.destroy();
    }
    this.isotopes = [];

    for (const waypoint of this.waypoints) {
      waypoint.destroy();
    }
    this.waypoints = [];
  }

  private initAos(): void {
    if (typeof AOS === 'undefined') {
      return;
    }
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }

  /** Genera los indicadores de los carruseles de Bootstrap. */
  private buildCarouselIndicators(): void {
    this.document.querySelectorAll('.carousel-indicators').forEach((indicator) => {
      const carousel = indicator.closest('.carousel');
      if (!carousel || indicator.childElementCount > 0) {
        return;
      }
      carousel.querySelectorAll('.carousel-item').forEach((_item, index) => {
        const active = index === 0 ? ' class="active"' : '';
        indicator.innerHTML +=
          '<li data-bs-target="#' +
          carousel.id +
          '" data-bs-slide-to="' +
          index +
          '"' +
          active +
          '></li>';
      });
    });
  }

  /**
   * Bootstrap solo auto-inicializa los carruseles con `data-bs-ride` en el
   * DOMContentLoaded. Como Angular pinta despues, hay que instanciarlos a mano.
   */
  private initCarousels(): void {
    if (typeof bootstrap === 'undefined') {
      return;
    }
    this.document.querySelectorAll('[data-bs-ride="carousel"]').forEach((element) => {
      bootstrap.Carousel.getOrCreateInstance(element);
    });
  }

  private initLightbox(): void {
    if (typeof GLightbox === 'undefined') {
      return;
    }
    this.lightbox = GLightbox({ selector: '.glightbox' });
  }

  private initCounters(): void {
    if (typeof PureCounter === 'undefined') {
      return;
    }
    new PureCounter();
  }

  /**
   * Cada `.init-swiper` lleva su configuracion en JSON dentro de un
   * `.swiper-config`. En el HTML original era un `<script type="application/json">`;
   * en las plantillas de Angular es un `<div class="swiper-config">` oculto,
   * porque el compilador de Angular elimina las etiquetas `<script>`.
   */
  private initSwipers(): void {
    if (typeof Swiper === 'undefined') {
      return;
    }
    this.document.querySelectorAll('.init-swiper').forEach((element) => {
      const configElement = element.querySelector('.swiper-config');
      const rawConfig = configElement?.textContent?.trim();
      if (!rawConfig) {
        return;
      }
      try {
        const config = JSON.parse(rawConfig) as Record<string, unknown>;
        this.swipers.push(new Swiper(element, config));
      } catch {
        // Configuracion invalida: se ignora el slider en lugar de romper la pagina.
      }
    });
  }

  private initSkillsAnimation(): void {
    if (typeof Waypoint === 'undefined') {
      return;
    }
    this.document.querySelectorAll('.skills-animation').forEach((item) => {
      this.waypoints.push(
        new Waypoint({
          element: item,
          offset: '80%',
          handler: () => {
            item.querySelectorAll<HTMLElement>('.progress .progress-bar').forEach((bar) => {
              bar.style.width = bar.getAttribute('aria-valuenow') + '%';
            });
          },
        }),
      );
    });
  }

  /**
   * Port de assets/vendor/php-email-form/validate.js. El vendor engancha los
   * formularios una sola vez al cargar la pagina, asi que no alcanza a los que
   * Angular pinta despues; sin esto el formulario haria un POST clasico y se
   * saldria del sitio.
   */
  private bindEmailForms(): void {
    this.document.querySelectorAll<HTMLFormElement>('.php-email-form').forEach((form) => {
      if (form.dataset['bound'] === 'true') {
        return;
      }
      form.dataset['bound'] = 'true';
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        void this.submitEmailForm(form);
      });
    });
  }

  private async submitEmailForm(form: HTMLFormElement): Promise<void> {
    const action = form.getAttribute('action');
    if (!action) {
      this.displayFormError(form, 'The form action property is not set!');
      return;
    }

    form.querySelector('.loading')?.classList.add('d-block');
    form.querySelector('.error-message')?.classList.remove('d-block');
    form.querySelector('.sent-message')?.classList.remove('d-block');

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText + ' ' + response.url);
      }
      const data = (await response.text()).trim();
      form.querySelector('.loading')?.classList.remove('d-block');
      if (data !== 'OK') {
        throw new Error(data || 'Form submission failed and no error message returned from: ' + action);
      }
      form.querySelector('.sent-message')?.classList.add('d-block');
      form.reset();
    } catch (error) {
      this.displayFormError(form, error instanceof Error ? error.message : String(error));
    }
  }

  private displayFormError(form: HTMLFormElement, message: string): void {
    form.querySelector('.loading')?.classList.remove('d-block');
    const errorMessage = form.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.add('d-block');
    }
  }

  private initIsotope(): void {
    if (typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') {
      return;
    }
    this.document.querySelectorAll('.isotope-layout').forEach((isotopeItem) => {
      const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
      const container = isotopeItem.querySelector('.isotope-container');
      if (!container) {
        return;
      }

      let instance: Isotope | undefined;
      imagesLoaded(container, () => {
        instance = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        });
        this.isotopes.push(instance);
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach((filterItem) => {
        filterItem.addEventListener('click', () => {
          isotopeItem
            .querySelector('.isotope-filters .filter-active')
            ?.classList.remove('filter-active');
          filterItem.classList.add('filter-active');
          instance?.arrange({ filter: filterItem.getAttribute('data-filter') });
          this.initAos();
        });
      });
    });
  }
}
