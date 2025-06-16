import { Injectable } from '@angular/core';
import { Language } from '../enums';
import { CountryRepartition, Repartition } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BarChartService {

  darkModeColors = ['#ffffff'];
  lightModeColors = ['#0071e3'];

  formatBarChartDataset(repartitions: Repartition[], darkMode: boolean) {
    return {
      labels: repartitions.map(d => d.label),
      datasets: [
        {
          data: repartitions.map(d => d.total),
          backgroundColor: darkMode ? this.darkModeColors : this.lightModeColors
        }
      ]
    }
  }

  formatBarChartCountryDataset(countryRepartitions: CountryRepartition[], lang: string, darkMode: boolean) {
    return {
      labels: countryRepartitions.map(r => lang == Language.EN ? r.country.nomEnGb : r.country.nomFrFr),
      datasets: [
        {
          data: countryRepartitions.map(r => r.total),
          backgroundColor: darkMode ? this.darkModeColors : this.lightModeColors
        }
      ]
    }
  }
}
