export class LocalStorageService {
  private prefix = "[er-decision-making-tool]";

  public setItem<T>(key: string, data: T): void {
    const stringifyData = JSON.stringify(data);
    localStorage.setItem(`${this.prefix} ${key}`, stringifyData);
  }

  public getItem<T>(key: string): T | undefined {
    const data = localStorage.getItem(`${this.prefix} ${key}`);
    return data ? (JSON.parse(data) as T) : undefined;
  }

  public removeItem(key: string): void {
    localStorage.removeItem(`${this.prefix} ${key}`);
  }
}

export const localStorageService = new LocalStorageService();
