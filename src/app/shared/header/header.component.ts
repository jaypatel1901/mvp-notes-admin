import { Component, OnInit } from '@angular/core';

// 
// var data=

// 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName:any;
  lastName:any;
  // data:any=[
    
  //   {title:"Users Management",id:'users'},
  //   {title:"Subscription Management",id:'subscription'},
  //   {title:"Payment Management",id:'payment'},
  //   {title:"customer-support",id:'customer-support'}
  // ]
  constructor() { }

  ngOnInit(): void {
    this.getUser();
    // console.log("data",this.data);
  }
getUser(){
  this.firstName=localStorage.getItem("firstName")
  this.lastName=localStorage.getItem("lastName")
}


}
