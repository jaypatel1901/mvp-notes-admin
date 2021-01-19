import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  template: `
  <router-outlet></router-outlet>
  `,
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    if(!localStorage.getItem('token'))
      this.router.navigate(['login'])
  }

}
