import { Injectable } from '@angular/core';
import { Repartition } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  buildLineChartDataset(repartitions: Repartition[], darkMode: boolean) {
    return {
      labels: repartitions.map(d => d.label),
      datasets: [
        {
          data: repartitions.map(d => d.total),
          borderColor: darkMode ? '#ffffff' : '#0071e3',
          pointBorderColor: darkMode ? '#ffffff' : '#0071e3',
        }
      ]
    };
  }
}
