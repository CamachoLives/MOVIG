import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { Cart, CartCategory } from '../../core/cart';

/**
 * Boton para sumar un producto o servicio al carrito de cotizacion.
 *
 * Los datos del item llegan por inputs desde la plantilla de la pagina, en vez
 * de vivir en un catalogo aparte: asi el texto que ve el visitante y el que
 * viaja en el mensaje de WhatsApp salen del mismo sitio y no se pueden
 * desincronizar. El `itemId` si es fijo, para que lo guardado en localStorage
 * siga siendo valido aunque se reescriba el nombre.
 *
 * `variant` cambia la presentacion:
 *  - `icon`: solo el icono, para la capa que aparece al pasar el mouse sobre
 *    las tarjetas del portafolio.
 *  - `button`: boton con texto, para las tarjetas de la pagina de servicios.
 */
@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCart {
  private readonly cart = inject(Cart);

  readonly itemId = input.required<string>();
  readonly name = input.required<string>();
  readonly category = input.required<CartCategory>();
  readonly image = input('');
  readonly variant = input<'icon' | 'button'>('button');

  protected readonly quantity = computed(() => this.cart.quantityOf(this.itemId()));

  protected readonly label = computed(() => {
    const quantity = this.quantity();
    if (quantity === 0) {
      return 'Agregar a la cotización';
    }
    return 'Agregar otra unidad de ' + this.name() + ' (van ' + quantity + ')';
  });

  protected add(event: Event): void {
    // Las tarjetas del portafolio tienen un enlace que abre la galeria encima;
    // sin esto, agregar al carrito tambien abriria la imagen.
    event.preventDefault();
    event.stopPropagation();

    this.cart.add({
      id: this.itemId(),
      name: this.name(),
      category: this.category(),
      image: this.image(),
    });
  }
}
