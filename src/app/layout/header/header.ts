import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Cabecera fija del sitio. Reemplaza la clase `active` que el template
 * original escribia a mano en cada pagina por `routerLinkActive`, y reproduce
 * el comportamiento del menu movil de assets/js/main.js: al abrirlo se agrega
 * la clase `mobile-nav-active` al body y el icono cambia de lista a equis.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly document = inject(DOCUMENT);

  protected readonly mobileNavActive = signal(false);

  protected toggleMobileNav(): void {
    this.setMobileNav(!this.mobileNavActive());
  }

  /** Al navegar desde el menu movil, este se cierra (igual que en el original). */
  protected closeMobileNav(): void {
    if (this.mobileNavActive()) {
      this.setMobileNav(false);
    }
  }

  private setMobileNav(active: boolean): void {
    this.mobileNavActive.set(active);
    this.document.body.classList.toggle('mobile-nav-active', active);
  }
}
