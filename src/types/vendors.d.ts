/**
 * Declaraciones de los plugins del template "Moderna" que se cargan como
 * scripts globales desde src/index.html (assets/vendor/...). No son paquetes
 * de npm, por eso se describen aqui de forma minima.
 */

declare const AOS: {
  init(options?: Record<string, unknown>): void;
  refresh(): void;
  refreshHard(): void;
};

declare function GLightbox(options?: Record<string, unknown>): {
  destroy(): void;
  reload(): void;
};

declare class PureCounter {
  constructor(options?: Record<string, unknown>);
}

declare class Swiper {
  constructor(element: Element | string, options?: Record<string, unknown>);
  destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
}

declare class Isotope {
  constructor(element: Element, options?: Record<string, unknown>);
  arrange(options: Record<string, unknown>): void;
  destroy(): void;
}

declare class Waypoint {
  constructor(options: Record<string, unknown>);
  destroy(): void;
}

declare function imagesLoaded(element: Element | null, callback: () => void): void;

declare namespace bootstrap {
  class Carousel {
    static getOrCreateInstance(element: Element, options?: Record<string, unknown>): Carousel;
    static getInstance(element: Element): Carousel | null;
    dispose(): void;
  }
}
