import { Injectable } from '@angular/core';
import { Repartition } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  buildLineChartDataset(repartitions: Repartition[]) {
    return {
      labels: repartitions.map(d => d.label),
      datasets: [
        {
          data: repartitions.map(d => d.total),
          borderColor: '#36A2EB',
          pointBorderColor: '#36A2EB',
        }
      ]
    };
  }
}
