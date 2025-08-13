import type HttpStatus from 'http-status';
export default class VError extends Error {
  constructor(name: string, code?: number, data?: any);

  public static HTTP_STATUS: HttpStatus.HttpStatus;

  public name: string;

  public code: number;

  public data: any;

  public dateTime: Date;
}
