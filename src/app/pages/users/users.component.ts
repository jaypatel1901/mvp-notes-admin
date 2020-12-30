import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  error: any;
  user: any;
  userList: any = []
  List = []
  p: number = 1;
  filter = ''
  isDetails = false
  Registered:string
  constructor(private commonService: CommonService) {

  }

  ngOnInit(): void {
    this.getUSerlist()
  }
  onUserDetails = () => {
    this.isDetails = !this.isDetails
  }
  onChange(event) {
    this.userList = []
    this.filter = event.target.value
    this.List.map((item, index) => {
      if (item.subscriptionHistory[0].subscriptionId.planName === this.filter) {
        this.userList.push(item)
      }
      if (this.filter === 'All users') {
        this.userList = this.List
      }
    })
  }
  getUSerlist() {
    this.commonService.get('getUserlist').subscribe((data: any) => {
      if (data.status == 200) {
        this.userList = data.result
        this.Registered =data.result.length
        this.List = data.result
        console.log("Registered",this.Registered)
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
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
