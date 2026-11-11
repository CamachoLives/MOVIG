import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AddToCart } from '../../shared/add-to-cart/add-to-cart';

/** Pagina portfolio.html del template original. */
@Component({
  selector: 'app-portfolio',
  imports: [RouterLink, AddToCart],
  templateUrl: './portfolio.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {}
