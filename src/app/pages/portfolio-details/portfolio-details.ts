import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina portfolio-details.html del template original. */
@Component({
  selector: 'app-portfolio-details',
  imports: [RouterLink],
  templateUrl: './portfolio-details.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioDetails {}
