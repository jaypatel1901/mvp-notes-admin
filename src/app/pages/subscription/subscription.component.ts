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
  planList:any=[]
  filter = 'All users'
  isSubHistory:any=[]
  p: number = 1;
  p1: number = 1;
  SubscriptionHistoryList:any=[]
  isSubscriptionHistoryList:any=[]
  isStatus: boolean = false;

  constructor(private commonService: CommonService,private _router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getPlans();
    this.allSubscriber()
    this.getSubscribers()
    this.getSubscriptionPlanList()
    this.getSubscriptionHistory()
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

  getSubscribers(){
    this.commonService.get(`getSubscribers`).subscribe((data: any)=>{
      if(data.data.length>0){
        this.isSubHistory=data.data
        this.isSubscriptionHistory =this.isSubHistory
          }else{
        this.isSubscriptionHistory=[]
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
  getSubscriptionPlanList() {
    this.commonService.get('getSubscriptionPlan').subscribe((data: any) => {
      if (data.status == 200) {
        this.planList = data.result
      } else {
        alert(data.message)
      }
    })
  }
  getSubscriptionHistory  () {
    this.commonService.get('getSubscriptionHistory').subscribe((data: any) => {
      if (data.status == 200) {
        this.SubscriptionHistoryList=data.data
        this.isSubscriptionHistoryList=data.data
      } else {
        alert(data.message)
      }
    })
  }
  onActive(){   
  document.getElementById("activeButton").setAttribute('style','background-color :#009DE9 !important') 
   this.SubscriptionHistoryList=[]
    const result = this.isSubscriptionHistoryList.filter(item => item.Status==='Active');
    this.SubscriptionHistoryList=result
  }
  onExpired(){
    document.getElementById("activeButton").removeAttribute('style') 
    document.getElementById("allButton").removeAttribute('style') 
    document.getElementById("expiredButton").setAttribute('style','background-color :#009DE9 !important') 

   this.SubscriptionHistoryList=[]
    const result = this.isSubscriptionHistoryList.filter(item => item.Status==='Expired');
    this.SubscriptionHistoryList=result
  }
  onAllHisotry(){
    document.getElementById("activeButton").removeAttribute('style') 
    document.getElementById("expiredButton").removeAttribute('style') 
    document.getElementById("allButton").setAttribute('style','background-color :#009DE9 !important') 
    this.SubscriptionHistoryList=[]
    this.SubscriptionHistoryList=this.isSubscriptionHistoryList
  }
}
