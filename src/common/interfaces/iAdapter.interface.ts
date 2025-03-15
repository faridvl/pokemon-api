export interface IAdapter {
  get<T>(url: string): Promise<T>;
}
