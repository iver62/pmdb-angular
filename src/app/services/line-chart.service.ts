import { Injectable } from '@angular/core';
import { Repartition } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  darkMode = localStorage.getItem('theme') == 'dark';

  buildLineChartDataset(repartitions: Repartition[]) {
    return {
      labels: repartitions.map(d => d.label),
      datasets: [
        {
          data: repartitions.map(d => d.total),
          borderColor: this.darkMode ? '#ffffff' : '#0071e3',
          pointBorderColor: this.darkMode ? '#ffffff' : '#0071e3',
        }
      ]
    };
  }
}
