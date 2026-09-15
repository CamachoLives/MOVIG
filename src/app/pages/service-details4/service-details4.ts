import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina service-details4.html del template original. */
@Component({
  selector: 'app-service-details4',
  imports: [RouterLink],
  templateUrl: './service-details4.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetails4 {}
