import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import SlimSelect from 'slim-select'
import { NgxSpinnerService } from "ngx-spinner";
import { NgxDateRangeModule } from 'ngx-daterange';
// import { Component,  } from "@angular/core";
// import { DaterangePickerComponent } from 'ng2-daterangepicker';

import Swal from 'sweetalert2';
import { concatAll } from 'rxjs/operators';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

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
  isDuration:''
  Durations = [{
    Id: '30',
    name: "Monthly"
  },
  {
    Id: '90',
    name: "Quaterly"
  },
  {
    Id: '365',
    name: "Yearly"
  }
]
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
  planData: any
  specification: any = []
  deActivePlans: any
  ActivePlans:any
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
    this.UpdatePlanForm.patchValue({
      duration: "30"
    });
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

    // update form
    // 
  var select1 =  new SlimSelect({
      select: '#plan-durationupdate',
      showSearch: false,
      placeholder:"this.isDuration"
      // selected:true,
      // setSelected
    })
    select1.selected()
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
      console.log("datda plans", data.result)
      if (data.result.length > 0) {
        this.plans = data.result
        this.deActivePlans = data.result.filter(plan => plan.isActive === false);
        this.ActivePlans = data.result.filter(plan => plan.isActive === true);

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
        this.planData = data.data;
        this.updatePlans()
        this.UpdatePlanForm.value.planName = data.data.planName ? data.data.planName : '';
        this.UpdatePlanForm.value.planPrice = data.data.planPrice;
        this.planDuration = data.data.planDuration ? data.data.planDuration : '';
        this.UpdatePlanForm.value.duration = data.data.planDuration ? data.data.planDuration : '';
        this.isDuration= data.data.planDuration
        this.UpdatePlanForm.value.subjectUsage = data.data.configration.subjectUsage ? data.data.configration.subjectUsage : '';
        this.UpdatePlanForm.value.dataUsage = data.data.configration.dataUsage ? data.data.configration.dataUsage : '';
        this.UpdatePlanForm.value.noteUsage = data.data.configration.dataUsage ? data.data.configration.noteUsage : ''
        this.UpdatePlanForm.value.description = data.data.description;
        let specification = data.data.specification
        specification.map(itme => {
          (<FormArray>this.UpdatePlanForm.controls.spec).push(new FormControl(itme, Validators.required));

        })

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
  AddMoreInputUpdate() {
    (<FormArray>this.UpdatePlanForm.controls.spec).push(new FormControl('', Validators.required));
  }
  updatePlans() {
    this.UpdatePlanForm = this.fb.group({
      planName: [this.planData ? this.planData.planName : '', [Validators.required, Validators.minLength(3)]],
      planPrice: [this.planData ? this.planData.planPrice : '', [Validators.required, Validators.pattern("[0-9]+(\.[0-9][0-9]?)?")]],
      duration: [this.planData ? this.planData.planDuration : '', [Validators.required]],
      description: [this.planData ? this.planData.description : '', [Validators.required]],
      dataUsage: [this.planData ? this.planData.configration.dataUsage : '', [Validators.required, Validators.pattern("^[0-9]*$")]],
      subjectUsage: [this.planData ? this.planData.configration.subjectUsage : '', [Validators.required]],
      noteUsage: [this.planData ? this.planData.configration.noteUsage : '', [Validators.required]],
      spec: this.fb.array([])
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
    this.UpdatePlanForm.value.spec = this.UpdatePlanForm.value.spec.filter(item => item !== '')
    let body = {
      subscriptionId: this.planId,
      planName: this.UpdatePlanForm.value.planName,
      planDuration: this.UpdatePlanForm.value.duration,
      planPrice: this.UpdatePlanForm.value.planPrice,
      subjectUsage: this.UpdatePlanForm.value.subjectUsage,
      dataUsage: this.UpdatePlanForm.value.dataUsage,
      noteUsage: this.UpdatePlanForm.value.noteUsage,
      description: this.UpdatePlanForm.value.description,
      specification: this.UpdatePlanForm.value.spec
    }
    console.log("update plan data", body)
    this.commonService.put('updateSubscription', body).subscribe((data: any) => {
      if (data.status == 200) {

        // Swal.fire('Plan Updated!',
        // 'Your Plan has been Updated.',
        // 'success');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Plan has been Updated',
          showConfirmButton: false,
          timer: 2000
        })
        $('#EditPlan').modal('hide');
        this.getPlans()
        this.spinner.hide();
      } else {
        this.spinner.hide();
        // Swal.fire('fail')
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
      'required': 'Price is required',
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
    },
    'specification': {
      "required": "Features is required"
    }
  }

  // 
  createPlans() {

    this.createPlanForm = this.fb.group({
      planName: ['', [Validators.required, Validators.minLength(3)]],
      planPrice: ['', [Validators.required, Validators.pattern("[0-9]+(\.[0-9][0-9]?)?")]],
      duration: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dataUsage: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      subjectUsage: ['', [Validators.required]],
      noteUsage: ['', [Validators.required]],
      spec: this.fb.array([new FormControl('', Validators.required)])
    })
    this.createPlanForm.valueChanges.subscribe(data => this.onValueChanges(data))
  }

  AddMoreInput() {
    console.log("add");
    console.log(this.createPlanForm.value);
    (<FormArray>this.createPlanForm.controls.spec).push(new FormControl('', Validators.required));
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
        if (control && control.dirty && !control.valid || control.touched) {
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
    this.createPlanForm.markAllAsTouched()
    this.createPlanForm.value.spec = this.createPlanForm.value.spec.filter(item => item !== '')

    this.onValueChanges();
    if (this.createPlanForm.valid) {
      this.spinner.show();
      let body = {
        planName: this.createPlanForm.value.planName,
        planDuration: this.createPlanForm.value.duration,
        planPrice: this.createPlanForm.value.planPrice,
        subjectUsage: this.createPlanForm.value.subjectUsage,
        dataUsage: this.createPlanForm.value.dataUsage,
        noteUsage: this.createPlanForm.value.noteUsage,
        description: this.createPlanForm.value.description,
        specification: this.createPlanForm.value.spec
      }

      this.commonService.post('createSubscription', body).subscribe((data: any) => {
        if (data.status == 200) {
          $('#CreatePlan').modal('hide');
          this.getPlans()
          this.spinner.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your Plan has been Created !',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          this.spinner.hide();
          // alert("something went wrong")
          Swal.fire("something went wrong!!");
        }
      })
    }
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
      this.spinner.hide();

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
      this.spinner.hide();

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
      text: "Once Deactivated, you will not be able to recover this imaginary Plan!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate it!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.onDeletePlan()
        } else {
          // Swal.fire("Fail");
        }
      });
  }
  onActivePlan(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, Activate  it!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.spinner.show();
          let body: any = {
            planId: id,
            status: true,
          }
          this.commonService.put('deleteSubscription', body).subscribe((data: any) => {
            if (data.status == 200) {
              this.spinner.hide();
              this.getPlans()
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your Plan has been Activated !',
                showConfirmButton: false,
                timer: 2000
              })
            }
            else {
              this.spinner.hide();
              Swal.fire("Fail!");
            }
          })
        } else {
          // Swal.fire("Fail");
        }
      });
  }
  onDeletePlan() {
    document.getElementById("EditPlan").click();
    this.spinner.show();
    let body: any = {
      planId: this.planId,
      status: false
    }
    this.commonService.put('deleteSubscription', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        this.getPlans()
        // Swal.fire('Deactivated!',
        //   'Your Plan has been Deactivated.',
        //   'success');

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Plan has been Deactivated !',
          showConfirmButton: false,
          timer: 2000
        })
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
  onViewPerfomance(id) {
    // View-Perfomance
    console.log(id)
    this._router.navigate([`view-Perfomance/${id}`])

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
          this._router.navigate(['login'])
        }
        else {
          // Swal.fire("Fail");
        }
        // console.log(willDelete)
      });
  }
}
