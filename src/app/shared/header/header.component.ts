import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName:any;
  lastName:any;
  constructor() { }

  ngOnInit(): void {
    this.getUser();
  }
getUser(){
  this.firstName=localStorage.getItem("firstName")
  this.lastName=localStorage.getItem("lastName")
// alert(this.firstName)
}
}
