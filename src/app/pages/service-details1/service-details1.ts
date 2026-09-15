import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina service-details1.html del template original. */
@Component({
  selector: 'app-service-details1',
  imports: [RouterLink],
  templateUrl: './service-details1.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetails1 {}
