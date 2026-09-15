import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Pie de pagina del sitio, identico en todas las paginas del template
 * original. Incluye el boton de WhatsApp que antes vivia en
 * assets/js/Whatsapp.js.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly whatsappNumber = '573212215159';
  private readonly whatsappMessage = 'Hola, quiero más información sobre sus servicios.';

  protected openWhatsapp(): void {
    const url =
      'https://wa.me/' +
      this.whatsappNumber +
      '?text=' +
      encodeURIComponent(this.whatsappMessage);
    window.open(url, '_blank');
  }
}
