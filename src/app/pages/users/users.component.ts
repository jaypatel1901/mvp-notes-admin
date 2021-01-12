import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
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
  userId=''
  isDetails = true
  Registered:string
  planList:any=[]
  invitationFormError = {
    "firstName": '',
    "lastName":'',
    "email": '',
    "subscriptionsId": ''
  }
  invitationForm: FormGroup

  constructor(private commonService: CommonService,private fb: FormBuilder,private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.createInvitation()
    this.getUSerlist()
    new SlimSelect({
      select: '#user-toggle',
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
  alert("hello")
  this.spinner.show();
  let userData = {
    firstName: this.invitationForm.value.firstName,
    lastName: this.invitationForm.value.lastName,
    email: this.invitationForm.value.email,
    subscriptionId: this.invitationForm.value.subscriptionId
  }
  console.log("onSendInvitation", userData)
  this.commonService.post('invatationUser',userData).subscribe((data: any) => {
    if (data.status == 200) {
      this.spinner.hide(); 
      document.getElementById("myModal").click();
      alert("Invitation sent successfully!")
    } else {
      this.spinner.hide();
      document.getElementById("myModal").click();
      alert(data.message)
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
        this.userList = data.result
        this.Registered =data.result.length
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
  changeDetails(){
    this.isDetails = !this.isDetails
    this.showTr=true
  }


  deleteUser(id) {
    // alert(id)
   this.userId=id
  }
  deleteUsers(){
    this.spinner.show();
    this.commonService.delete('deleteUser', this.userId).subscribe((data: any) => {
      if (data.status == 200) {
        alert(data.message)
        this.getUSerlist()
        document.getElementById("ondelete").click();
        document.getElementById("ondelete-model").click();
        this.spinner.hide();
      } else {
        document.getElementById("ondelete").click();
        document.getElementById("ondelete-model").click();
        this.spinner.hide();
        this.error = data.message
        alert(this.error)
      }
    })
  }
  BlockUsers(){
    this.spinner.show();
    let obj:any ={
      "isStatus":"1",
      "blockBy":"admin",
      "userId":this.userId
    }
    this.commonService.post('blockUser', obj).subscribe((data: any) => {
      if (data.status == 200) {
        alert(data.message)
        this.getUSerlist()
        document.getElementById("ondelete").click();
        document.getElementById("ondelete-model").click();
        document.getElementById("onblock-model").click();
        this.spinner.hide();
      } else {
        document.getElementById("ondelete").click();
        document.getElementById("ondelete-model").click();
        document.getElementById("onblock-model").click();
        this.spinner.hide();
        this.error = data.message
        alert(this.error)
      }
    })
  }
  notDelete=()=>{
    document.getElementById("ondelete").click();
    document.getElementById("ondelete-model").click();
    document.getElementById("onblock-model").click();
  }

}
