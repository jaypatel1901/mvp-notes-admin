import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label,Color } from 'ng2-charts';
import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  error: any;
  user: any;
  userList: any = []
  totalUsage: any = ''
  username = ''
  email: string = ''
  subscriptionId: string = ''
  planList:any=[]
  paymentData:any =''
  isBarChart:any=[]
  isGold_Plan:any=[]
  isSilver_Plan:any=[]
  isTrial_Plan:any=[]
  subscriptionSales:any={}
  // paymentData:any =[]
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#FF0000',
      backgroundColor: null,
    },
    {
      borderColor: '#8E2AC0',
      // backgroundColor: '#8E2AC0',
    },
    {
      borderColor: '#F9966D',
      // backgroundColor: '#F9966D',
    },
  ];
  public barChartColors: Color[] = [
    {
      borderColor: '#009DE9',
      backgroundColor: '#009DE9',
    },
  ];
  public barChartLabels: Label[] = ['Jan 2020', 'Feb 2020', 'Mar 2020', 'Apr 2020', 'May 2020', 'Jun 2020', 'Jul 2020','Aug 2020','Oct 2020','Nov 2020','Dec 2020'];
  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Total Sales' },
  ];
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Gold Plan' },
    // { data: [], label: 'Silver Plan' },
    // { data: [], label: 'Trial Plan' },
  ];
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.username =''
    this.getUSerlist()
    this.getUsageStatistics()
    this.getSubscriptionPlanList()
    this.getSubscriptionReport()
    this.saleReportChart()
    this.getSubscriptionReportChart()
    this.SubscriptionsaleReportChart()
  }
//   updateChart(){
//     this.datasets = this.dataset.slice()
// }

  chartClicked(e: any): void {
    console.log('click', e);
  }

  chartHovered(e: any): void {
    console.log('hover', e);
  }

  onSendInvitation() {
    alert(this.username)
    console.log("onSendInvitation", this.username)
  }
  getUSerlist() {
    this.commonService.get('getsubscriptionUser').subscribe((data: any) => {
      if (data.status == 200) {
        this.userList = data.result
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getUsageStatistics() {
    this.commonService.get('getUsageStatistics').subscribe((data: any) => {
      if (data.status == 200) {
        this.totalUsage = data.data
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getSubscriptionPlanList() {
    this.commonService.get('getSubscriptionPlan').subscribe((data: any) => {
      if (data.status == 200) {
        this.planList = data.result
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getSubscriptionReport() {
    this.commonService.get('saleReport').subscribe((data: any) => {
      if (data.status == 200) {
        this.paymentData = data.data
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  saleReportChart() {
    this.commonService.get('getsaleChart').subscribe((data: any) => {
      if (data.status == 200) {
        let newData = data.data
        this.barChartData[0].data = newData.map(v=> parseInt((v).toString()))
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getSubscriptionReportChart() {
    this.commonService.get('subscriptionReport').subscribe((data: any) => {
      if (data.status == 200) {
        let newData = data.data.Silver_Plan
        let newData1 = data.data.Gold_Plan
        let newData2 = data.data.Trial_Plan
        this.lineChartData[0].data = newData1.map(v=> parseInt((v).toString()))
        let dataGold = newData1.map(v=> parseInt((v).toString()))
        let dataSilver = newData.map(v=> parseInt((v).toString()))
        let datatrial = newData2.map(v=> parseInt((v).toString()))

        // this.lineChartData.push( { data:dataGold  , label: 'Gold Plan' })
        this.lineChartData.push( { data:dataSilver , label: 'Silver Plan' })
        this.lineChartData.push( { data: datatrial , label: 'Trial Plan' })
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  SubscriptionsaleReportChart() {
    this.commonService.get('subscriptionReport_data').subscribe((data: any) => {
      if (data.status == 200) {
        this.subscriptionSales = data.data
        console.log("subscriptionSales",this.subscriptionSales)
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
}
