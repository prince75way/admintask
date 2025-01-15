import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    // Get validation errors
    const errors = validationResult(req);
    
    // Check if there are any validation errors
    if (!errors.isEmpty()) {
      // If validation errors exist, throw an HTTP error with a 400 status code
      const data = { errors: errors.array() };
      throw createHttpError(400, "Validation error!", { data });
    }
    
    // If no validation errors, proceed to the next middleware
    next();
  }
);
