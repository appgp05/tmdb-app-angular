import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorArrowBendUpLeftBold } from '@ng-icons/phosphor-icons/bold';
import { Router, RouterLink } from "@angular/router";
import { Location } from '@angular/common'

@Component({
  selector: 'app-return-component',
  imports: [NgIcon, RouterLink],
  templateUrl: './return-component.html',
  styleUrl: './return-component.css',
  viewProviders: [provideIcons({ phosphorArrowBendUpLeftBold })]
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
