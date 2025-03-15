import axios, { AxiosInstance } from 'axios';
import { IAdapter } from '../interfaces/iAdapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements IAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error('error en el get de axios');
    }
  }
}
