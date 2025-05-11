import { Component, Input, signal, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective<'bar'> | undefined;

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,  // Rend le graphique réactif
    maintainAspectRatio: false, // Permet au graphique de s'adapter
    scales: {
      x: {
        grid: {
          display: false // Désactive le quadrillage vertical
        }
      }
    },
    animation: {
      duration: 800, // Durée en ms
      easing: 'easeOutQuart' // Courbe d’animation
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  chartType = 'bar' as const;

  chartData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });

  @Input() set data(input: ChartData<'bar'> | null) {
    if (!input || !input.datasets.length) return;

    const current = this.chartData();
    const incoming = input;

    // Replace labels if they changed
    if (JSON.stringify(current.labels) !== JSON.stringify(incoming.labels)) {
      current.labels = [...incoming.labels];
    }

    // Replace dataset values by index
    if (incoming.datasets.length && current.datasets.length) {
      const currentDataset = current.datasets[0];
      const incomingDataset = incoming.datasets[0];

      incomingDataset.data.forEach((v, i) => {
        if (currentDataset.data[i] !== v) {
          currentDataset.data[i] = v;
        }
      });
    } else {
      current.datasets = [...incoming.datasets];
    }

    this.chartData.set({ ...current });
    queueMicrotask(() => this.chart?.update());
  }
}
