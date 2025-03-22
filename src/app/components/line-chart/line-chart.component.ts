import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input() lineChartData: ChartData<'line'>;

  lineChartOptions: ChartConfiguration['options'] = {
    scales: {
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  lineChartType: ChartType = 'line';

}
