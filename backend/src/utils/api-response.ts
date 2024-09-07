import { HttpStatus, HttpStatusCode } from "../constants/http-status";
import { Response } from "express";

type ApiResponseType = {
  statusCode: HttpStatusCode;
  status: HttpStatus;
  message: string;
  data?: Object;
};

/**
 * ApiResponse class represents a standardized response structure for API responses.
 * It includes status code, status, message, an optional data object
 * and a method to send the response to the client.
 */
class ApiResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: Object;
  response: Response;

  /**
   * Constructs an ApiResponse object with the provided parameters.
   * @param statusCode - HTTP status code for the response.
   * @param status - Status indicator (e.g., 'SUCCESS', 'FAILED').
   * @param message - A descriptive message associated with the response.
   * @param data - Optional data object to include in the response.
   */
  constructor(
    response: Response,
    { statusCode, status, message, data }: ApiResponseType
  ) {
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.data = data;
    this.response = response;

    this.sendResponse();
  }

  /**
   * Sends the ApiResponse as a JSON response to the provided Express response object.
   * @param {Response} res - Express response object to send the ApiResponse.
   */
  sendResponse() {
    this.response.status(this.statusCode).json({
      statusCode: this.statusCode,
      status: this.status,
      message: this.message,
      data: this.data,
    });
  }
}

export { ApiResponse };
