import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina service-details3.html del template original. */
@Component({
  selector: 'app-service-details3',
  imports: [RouterLink],
  templateUrl: './service-details3.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetails3 {}
