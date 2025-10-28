import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common'
import { phosphorArrowLeftBold } from '@ng-icons/phosphor-icons/bold';

@Component({
  selector: 'app-return-component',
  imports: [NgIcon],
  templateUrl: './return-component.html',
  styleUrl: './return-component.css',
  viewProviders: [provideIcons({ phosphorArrowLeftBold })]
})
export class ReturnComponent {
  pageName = input.required<string>()
  fallbackRoute = input<string>('/')

  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back()
    } else {
      this.router.navigate([this.fallbackRoute()])
    }
  }
}
