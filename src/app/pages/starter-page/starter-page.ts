import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pagina starter-page.html del template original. */
@Component({
  selector: 'app-starter-page',
  imports: [RouterLink],
  templateUrl: './starter-page.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterPage {}
