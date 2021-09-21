import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
 import { Chart, registerables } from 'chart.js';
 import { Router } from '@angular/router';
 import 'chart.js'


Chart.register(...registerables); 

/* Chart.pluginService.register({
  beforeInit: function(chart : any) {
      var data = chart.config.data;
      for (var i = 0; i < data.datasets.length; i++) {
          for (var j = 0; j < data.labels.length; j++) {
             var fct = data.datasets[i].function,
                 x = data.labels[j],
                 y = fct(x);
              data.datasets[i].data.push(y);
          }
      }
  }
}); */

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
   @ViewChild('lineCanvas') lineCanvas: ElementRef;
  lineChart: any; 
  input : string = "1234";
  result : string = "35";
  UseEvaluateMethod : boolean = false;
  history : string[] = []
  constructor(private router: Router) { }
   ngOnInit(): void {
  }
    ngAfterViewInit(): void {
    this.lineChartMethod();
  }  

  Clear()
  {
    this.input = ""
    this.result = ""
  }

  GoToEquations()
  {
    this.router.navigate(['./../Calculator/calculator.component']);
  }

  AddSpecialCharacters(input : string)
  {
      this.input = this.input + input;
  }

  InputValue(input : string)
  {
      this.input = this.input + input;
  }

  CalculateAnswer()
  {
    this.result = this.input;
  }


 lineChartMethod () {
    this.lineChart = new  Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5],
        datasets: [
          {
            label: '(x-x*0.5*x^1.1)',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
            spanGaps: false,
          }
        ]
      }
    });
  } 

}
