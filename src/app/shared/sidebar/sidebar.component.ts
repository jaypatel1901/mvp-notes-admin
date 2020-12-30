import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
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
