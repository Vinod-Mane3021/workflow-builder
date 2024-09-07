import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "./api-response";
import { HttpStatus, HttpStatusCode } from "../constants/http-status";

/**
 * @param {Function} fun - The asynchronous controller function to be wrapped.
 * @returns - An Express middleware function that handles asynchronous errors.
 */
const asyncHandler = (fun: Function) => {
  // extract req, res and next
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Call the wrapped asynchronous controller function
      await fun(req, res, next);
    } catch (error: any) {
      // Handle any errors that occur during the execution of the controller function
      console.log("Error : ", error);
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        status: HttpStatus.SERVER_ERROR,
        message: "Something went wrong, please try again later",
      });
    }
  };
};

export { asyncHandler };
