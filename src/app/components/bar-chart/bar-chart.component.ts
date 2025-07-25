import { Component, effect, input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ConfigService } from '../../services';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective<'bar'> | undefined;

  darkMode = localStorage.getItem('theme') == 'dark';

  chartOptions: ChartConfiguration<'bar'>['options'] = {
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
          display: false // Désactive le quadrillage vertical
        },
        border: {
          color: this.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: this.darkMode ? 'white' : 'grey', // Couleur des labels de l'axe X
          padding: 10, // Marge en pixels entre les labels et l'axe
          font: {
            family: 'Oswald', // Police des labels de l’axe X
          },
        },
        grid: {
          color: this.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        },
        border: {
          color: this.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
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
        backgroundColor: this.darkMode ? '#212121' : 'black',   // Couleur de fond du tooltip
      }
    }
  };

  chartType = 'bar' as const;

  data = input.required<ChartData<'bar'> | null>();

  chartData: ChartData<'bar'> = ({ labels: [], datasets: [] });

  constructor(private configService: ConfigService) {
    effect(() => {
      const current = this.chartData;
      const incoming = this.data();

      // Remplacer les libellés si ils ont changé
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

        if (currentDataset.backgroundColor != incomingDataset.backgroundColor) {
          currentDataset.backgroundColor = incomingDataset.backgroundColor;
        }
      } else {
        current.datasets = [...incoming.datasets];
      }

      this.chartData = { ...current };
      this.chart?.update();
    });
  }

  ngOnInit() {
    this.configService.isDarkMode$.subscribe(result => {
      this.chartOptions.scales['x'].ticks.color = result ? 'white' : 'grey';
      this.chartOptions.scales['x'].border.color = result ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
      this.chartOptions.scales['y'].ticks.color = result ? 'white' : 'grey';
      this.chartOptions.scales['y'].grid.color = result ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
      this.chartOptions.scales['y'].border.color = result ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
      this.chartOptions.plugins.tooltip.backgroundColor = result ? '#212121' : 'black';
      this.chart?.update();
    });
  }
}
