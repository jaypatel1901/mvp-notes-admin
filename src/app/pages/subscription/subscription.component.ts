import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import SlimSelect from 'slim-select'
import { NgxSpinnerService } from "ngx-spinner";
import { NgxDateRangeModule } from 'ngx-daterange';
// import { Component,  } from "@angular/core";
// import { DaterangePickerComponent } from 'ng2-daterangepicker';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  plans: any;
  planDetail: any
  planName: string;
  planDuration: string;
  planPrice: string;
  subjectUsage: any = '';
  dataUsage: string = '';
  noteUsage: string = '';
  detailForm: FormGroup;
  planId: string;
  description: string
  subscriptionHistory: any;
  isSubscriptionHistory: any = []
  planList: any = []
  filter = 'All users'
  isSubHistory: any = []
  p: number = 1;
  p1: number = 1;
  SubscriptionHistoryList: any = []
  isSubscriptionHistoryList: any = []
  isStatus: boolean = false;
  searchKey = ''
  createPlanForm: FormGroup
  createPlanFormError = {
    "planName": '',
    "planPrice": '',
    "duration": '',
    "description": '',
    "dataUsage": '',
    "subjectUsage": "",
    "noteUsage": "",
  }
  UpdatePlanForm: FormGroup
  updatePlanFormError = {
    "planName": '',
    "planPrice": '',
    "duration": '',
    "description": '',
    "dataUsage": '',
    "subjectUsage": "",
    "noteUsage": "",
  }
  // 
  constructor(private commonService: CommonService, private fb: FormBuilder, private _router: Router, private spinner: NgxSpinnerService) {
    this.createPlans()
    this.updatePlans()
  }

  ngOnInit(): void {
    this.getPlans();
    this.allSubscriber()
    this.getSubscribers()
    this.getSubscriptionPlanList()
    this.getSubscriptionHistory()

    new SlimSelect({
      select: '#Subscription-filter',
      showSearch: false,
    })
    new SlimSelect({
      select: '#SubscriptionHistory-filter',
      showSearch: false,
    })
    new SlimSelect({
      select: '#plan-duration',
      showSearch: false,
    })
    new SlimSelect({
      select: '#Subject-Usage',
      showSearch: false,
    })
    new SlimSelect({
      select: '#Note-Usage',
      showSearch: false,
    })
    // update form
    // 
    new SlimSelect({
      select: '#plan-durationupdate',
      showSearch: false,
    })
    new SlimSelect({
      select: '#Subject-Usage-update',
      showSearch: false,
    })
    new SlimSelect({
      select: '#Note-Usage-update',
      showSearch: false,
    })
  }

  getPlans() {
    this.spinner.show();
    this.commonService.get(`getSubscriptionPlan`).subscribe((data: any) => {
      if (data.result.length > 0) {
        this.plans = data.result
        this.spinner.hide();

      } else {
        this.spinner.hide();

        this.plans = [];
      }
    })
  }
  // 

  editplan(id) {
    this.planId = id;
    let body = {
      plan_id: id
    }
    this.commonService.patch('getPlanDetails', body).subscribe((data: any) => {
      console.log(data)
      if (data.status == 200) {
        this.UpdatePlanForm.value.planName = data.data.planName ? data.data.planName : '';
        this.UpdatePlanForm.value.planPrice = data.data.planPrice;
        this.planDuration =data.data.planDuration ? data.data.planDuration : '';
        this.UpdatePlanForm.value.duration = data.data.planDuration ? data.data.planDuration : '';
        // this.UpdatePlanForm.value.subjectUsage = data.data.configration.subjectUsage ? data.data.configration.subjectUsage : '';
        this.UpdatePlanForm.value.dataUsage = data.data.configration.dataUsage ? data.data.configration.dataUsage : '';
        this.UpdatePlanForm.value.noteUsage = data.data.configration.dataUsage ? data.data.configration.noteUsage : ''
        this.UpdatePlanForm.value.description = data.data.description;
      } else {
        this.plans = '';
      }

    })
  }
  // 
  updatePlanvalidationMessages = {
    'planName': {
      'required': 'Plan Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'planPrice': {
      'required': 'Price is required',
      'pattern': 'Only Numbers are Allowed',
    },
    'duration': {
      'required': 'Duration is required',
    },
    'description': {
      'required': 'Description is required',
    },
    'dataUsage': {
      'required': 'Data Usage is required',
      'pattern': 'Only Numbers are Allowed',
    },
    'subjectUsage': {
      'required': 'Subject Usage is required',
    },
    'noteUsage': {
      'required': 'Notes Usage is required',
    }
  }
  updatePlans() {
    // alert("hello")
    this.UpdatePlanForm = this.fb.group({
      planName: ['', [Validators.required, Validators.minLength(3)]],
      planPrice: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      duration: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dataUsage: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      subjectUsage: ['', [Validators.required]],
      noteUsage: ['', [Validators.required]],
    })
    this.UpdatePlanForm.valueChanges.subscribe(data => this.onValueChangesUpdatePlan(data))
  }
  // 
  onValueChangesUpdatePlan(data?: any) {
    if (!this.UpdatePlanForm)
      return
    const form = this.UpdatePlanForm;
    for (const field in this.updatePlanFormError) {
      if (this.updatePlanFormError.hasOwnProperty(field)) {
        this.updatePlanFormError[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.updatePlanvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.updatePlanFormError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  // 


  update() {
    // alert("hello")
    this.spinner.show();
    let body = {
      subscriptionId: this.planId,
      planName: this.UpdatePlanForm.value.planName,
      planDuration: this.UpdatePlanForm.value.duration,
      planPrice: this.UpdatePlanForm.value.planPrice,
      subjectUsage: this.UpdatePlanForm.value.subjectUsage,
      dataUsage: this.UpdatePlanForm.value.dataUsage,
      noteUsage: this.UpdatePlanForm.value.noteUsage,
      description: this.UpdatePlanForm.value.description
    }
    console.log("update plan data", body)
    this.commonService.put('updateSubscription', body).subscribe((data: any) => {
      if (data.status == 200) {
        Swal.fire('Updated!',
        'Your file has been Updated.',
        'success');
        $('#EditPlan').modal('hide');
        this.getPlans()
        this.spinner.hide();
      } else {
        this.spinner.hide();
        Swal.fire('fail')
      }
    })

  }

  //
  createPlanvalidationMessages = {
    'planName': {
      'required': 'Plan Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'planPrice': {
      // 'required': 'Price is required',
      'pattern': 'Only Numbers are Allowed',
    },
    'duration': {
      'required': 'Duration is required',
      // 'pattern': 'email not in valid format'
    },
    'description': {
      'required': 'Description is required',
    },
    'dataUsage': {
      'required': 'Data Usage is required',
      'pattern': 'Only Numbers are Allowed',
    },
    'subjectUsage': {
      'required': 'Subject Usage is required',
    },
    'noteUsage': {
      'required': 'Notes Usage is required',
    }
  }
  // 
  createPlans() {
    this.createPlanForm = this.fb.group({
      planName: ['', [Validators.required, Validators.minLength(3)]],
      planPrice: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      duration: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dataUsage: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      subjectUsage: ['', [Validators.required]],
      noteUsage: ['', [Validators.required]],
    })
    this.createPlanForm.valueChanges.subscribe(data => this.onValueChanges(data))
  }
  // 
  onValueChanges(data?: any) {

    if (!this.createPlanForm)
      return
    const form = this.createPlanForm;
    for (const field in this.createPlanFormError) {
      if (this.createPlanFormError.hasOwnProperty(field)) {
        this.createPlanFormError[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.createPlanvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.createPlanFormError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  // 
  savePlan() {
    this.spinner.show();
    let body = {
      planName: this.createPlanForm.value.planName,
      planDuration: this.createPlanForm.value.duration,
      planPrice: this.createPlanForm.value.planPrice,
      subjectUsage: this.createPlanForm.value.subjectUsage,
      dataUsage: this.createPlanForm.value.dataUsage,
      noteUsage: this.createPlanForm.value.noteUsage,
      description: this.createPlanForm.value.description
    }
    this.commonService.post('createSubscription', body).subscribe((data: any) => {
      if (data.status == 200) {
        $('#CreatePlan').modal('hide');
        this.getPlans()
        this.spinner.hide();
        Swal.fire("Plan successfully Created!!");
      } else {
        this.spinner.hide();
        // alert("something went wrong")
        Swal.fire("something went wrong!!");

      }
    })
  }

  somethingChanged(event) {
    if (event.target.name == 'duration') {
      this.planDuration = event.target.value
    }
    if (event.target.name == 'dataUsage') {
      this.dataUsage = event.target.value
    }
    if (event.target.name == 'subjectUsage') {
      this.subjectUsage = event.target.value
    }
    if (event.target.name == 'noteUsage') {
      this.noteUsage = event.target.value
    }
  }

  close() {
    this.planName = ''
    this.planDuration = '';
    this.planPrice = '';
    this.subjectUsage = '';
    this.dataUsage = '';
    this.noteUsage = '';
    this.description = '';
    $('#EditPlan').modal('hide');

  }
  allSubscriber() {
    this.spinner.show();
    this.commonService.get(`subscriptionHistory`).subscribe((data: any) => {
      if (data.data.length > 0) {
        this.subscriptionHistory = data.data
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.subscriptionHistory = []
      }
    })
  }

  getSubscribers() {
    this.commonService.get(`getSubscribers`).subscribe((data: any) => {
      if (data.data.length > 0) {
        this.isSubHistory = data.data
        this.isSubscriptionHistory = this.isSubHistory
      } else {
        this.isSubscriptionHistory = []
      }
    })
  }
  onChange(event) {
    this.isSubscriptionHistory = []
    this.filter = event.target.value
    this.isSubHistory.map((item, index) => {
      if (item.Subscription_Plan === this.filter) {
        this.isSubscriptionHistory.push(item)
      }
      if (this.filter === 'All users') {
        this.isSubscriptionHistory = this.isSubHistory
      }
      // if (this.filter === 'Expired') {
      //   this.isSubscriptionHistory = this.isSubHistory
      //   const result = this.isSubscriptionHistoryList.filter(item => item.Status === 'Expired');
      //   this.SubscriptionHistoryList = result
      // }
      // if (this.filter === 'Active') {
      //   this.isSubscriptionHistory = this.isSubHistory
      //   const result = this.isSubscriptionHistoryList.filter(item => item.Status === 'Active');
      //   this.SubscriptionHistoryList = result
      // }
    })
  }
  onChangeHistory(event) {
    this.SubscriptionHistoryList = []
    this.filter = event.target.value
    this.isSubscriptionHistoryList.map((item, index) => {
      if (item.Subscription_Plan === this.filter) {
        this.SubscriptionHistoryList.push(item)
      }
      if (this.filter === 'Allusers') {
        this.SubscriptionHistoryList = this.isSubHistory
      }
      if (this.filter === 'Expired') {
        // this.isSubscriptionHistory = this.isSubHistory
        const result = this.isSubscriptionHistoryList.filter(item => item.Status === 'Expired');
        this.SubscriptionHistoryList = result
      }
      if (this.filter === 'Active') {
        // this.isSubscriptionHistory = this.isSubHistory
        const result = this.isSubscriptionHistoryList.filter(item => item.Status === 'Active');
        this.SubscriptionHistoryList = result
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
  getSubscriptionHistory() {
    this.commonService.get('getSubscriptionHistory').subscribe((data: any) => {
      if (data.status == 200) {
        this.SubscriptionHistoryList = data.data
        this.isSubscriptionHistoryList = data.data
        // console.log("this.isSubscriptionHistoryList",this.isSubscriptionHistoryList)
      } else {
        alert(data.message)
      }
    })
  }
  // Delete Plan
  delete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.onDeletePlan()
        } else {
          Swal.fire("Fail");
        }
      });
  }
  onDeletePlan() {
    document.getElementById("EditPlan").click();
    this.spinner.show();
    this.commonService.delete('deleteSubscription', this.planId).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        this.getPlans()
        Swal.fire('Deleted!',
          'Your file has been deleted.',
          'success');
      }
      else {
        this.spinner.hide();
        Swal.fire("Fail!");
      }
    })
  }
  //  search bar
  onChangeSearch(event) {
    this.SubscriptionHistoryList = this.isSubHistory
    this.searchKey = event.target.value
    // this.isSubHistory.find(item => {
    //   if (item.fullName == "Kapil Sharma") {
    //     this.SubscriptionHistoryList.push(item.fullName)
    //   }
    // })
  }
  searchByName() {
    // alert(this.searchKey)

  }
  onActive() {
    document.getElementById("activeButton").setAttribute('style', 'background-color :#009DE9 !important')
    document.getElementById("expiredButton").removeAttribute('style')
    document.getElementById("allButton").removeAttribute('style')
    this.SubscriptionHistoryList = []
    const result = this.isSubscriptionHistoryList.filter(item => item.Status === 'Active');
    this.SubscriptionHistoryList = result
  }
  onExpired() {
    document.getElementById("activeButton").removeAttribute('style')
    document.getElementById("allButton").removeAttribute('style')
    document.getElementById("expiredButton").setAttribute('style', 'background-color :#009DE9 !important')

    this.SubscriptionHistoryList = []
    const result = this.isSubscriptionHistoryList.filter(item => item.Status === 'Expired');
    this.SubscriptionHistoryList = result
  }
  onAllHisotry() {
    document.getElementById("activeButton").removeAttribute('style')
    document.getElementById("expiredButton").removeAttribute('style')
    document.getElementById("allButton").setAttribute('style', 'background-color :#009DE9 !important')
    this.SubscriptionHistoryList = []
    this.SubscriptionHistoryList = this.isSubscriptionHistoryList
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
          localStorage.removeItem("token");
          this._router.navigate(['login'])
        }
        else {
          Swal.fire("Fail");
        }
        console.log(willDelete)
      });
  }
}
