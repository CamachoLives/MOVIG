import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina service-details.html del template original. */
@Component({
  selector: 'app-service-details',
  imports: [RouterLink],
  templateUrl: './service-details.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetails {}
