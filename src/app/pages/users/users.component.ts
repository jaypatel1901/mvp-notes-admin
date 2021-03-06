import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import SlimSelect from 'slim-select'
// import * as Swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  showTr: boolean = false
  error: any;
  user: any;
  userList: any = []
  List = []
  p: number = 1;
  filter = ''
  userId = ''
  isDetails = true
  Registered: string
  planList: any = []
  userDetails: any={
    userName: '',
    email: ''
  }
  userSubHistory:any=[]
  invitationFormError = {
    "firstName": '',
    "lastName": '',
    "email": '',
    "subscriptionsId": ''
  }
  invitationForm: FormGroup

  constructor(private commonService: CommonService, private fb: FormBuilder, private spinner: NgxSpinnerService,private router: Router) {

  }

  ngOnInit(): void {
    this.createInvitation()
    this.getUSerlist()
    new SlimSelect({
      select: '#user-toggle',
      showSearch: false,
    })
    new SlimSelect({
      select: '#modal-subscription1',
      showSearch: false,
    })

  }
  onUserDetails = () => {
    this.isDetails = !this.isDetails
  }
  onChange(event) {
    this.userList = []
    this.filter = event.target.value
    this.List.map((item, index) => {
      if (item.planName === this.filter) {
        this.userList.push(item)
      }
      if (this.filter === 'All users') {
        this.userList = this.List
      }
    })
  }
  // 
  inviationvalidationMessages = {
    'firstName': {
      'required': 'First Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'lastName': {
      'required': 'Last Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'email': {
      'required': 'email is required',
      'pattern': 'email not in valid format'
    },
    'subscriptionId': {
      'required': 'subscription Plan is required',
    }
  }
  createInvitation() {

    this.invitationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      subscriptionId: ['', [Validators.required]]
    })
    this.invitationForm.valueChanges.subscribe(data => this.onValueChanges(data))
  }
  onValueChanges(data?: any) {
    if (!this.invitationForm)
      return
    const form = this.invitationForm;
    for (const field in this.invitationFormError) {
      if (this.invitationFormError.hasOwnProperty(field)) {
        this.invitationFormError[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.inviationvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.invitationFormError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSendInvitation() {
    this.spinner.show();
    let userData = {
      firstName: this.invitationForm.value.firstName,
      lastName: this.invitationForm.value.lastName,
      email: this.invitationForm.value.email,
      subscriptionId: this.invitationForm.value.subscriptionId
    }
    console.log("onSendInvitation", userData)
    this.commonService.post('invatationUser', userData).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        document.getElementById("myModal").click();
        // alert("Invitation sent successfully!")
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Invitation sent Successfully!',
          showConfirmButton: false,
          timer: 2500
        })

      } else {
        this.spinner.hide();
        document.getElementById("myModal").click();
        // alert(data.message)
        Swal.fire("Server Error");

      }
    })
  }
  // 

  getSubscriptionPlanList() {
    this.commonService.get('getSubscriptionPlan').subscribe((data: any) => {
      if (data.status == 200) {
        this.planList = data.result
      } else {
        this.spinner.hide();
        alert(data.message)
      }
    })
  }

  getUSerlist() {
    this.spinner.show();
    this.commonService.get('getUserlist').subscribe((data: any) => {
      if (data.status == 200) {
        console.log("user list",data.result)
        this.userList = data.result
        this.Registered = data.result.length
        this.List = data.result
        this.spinner.hide();
      } else {
        this.error = data.message
        alert(this.error)
      }
      this.getSubscriptionPlanList()
    })
    // 
  }
  getUserSubHistory(id) {
    
    this.userId = id
    this.spinner.show();
    this.commonService.get(`getUser-AllSubhistory/${id}`).subscribe((data: any) => {
      if (data.status == 200) {
        this.userDetails.userName = data.data[0].firstName + ' ' + data.data[0].lastName
        this.userDetails.email = data.data[0].email
        this.userSubHistory = data.data[0].subscriptionHistory
        this.spinner.hide();
      } else {
        this.error = data.message
        alert(this.error)
        this.spinner.hide();

      }
    })
  }
  changeDetails() {
    this.isDetails = !this.isDetails
    this.showTr = true
  }

  getUserId(id) {
    this.userId = id
  }
  deleteUser(id) {
    console.log("userid",id)
    this.userId = id
    document.getElementById("ondelete").click();
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this User !",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.deleteUsers()
        } else {
          // Swal.fire("Fail");
        }
        console.log(willDelete)
      });
  }
  deleteUsers() {
    this.spinner.show();
    this.commonService.delete('deleteUser', this.userId).subscribe((data: any) => {
      if (data.status === 200) {
        this.getUSerlist()
        this.spinner.hide();
        // Swal.fire('Deleted!',
        //   'Your file has been deleted.',
        //   'success');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'This user has been Deleted',
            showConfirmButton: false,
            timer: 2500
          })
          
      } else {
        this.spinner.hide();
        this.error = data.message
        Swal.fire("Fail!");

      }
    })
  }
  blockUser(id) {
    this.userId = id

    // document.getElementById("ondelete").click();
    var key = 1
    Swal.fire({
      title: "Are you sure?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, Block it!'
    })
      .then(async (willDelete) => {
        if (willDelete.value) {
          await this.BlockUsers(key)
        } else {
          // Swal.fire("Fail");
        }
        console.log(willDelete)
      });
  }
  unblockUser(id) {
    // document.getElementById("onBlock").click();
    this.userId = id

    var key = 0
    Swal.fire({
      title: "Are you sure?",
      // text: "Once deleted, you will not be able to recover this imaginary file!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, Unblock it!'
    })
      .then(async (willDelete) => {
        if (willDelete.value) {
          await this.BlockUsers(key)
          //  Swal.fire("Success");
        } else {
          // Swal.fire("Fail");
        }
        console.log(willDelete)
      });
  }
  BlockUsers(key) {
    this.spinner.show();
    let obj: any = {
      "isStatus": key,
      "blockBy": "admin",
      "userId": this.userId
    }
    this.commonService.post('blockUser', obj).subscribe((data: any) => {
      if (data.status == 200) {
        this.getUSerlist()
        this.spinner.hide();
        if (data.data.isStatus === 1) {
          // Swal.fire('Blocked!',
          //   'Your user has been Blocked.',
          //   'success');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'This user has been Blocked',
            showConfirmButton: false,
            timer: 2500
          })
        }
        if (data.data.isStatus === 0) {
          // Swal.fire('Unblocke!',
          //   'Your user has been Unblock.',
          //   'success');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'This user has been Unblock.',
            showConfirmButton: false,
            timer: 2500
          })
          
        }
      } else {
        this.spinner.hide();
        this.error = data.message
        Swal.fire("Error");

      }
    })
  }
  notDelete = () => {
    document.getElementById("ondelete").click();
  }
  logout() {

    Swal.fire({
      title: "Are you sure?",
      // text: "Once deleted, you will not be able to recover this imaginary file!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes,Logout it!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          localStorage.removeItem("adminToken");
          this.router.navigate(['login'])
        }
        else {
          // Swal.fire("Fail");
        }
        console.log(willDelete)
      });
  }
}
