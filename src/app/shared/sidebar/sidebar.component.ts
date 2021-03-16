import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  firstName: any;
  lastName: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getUser();
    this.activeButton()
  }
  getUser() {
    this.firstName = localStorage.getItem("firstName")
    this.lastName = localStorage.getItem("lastName")
    // alert(this.firstName)
  }
  activeButton() {
    let myMainSite = this.router.url
    var splitUrl = myMainSite.split('/');
    var id = splitUrl[1]
    // console.log("split id",id)
    if(id==""){
       id = "dashboard"
    }
    if(id=="view-Perfomance"){
      id ="subscription"
    }

    document.getElementById(id).classList.add("active")
  }
}
