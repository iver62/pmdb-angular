export class Utils {

  static arraysEqual<T>(a: T[], b: T[]) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

}