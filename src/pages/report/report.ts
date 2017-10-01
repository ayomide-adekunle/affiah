import { Component,ViewChild ,NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import {IncomeService} from '../../providers/income-service';
import {ExpenseService} from '../../providers/expense-service';
import {InvoiceService} from '../../providers/invoice-service';
import {ReportService}  from '../../providers/report-service';
import {AuthService} from '../../providers/auth-service';
import { ExitAppHandler } from '../../providers/exit-app-handler';

/**
 * Generated class for the Report page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class Report {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  barChart: any;doughnutChart: any;lineChart: any;
  showBar=true;showLine=false;incomeList=[];
  expenseList=[];invoiceList=[];totalIncome=0;
  chartLabel=[]; chartData={'labels':[], 'income':[],'expenses':[],
  'labels_default':[], 'income_default':[],'expenses_default':[],'invoice':[],
  'invoice_default':[]}
  charLabelSelect;incomeLength;expenseLength;invoiceLength;

  totalExpense=0; totalInvoice=0;
  //make the footer to default to report
  tabs_content='reports';
  userData;
  dateData={};
  reportDate={'from':'','to':''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public incomeService:IncomeService,public zone:NgZone,
  public expenseService: ExpenseService,public invoiceService: InvoiceService,
  public report: ReportService,public auth:AuthService,private exitService: ExitAppHandler) {
    this.exitService.setExitApp(false);
    this.getIncomeList();
    this.getExpenseList();
    this.getInvoiceList();
    this.auth.getUser().then(user => {
          this.zone.run(() => {
            this.userData=user[0];
            
          });
      })
      .catch(console.error.bind(console));
    
    
  }
  onSelectFrom(selectedValue: any) {
   
    let startFrom=(this.chartData.labels_default.indexOf(selectedValue));
    this.chartData.labels=this.chartData.labels_default.slice(startFrom,this.chartData.labels_default.length+1);
    this.chartData.expenses=this.chartData.expenses_default.slice(startFrom,this.chartData.expenses_default.length+1);
    this.totalExpense=this.getTotal(this.chartData.expenses);
    this.expenseLength=this.chartData.expenses.length;
    this.chartData.income=this.chartData.income_default.slice(startFrom,this.chartData.income_default.length+1);
    this.totalIncome=this.getTotal(this.chartData.income);
    this.incomeLength=this.chartData.income.length;
    this.loadGraph();
  }
  onSelectTo(selectedValue: any) {
   
    let endAt=(this.chartData.labels_default.indexOf(selectedValue));
    this.chartData.labels=this.chartData.labels_default.slice(0,endAt+1);
    this.chartData.expenses=this.chartData.expenses_default.slice(0,endAt+1);
    this.totalExpense=this.getTotal(this.chartData.expenses);
    this.expenseLength=this.chartData.expenses.length;

    this.chartData.income=this.chartData.income_default.slice(0,endAt+1);
    this.totalIncome=this.getTotal(this.chartData.income);
    this.incomeLength=this.chartData.income.length;
    this.loadGraph();
  }
  notExit(data,date)  {
    for(var a in data)  {
      if (data[a]==date) {
        return false;
      }
    }  
    return true;
  }
  getIncomeList() {
    this.incomeService.getIncome()
      .then(incomes => {
          this.zone.run(() => {
            this.incomeList=incomes;
            //this.incomeService.deleteIncome(this.IncomeList[0]);
            this.getChartLabel(this.incomeList);
            
           
            this.incomeLength=this.incomeList.length;
            this.totalIncome=this.getTotal(this.incomeList);
           
          });
      })
      .catch(console.error.bind(console));
  }
  getExpenseList() {
    this.expenseService.getAllExpenses()
      .then(expenses => {
          this.zone.run(() => {
            this.expenseList=expenses;
            //this.incomeService.deleteIncome(this.IncomeList[0]);
           
             this.totalExpense=this.getTotal(this.expenseList);
             this.expenseLength=this.expenseList.length;
             this.getChartLabel(this.expenseList);
             this.loadValue();
            
            
          });
      })
      .catch(console.error.bind(console));
  }
  getInvoiceList() {
    this.invoiceService.getInvoice()
      .then(invoices => {
          this.zone.run(() => {
            for(var a in invoices)  {
              if(parseInt(invoices[a].amount) != parseInt(invoices[a].amount_paid)) {
                this.invoiceList.push(invoices[a]);
              }
            }
            //this.invoiceList=invoices;
            //this.invoiceService.deleteInvoice(this.invoiceList[0]);
            
            this.totalInvoice=this.getTotal(this.invoiceList);
            this.invoiceLength=this.invoiceList.length;
            
          });
      })
      .catch(console.error.bind(console));
  }
  getChartLabel(List) {
    for ( var a in List)  {
      if(this.chartLabel.length==0 || this.notExit(this.chartLabel,List[a].date)) {
        this.chartLabel.push(List[a].date);
      }
    }
   
    //this is use for the select form
    this.charLabelSelect=this.chartLabel
  }
  loadValue() {
    for( var a in this.chartLabel)  { 
      this.chartData.labels.push(this.chartLabel[a]);
      this.chartData.labels_default.push(this.chartLabel[a]);
      let incomeVal=0; let expenseVal=0;
      for ( var b in this.incomeList) {
        
        if ( this.chartLabel[a]==this.incomeList[b].date) {
            incomeVal+=parseInt(this.incomeList[b].amount);      
        }  
      }
      if(this.chartData.income.length<5)  {
        //load only five by default
        this.chartData.income.push(incomeVal);
      }
      this.chartData.income_default.push(incomeVal);
      for ( var b in this.expenseList) { 
        if ( this.chartLabel[a]==this.expenseList[b].date) {
            expenseVal+=parseInt(this.expenseList[b].amount);      
        } 
      }
      this.chartData.expenses.push(expenseVal);
      this.chartData.expenses_default.push(expenseVal); 

      if(this.chartData.labels.length>5)  {
        //load only five by default
        this.chartData.labels=this.chartData.labels.slice(this.chartData.labels.length-5,this.chartData.labels.length+1);
      }
      if(this.chartData.expenses.length>5)  {
        //load only five by default
        this.chartData.expenses=this.chartData.expenses.slice(this.chartData.expenses.length-5,this.chartData.expenses.length+1);
      }
      if(this.chartData.income.length>5)  {
        //load only five by default
        this.chartData.income=this.chartData.income.slice(this.chartData.income.length-5,this.chartData.income.length+1);
      }     
    }
   this.loadGraph();
  }
  getTotal(object)  {
    let totalValue=0;
    for (var a in object) {
      if(object[a].amount)  {
         totalValue=totalValue+parseInt(object[a].amount);
      }
      else{
         totalValue=totalValue+parseInt(object[a]);
      }
     
    }
    return totalValue;
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ionViewDidLoad() {      
  }
  loadGraph() {
     this.barChart = new Chart(this.barCanvas.nativeElement, {
 
            type: 'bar',
            data: {
                labels: this.chartData.labels,
                datasets: [{
                    label: ['Expenses'],
                    data: this.chartData.expenses,
                    backgroundColor:'rgba(255, 99, 132, 0.2)',
                    borderColor:'rgba(255,99,132,1)',
                    borderCapStyle: 'butt',
                    borderWidth: 1
                },
                {
                  label: ['Income'],
                    data: this.chartData.income,
                    backgroundColor:'rgba(54, 162, 235, 0.2)',
                    borderColor:  'rgba(54, 162, 235, 1)',
                    borderCapStyle: 'butt',
                    borderWidth: 1
                }

                ],
                
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
 
        });
     
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
 
            type: 'line',
            data: {
                 labels: this.chartData.labels,
                datasets: [
                    {
                        label: ["Expenses"],
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor:'rgba(255, 99, 132, 0.2)',
                        borderColor:'rgba(255,99,132,1)',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255,99,132,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data:this.chartData.expenses,
                        spanGaps: false,
                    },
                    {
                        label: ["Income"],
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor:'rgba(54, 162, 235, 0.2)',
                        borderColor:  'rgba(54, 162, 235, 1)',
                       
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'round',
                        pointBorderColor: "rgba(54, 162, 235, 1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.chartData.income,
                        spanGaps: false,
                    }
                ]
                }
 
        });

  }
  toggleChart() {
    if(this.showBar)  {
      this.showLine=true;
      this.showBar=false
    }
    else{
      this.showBar=true;
      this.showLine=false;
    }      
  }
  selectLastLabel(data,list)  {
    if(data==list[list.length-1]){
      this.reportDate.to=data;
      return true;
    }
    return false;
  }
  selectFifthToLast(data,list)  {
    if(list.length<=5 && data==list[0])  {
      this.reportDate.from=data;
      return true;
    }
    else if (data==list[list.length-5])  {
     this.reportDate.from=data;
      return true;
    }
    else {
      return false;
    }
  }
  downloadReport()  {
    var income= this.formatNumber(this.totalIncome);
    var expense= this.formatNumber(this.totalExpense);
    this.report.generateReport(this.userData,this.reportDate,this.chartData,income,expense);
  }
 

}
