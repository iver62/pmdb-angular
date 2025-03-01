import { Person } from "../models";

export class PersonUtils {

  static calculateAge(person: Person): number | null {
    if (!person.dateOfBirth) return null;

    const birthDate = new Date(person.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  static toLightPerson(person: Person): Person {
    return {
      id: person?.id,
      name: person.name,
      photoFileName: person?.photoFileName
    }
  }
}