import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxPaginationModule } from 'ngx-pagination';

import SlimSelect from 'slim-select'


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  showTr:boolean=false
  error: any;
  user: any;
  userList: any = []
  List = []
  p: number = 1;
  filter = ''
  isDetails = true
  Registered:string
  planList:any=[]
  constructor(private commonService: CommonService) {

  }

  ngOnInit(): void {
    this.getUSerlist()
    this.getSubscriptionPlanList()
    new SlimSelect({
      select: '#user-toggle',
      showSearch: false,
    })

  }
  onUserDetails = () => {
    this.isDetails = !this.isDetails
  }
  onChange(filter) {
    console.log('clicked',filter)
    this.userList = []
    this.filter = filter
    this.List.map((item, index) => {
      if (item.subscriptionHistory[0].subscriptionId.planName === this.filter) {
        this.userList.push(item)
      }
      if (this.filter === 'All users') {
        this.userList = this.List
      }
    })
  }
  getSubscriptionPlanList() {
    this.commonService.get('getSubscriptionPlan').subscribe((data: any) => {
      if (data.status == 200) {
        this.planList = data.result
      } else {
        alert(data.message)
      }
    })
  }
  getUSerlist() {
    this.commonService.get('getUserlist').subscribe((data: any) => {
      if (data.status == 200) {
        this.userList = data.result
        this.Registered =data.result.length
        this.List = data.result
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  changeDetails(){
    this.isDetails = !this.isDetails
    this.showTr=true
  }

  hideTr(){
    this.showTr=false
  }

  deleteUser(id) {
    alert(id)
    this.commonService.delete('deleteUser', id).subscribe((data: any) => {
      if (data.status == 200) {
        alert(data.message)
        this.getUSerlist()
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
}
