import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
declare var $: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  plans:any;
  planDetail:any
  planName:string;
  planDuration:string;
  planPrice:string;
  subjectUsage:any='';
  dataUsage:string='';
  noteUsage:string='';
  detailForm: FormGroup;
  planId:string;
  description:string
  subscriptionHistory:any;
  isSubscriptionHistory:any=[]
  constructor(private commonService: CommonService,private _router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getPlans();
    this.allSubscriber()
    this.getsubscriptionHistory()
  }

  getPlans(){
    this.commonService.get(`getSubscriptionPlan`).subscribe((data: any)=>{
      if(data.result.length>0){
        this.plans=data.result

      }else{
        this.plans=[];
      }

    })

  }

  editplan(id){
    this.planId=id;
    let body={
      plan_id:id
    }
    this.commonService.patch('getPlanDetails',body).subscribe((data: any)=>{
      console.log(JSON.stringify(data))
      if(data.status==200){
        this.planName=data.data.planName?data.data.planName:'';
        this.planPrice=data.data.planPrice;
        this.planDuration=data.data.planDuration?data.data.planDuration:'';
        this.subjectUsage =data.data.configration.subjectUsage?data.data.configration.subjectUsage:'';
        this.dataUsage=data.data.configration.dataUsage?data.data.configration.dataUsage:'';
        this.noteUsage=data.data.configration.dataUsage?data.data.configration.noteUsage:''
        this.description=data.data.description;
      }else{
        this.plans='';
      }

    })
  }

  update(){
    alert(this.description)
    let body={
      subscriptionId:this.planId,
      planName:this.planName,
      planDuration:this.planDuration,
      planPrice:this.planPrice,
      subjectUsage:this.subjectUsage,
      dataUsage:this.dataUsage,
      noteUsage:this.noteUsage,
      description:this.description

    }
    this.commonService.put('updateSubscription',body).subscribe((data: any)=>{
      if(data.status ==200){
        $('#EditPlan').modal('hide');
        this.getPlans()
      }else{

      }
    })

  }

  savePlan(){
    let body={
      planName:this.planName,
      planDuration:this.planDuration,
      planPrice:this.planPrice,
      subjectUsage:this.subjectUsage,
      dataUsage:this.dataUsage,
      noteUsage:this.noteUsage,
      description:this.description

    }
    this.commonService.post('createSubscription',body).subscribe((data: any)=>{
      if(data.status ==200){
        $('#CreatePlan').modal('hide');
        this.getPlans()
      }else{
        alert("something went wrong")
      }
    })
  }

  somethingChanged(event){
    if(event.target.name=='duration'){
      this.planDuration=event.target.value
    }
    if(event.target.name=='dataUsage'){
      this.dataUsage=event.target.value
    }
    if(event.target.name=='subjectUsage'){
      this.subjectUsage=event.target.value
    }
    if(event.target.name=='noteUsage'){
      this.noteUsage=event.target.value
    }
  }

  close(){
    this.planName=''
    this.planDuration='';
    this.planPrice='';
    this.subjectUsage='';
    this.dataUsage='';
    this.noteUsage='';
    this.description='';
    $('#EditPlan').modal('hide');

  }
  allSubscriber(){
    this.commonService.get(`subscriptionHistory`).subscribe((data: any)=>{
      if(data.data.length>0){
        this.subscriptionHistory=data.data
      }else{
        this.subscriptionHistory=[]
      }
    })
  }

  getsubscriptionHistory(){
    this.commonService.get(`getsubscriptionHistory`).subscribe((data: any)=>{
      if(data.data.length>0){
        this.isSubscriptionHistory=data.data
        console.log(this.isSubscriptionHistory)
      }else{
        this.isSubscriptionHistory=[]
      }
    })
  }

}
