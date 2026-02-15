import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
declare function init_sidebar():any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  userSession:any;
  ngOnInit(): void {
    this.renderer.removeClass(document.body, 'nav-md');
    this.renderer.addClass(document.body, 'nav-sm');

    this.userSession = JSON.parse(<string>localStorage.getItem('userSession')).data;
    init_sidebar();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'nav-sm');
    this.renderer.addClass(document.body, 'nav-md');
  }

  constructor(private renderer: Renderer2) {}
}
