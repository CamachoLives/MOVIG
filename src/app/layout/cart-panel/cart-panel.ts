import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Cart } from '../../core/cart';

/**
 * Boton flotante del carrito y el panel lateral con el detalle.
 *
 * Vive en el armazon de la app, no en las paginas, para que el carrito siga
 * visible mientras se navega entre camaras y servicios.
 */
@Component({
  selector: 'app-cart-panel',
  templateUrl: './cart-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class CartPanel {
  protected readonly cart = inject(Cart);
  protected readonly isOpen = signal(false);

  protected open(): void {
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  /**
   * Abre WhatsApp con el pedido y cierra el panel. El carrito no se vacia: si
   * la persona vuelve atras, encuentra su seleccion tal como la dejo.
   */
  protected sendToWhatsapp(): void {
    if (this.cart.isEmpty()) {
      return;
    }
    window.open(this.cart.whatsappUrl(), '_blank');
    this.close();
  }
}
