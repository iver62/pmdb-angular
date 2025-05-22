import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Direction, Language, PersonType } from '../enums';
import { Country, Criterias, Movie, Person } from '../models';
import { DateUtils } from '../utils';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private basePath = `${environment.apiBaseUrl}/persons`

  constructor(
    private dateService: DateService,
    private http: HttpClient
  ) { }

  getById(id: number) {
    return this.http.get<Person>(`${this.basePath}/${id}`);
  }

  getPersons(page = 0, size = 50, term: string, sort = 'name', direction = 'asc', criterias?: Criterias) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? Direction.ASCENDING : Direction.DESCENDING);
    term && params.set('term', term);
    criterias?.fromBirthDate && params.set('from-birth-date', this.dateService.format(criterias.fromBirthDate, DateUtils.API_DATE_FORMAT));
    criterias?.toBirthDate && params.set('to-birth-date', this.dateService.format(criterias.toBirthDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromDeathDate && params.set('from-death-date', this.dateService.format(criterias.fromDeathDate, DateUtils.API_DATE_FORMAT));
    criterias?.toDeathDate && params.set('to-death-date', this.dateService.format(criterias.toDeathDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromCreationDate && params.set('from-creation-date', this.dateService.format(criterias?.fromCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toCreationDate && params.set('to-creation-date', this.dateService.format(criterias?.toCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.fromLastUpdate && params.set('from-last-update', this.dateService.format(criterias?.fromLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toLastUpdate && params.set('to-last-update', this.dateService.format(criterias?.toLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.countries?.forEach(country => params.append('country', country.id.toString()));
    criterias?.types?.forEach(type => params.append('type', type.name));

    return this.http.get<Person[]>(`${this.basePath}?${params.toString()}`, { observe: 'response' });
  }

  getPersonsWithMoviesNumber(page = 0, size = 50, term: string, sort = 'name', direction = 'asc', criterias?: Criterias) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? Direction.ASCENDING : Direction.DESCENDING);
    term && params.set('term', term);
    criterias?.fromBirthDate && params.set('from-birth-date', this.dateService.format(criterias.fromBirthDate, DateUtils.API_DATE_FORMAT));
    criterias?.toBirthDate && params.set('to-birth-date', this.dateService.format(criterias.toBirthDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromDeathDate && params.set('from-death-date', this.dateService.format(criterias.fromDeathDate, DateUtils.API_DATE_FORMAT));
    criterias?.toDeathDate && params.set('to-death-date', this.dateService.format(criterias.toDeathDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromCreationDate && params.set('from-creation-date', this.dateService.format(criterias?.fromCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toCreationDate && params.set('to-creation-date', this.dateService.format(criterias?.toCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.fromLastUpdate && params.set('from-last-update', this.dateService.format(criterias?.fromLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toLastUpdate && params.set('to-last-update', this.dateService.format(criterias?.toLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.countries?.forEach(country => params.append('country', country.id.toString()));
    criterias?.types?.forEach(type => params.append('type', type.name));

    return this.http.get<Person[]>(`${this.basePath}/movies-number?${params.toString()}`, { observe: 'response' });
  }

  getMovies(id: number, page = 0, size = 50, term: string, sort = 'title', direction = 'asc', criterias?: Criterias) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? Direction.ASCENDING : Direction.DESCENDING);
    term && params.set('term', term);
    criterias?.fromReleaseDate && params.set('start-release-date', this.dateService.format(criterias.fromReleaseDate, DateUtils.API_DATE_FORMAT));
    criterias?.toReleaseDate && params.set('end-release-date', this.dateService.format(criterias.toReleaseDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromCreationDate && params.set('start-creation-date', this.dateService.format(criterias?.fromCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toCreationDate && params.set('end-creation-date', this.dateService.format(criterias?.toCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.fromLastUpdate && params.set('start-last-update', this.dateService.format(criterias?.fromLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toLastUpdate && params.set('end-last-update', this.dateService.format(criterias?.toLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.countries?.forEach(country => params.append('country', country.id.toString()));
    criterias?.genres?.forEach(genre => params.append('genre', genre.id.toString()));

    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies?${params.toString()}`, { observe: 'response' })
  }

  getPhotoUrl(photoFileName: string) {
    return this.http.get(`${this.basePath}/photos/${photoFileName}`, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)) // Convertit le blob en URL locale utilisable dans <img>
    );
  }

  getCountries = (term: string, page = 0, size = 50, sort = 'nomFrFr', lang = Language.FR, direction = 'asc') =>
    this.http.get<Country[]>(`${this.basePath}/countries?page=${page}&size=${size}&sort=${sort}&lang=${lang}&direction=${direction == 'asc' ? Direction.ASCENDING : Direction.DESCENDING}&term=${term}`,
      { observe: 'response' }
    );

  save(person: Person) {
    return this.http.post<Person>(this.basePath, person);
  }

  update(imageFile: File, person: Person) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }

    if (person.dateOfBirth) {
      person.dateOfBirth = this.dateService.format(person.dateOfBirth, DateUtils.API_DATE_FORMAT);
    }

    if (person.dateOfDeath) {
      person.dateOfDeath = this.dateService.format(person.dateOfDeath, DateUtils.API_DATE_FORMAT);
    }

    formData.append('personDTO', new Blob([JSON.stringify(person)], { type: 'application/json' }));
    return this.http.put<Person>(`${this.basePath}/${person.id}`, formData);
  }

  addPersonType(id: number, personType: PersonType) {
    return this.http.patch<Person>(`${this.basePath}/${id}/types`, personType);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.basePath}/${id}`);
  }

}
