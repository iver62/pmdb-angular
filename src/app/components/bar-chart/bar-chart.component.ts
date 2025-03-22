import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {
        grid: {
          display: false // Désactive le quadrillage vertical
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  barChartType = 'bar' as const;

  @Input() barChartData: ChartData<'bar'>;

}
