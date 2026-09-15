import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AddToCart } from '../../shared/add-to-cart/add-to-cart';

/** Pagina services.html del template original. */
@Component({
  selector: 'app-services',
  imports: [RouterLink, AddToCart],
  templateUrl: './services.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {}
