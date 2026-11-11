import { Injectable, computed, signal } from '@angular/core';

/** Las dos familias de items que se pueden pedir desde el sitio. */
export type CartCategory = 'camara' | 'servicio';

export interface CartLine {
  /** Identificador estable: no cambia aunque se reescriba el nombre visible. */
  id: string;
  name: string;
  category: CartCategory;
  image: string;
  quantity: number;
}

const STORAGE_KEY = 'movig-carrito';

/** Mismo numero que usa el boton "Hablar por WhatsApp" del pie de pagina. */
const WHATSAPP_NUMBER = '573212215159';

const CATEGORY_LABELS: Record<CartCategory, string> = {
  camara: 'Cámaras',
  servicio: 'Servicios',
};

/**
 * Carrito de cotizacion. El sitio no maneja precios, asi que el carrito junta
 * lo que le interesa al visitante y arma un mensaje de WhatsApp con el pedido.
 *
 * El contenido se guarda en localStorage para que no se pierda al navegar
 * entre paginas ni al recargar.
 */
@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly lines = signal<CartLine[]>(this.restore());

  readonly items = this.lines.asReadonly();

  /** Total de unidades, para el globo del boton flotante. */
  readonly count = computed(() => this.lines().reduce((total, line) => total + line.quantity, 0));

  readonly isEmpty = computed(() => this.lines().length === 0);

  /** Items agrupados por categoria, en el orden en que se muestran. */
  readonly groups = computed(() => {
    const lines = this.lines();
    return (['camara', 'servicio'] as const)
      .map((category) => ({
        category,
        label: CATEGORY_LABELS[category],
        lines: lines.filter((line) => line.category === category),
      }))
      .filter((group) => group.lines.length > 0);
  });

  quantityOf(id: string): number {
    return this.lines().find((line) => line.id === id)?.quantity ?? 0;
  }

  add(item: Omit<CartLine, 'quantity'>): void {
    this.update((lines) => {
      const existing = lines.find((line) => line.id === item.id);
      if (existing) {
        return lines.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...lines, { ...item, quantity: 1 }];
    });
  }

  increment(id: string): void {
    this.update((lines) =>
      lines.map((line) => (line.id === id ? { ...line, quantity: line.quantity + 1 } : line)),
    );
  }

  /** Al bajar de 1 unidad, el item sale del carrito. */
  decrement(id: string): void {
    this.update((lines) =>
      lines
        .map((line) => (line.id === id ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  remove(id: string): void {
    this.update((lines) => lines.filter((line) => line.id !== id));
  }

  clear(): void {
    this.update(() => []);
  }

  /** Arma el enlace de WhatsApp con el detalle de lo seleccionado. */
  whatsappUrl(): string {
    const parts = ['Hola MOVIG, me interesa cotizar lo siguiente:', ''];

    for (const group of this.groups()) {
      parts.push('*' + group.label + '*');
      for (const line of group.lines) {
        parts.push('• ' + line.quantity + ' x ' + line.name);
      }
      parts.push('');
    }

    parts.push('Quedo atento a la cotización. ¡Gracias!');

    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(parts.join('\n'));
  }

  private update(change: (lines: CartLine[]) => CartLine[]): void {
    const next = change(this.lines());
    this.lines.set(next);
    this.persist(next);
  }

  private persist(lines: CartLine[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Modo incognito o almacenamiento bloqueado: el carrito sigue funcionando
      // en memoria, solo no sobrevive a la recarga.
    }
  }

  private restore(): CartLine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(isCartLine);
    } catch {
      return [];
    }
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const line = value as Partial<CartLine>;
  return (
    typeof line.id === 'string' &&
    typeof line.name === 'string' &&
    typeof line.image === 'string' &&
    (line.category === 'camara' || line.category === 'servicio') &&
    typeof line.quantity === 'number' &&
    line.quantity > 0
  );
}
