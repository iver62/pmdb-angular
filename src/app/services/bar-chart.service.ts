import { Injectable } from '@angular/core';
import { Language } from '../enums';
import { CountryRepartition, Repartition } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BarChartService {

  // colors = ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384', '#9966FF', '#FF9F40', '#8E5EA2'];
  darkMode = localStorage.getItem('theme') == 'dark';

  darkModeColors = ['#ffffff'];
  lightModeColors = ['#0071e3'];

  formatBarChartDataset(repartitions: Repartition[]) {
    console.log(this.darkMode);

    return {
      labels: repartitions.map(d => d.label),
      datasets: [
        {
          data: repartitions.map(d => d.total),
          backgroundColor: this.darkMode ? this.darkModeColors : this.lightModeColors
        }
      ]
    }
  }

  formatBarChartCountryDataset(countryRepartitions: CountryRepartition[], lang: string) {
    return {
      labels: countryRepartitions.map(r => lang == Language.EN ? r.country.nomEnGb : r.country.nomFrFr),
      datasets: [
        {
          data: countryRepartitions.map(r => r.total),
          backgroundColor: this.darkMode ? this.darkModeColors : this.lightModeColors
        }
      ]
    }
  }
}
