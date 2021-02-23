import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import SlimSelect from 'slim-select'

@Component({
  selector: 'payment',
  templateUrl: './viewPerfomance.component.html',
  styleUrls: ['./viewPerfomance.component.css']
})
export class ViewPerfomanceComponent implements OnInit {
  planId:any
  planName:any
  userList:any
  planPrice:any
  filterData:any
  isfilterchangeUsers =
    {
      label: 'All Time',
      startDate: '2020-11-25T11:31:07.431Z',
      endDate: new Date(),
      planId:''
    }
isfilterchangeSales =
    {
      label: 'All Time',
      startDate: '2020-11-25T11:31:07.431Z',
      endDate: new Date(),
      planId:''
    }
  // 
// 
public barChartOptions: ChartOptions = {
  responsive: true,
};
public barChartLabels: Label[] = [];
public barChartLabels1: Label[] = [];

public barChartType: ChartType = 'bar';
public barChartLegend = true;
public barChartPlugins = [];
public barChartColors: Color[] = [
  {
    borderColor: '#009DE9',
    backgroundColor: '#009DE9',
  },
];
public barChartData: ChartDataSets[] = [
  { data: [ ], label: 'Series A' },
];
public barChartData1: ChartDataSets[] = [
  // { data: [ ], label: 'Series A' },
];
// 

  constructor(private commonService: CommonService,private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.getPlan()
    this.getUserList()
    this.getUserChart()
    this.getChartFilter()
this.getSaleChart()
    new SlimSelect({
      select: '#user-toggle',
      showSearch: false,
    })
    new SlimSelect({
      select: '#Total-sales',
      showSearch: false,
    })
  }
  
  
  getPlan() {
    this.spinner.show();
    let myMainSite = this.router.url
    var splitUrl = myMainSite.split('/');
    this.planId = splitUrl[2]
    let body={
      plan_id:this.planId
    }
    this.commonService.patch('getPlanDetails', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.planName = data.data.planName
        this.planPrice = data.data.planPrice
        this.spinner.hide();

      } else {
        alert(data.message)
        this.spinner.hide();

      }
    })
  }
  getUserList() {
    this.spinner.show();
    this.commonService.get(`usersByPlan/${this.planId}`).subscribe((data: any) => {
      if (data.status == 200) {
        this.userList = data.result
        this.spinner.hide();
      } else {
        this.spinner.hide();
        alert(data.message)
      }
    })
  }
  getChartFilter() {
    this.commonService.get('chartFilter').subscribe((data: any) => {
      if (data.status == 200) {
        this.filterData = data.data
      } else {
        // this.error = data.message
        // alert(this.error)
      }
    })
  }
  onChangeUsersfilter(event) {
    let isFilter = event.target.value
    if (isFilter !== null) {
      let newdata = []
      newdata = this.filterData.filter((item) => {
        return item.label === isFilter
      });
      this.isfilterchangeUsers = newdata[0]
      this.getUserChart()
    }
  }
  getUserChart() {
    this.barChartData=[]
    this.spinner.show();
    let body={
      "planId":this.planId
    }
    this.isfilterchangeUsers.planId = this.planId
    this.commonService.post(`userPerfomanceChart`,this.isfilterchangeUsers).subscribe((data: any) => {
      this.spinner.hide();

      if (data.status == 200) {
        console.log("datda",data)
        var newdata = data.data
        this.barChartData.push({
          data:newdata.chartData,label:"Gold Plan"
        })
        this.barChartLabels = newdata.chartLabel

        // var newArr =[]
        // console.log(newArr)
        // newdata.chartData.map((item,i)=>{
        //   newArr.push(item*this.planPrice)
        // })
        // this.barChartLabels1 = newdata.chartLabel

        // this.barChartData1.push({
        //   data: newArr, label: this.planName
        // })
        this.spinner.hide();
        // console.log("this.isSubscriptionHistoryList",this.isSubscriptionHistoryList)
      } else {
        this.spinner.hide();
        alert(data.message)
      }
    })
  }
  onChangSalesfilter(event) {
    let isFilter = event.target.value
    if (isFilter !== null) {
      let newdata = []
      newdata = this.filterData.filter((item) => {
        return item.label === isFilter
      });
      this.isfilterchangeSales = newdata[0]
      this.getSaleChart()
    }
  }
  getSaleChart() {
    this.barChartData1=[]
    this.spinner.show();
    
    this.isfilterchangeSales.planId = this.planId
    this.commonService.post(`userPerfomanceChart`,this.isfilterchangeSales).subscribe((data: any) => {
      this.spinner.hide();

      if (data.status == 200) {
        console.log("datda",data)
        var newdata = data.data
       
        var newArr =[]
        console.log(newArr)
        newdata.chartData.map((item,i)=>{
          newArr.push(item*this.planPrice)
        })
        this.barChartLabels1 = newdata.chartLabel

        this.barChartData1.push({
          data: newArr, label: this.planName
        })
        this.spinner.hide();
        // console.log("this.isSubscriptionHistoryList",this.isSubscriptionHistoryList)
      } else {
        this.spinner.hide();
        alert(data.message)
      }
    })
  }
  logout() {

    Swal.fire({
      title: "Are you sure?",
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
