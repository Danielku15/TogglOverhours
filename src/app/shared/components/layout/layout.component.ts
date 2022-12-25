import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'to-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public constructor(private router: Router, public titleService: Title) {}

  isNavigationOpen: boolean = false;

  toggleNavigation() {
    this.isNavigationOpen = !this.isNavigationOpen;
  }
}
