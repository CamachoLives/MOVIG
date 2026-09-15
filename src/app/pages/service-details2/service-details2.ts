import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina service-details2.html del template original. */
@Component({
  selector: 'app-service-details2',
  imports: [RouterLink],
  templateUrl: './service-details2.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetails2 {}
