export class apiError extends Error {
  statusCode: number;
  message: string;
  success: boolean;
  stack?: string | undefined;

  constructor(
    statusCode: number,
    message: string = "Something Went Wrong",
    stack: string = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.message = message),
      (this.success = false);
    stack
      ? (this.stack = stack)
      : Error.captureStackTrace(this, this.constructor);
  }
}

export class apiResponse {
  statusCode: number;
  message: string;
  data: any;
  success: boolean;

  constructor(statusCode: number, message: string = "Successfull", data: any) {
    this.message = message;
    (this.statusCode = statusCode), (this.success = statusCode < 400);
    this.data = data;
  }
}

import { NextFunction, Request, Response } from "express";

export const asyncHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((err) => next(err));
  };
};
