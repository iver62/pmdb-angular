import { Component, Input, signal, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective<'line'> | undefined;

  darkMode = localStorage.getItem('theme') == 'dark';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,  // Rend le graphique réactif
    maintainAspectRatio: false, // Permet au graphique de s'adapter
    scales: {
      x: {
        ticks: {
          color: this.darkMode ? 'white' : 'grey', // Couleur des labels de l'axe X
          font: {
            family: 'Oswald', // Police des labels de l’axe X
          },
        },
        grid: {
          display: false, // Désactive le quadrillage vertical
        },
        border: {
          color: this.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        min: 0,
        ticks: {
          color: this.darkMode ? 'white' : 'grey', // Couleur des labels de l'axe X
          padding: 10, // Marge en pixels entre les labels et l'axe
          font: {
            family: 'Oswald', // Police des labels de l’axe X
          },
        },
        grid: {
          color: this.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0, 0, 0, 0.1)'
        },
        border: {
          color: this.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0, 0, 0, 0.1)'
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
      },
      tooltip: {
        backgroundColor: this.darkMode ? '#212121' : 'black'
      }
    }
  }

  chartType: ChartType = 'line';

  chartData = signal<ChartData<'line'>>({ labels: [], datasets: [] });

  @Input() set data(input: ChartData<'line'> | null) {
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
