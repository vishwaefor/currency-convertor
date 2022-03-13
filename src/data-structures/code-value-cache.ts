export class CodeValueCache<V> {
  private cache: { [key: string]: V } = {};

  addValue(code: string, value: V) {
    this.cache[code] = value;
  }

  findValue(key: string): V | undefined {
    return this.cache[key];
  }
}
