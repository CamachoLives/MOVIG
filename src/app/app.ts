import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { TemplateRuntime } from './core/template-runtime';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';

/**
 * Armazon del sitio: cabecera fija, contenido de la ruta activa, pie de pagina
 * y boton de "volver arriba", tal como estaban en cada HTML del template.
 *
 * Ademas, en cada navegacion:
 *  - Cambia la clase del body (index-page, about-page, ...), que el CSS del
 *    template usa para variar estilos por pagina.
 *  - Vuelve a inicializar los plugins del template sobre el DOM recien pintado.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly runtime = inject(TemplateRuntime);

  private currentBodyClass = '';

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.onNavigated());
  }

  ngOnInit(): void {
    this.runtime.startGlobalListeners();
    this.onNavigated();
  }

  protected scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private onNavigated(): void {
    this.applyBodyClass();
    // Se espera a que Angular pinte la nueva pagina antes de tocar el DOM.
    afterNextRender(() => this.runtime.refresh(), { injector: this.injector });
  }

  /** Replica la clase que el template original ponia en <body>. */
  private applyBodyClass(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const bodyClass = (route.snapshot.data['bodyClass'] as string | undefined) ?? '';
    if (bodyClass === this.currentBodyClass) {
      return;
    }
    if (this.currentBodyClass) {
      this.document.body.classList.remove(this.currentBodyClass);
    }
    if (bodyClass) {
      this.document.body.classList.add(bodyClass);
    }
    this.currentBodyClass = bodyClass;
  }
}
