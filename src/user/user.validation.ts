
import { body } from 'express-validator';


export const loginUser = [
    body('email').isString(),
    body('password').isString(),
];

export const updatePassword = [
  
    body("currentPassword").isString(),
    body("newPassword").isString()
]
  export const blockUser = [
    body("userId").notEmpty().withMessage("User ID is required."),
    body("block").isBoolean().withMessage("Block must be a boolean value."),
  ];
  
  export const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
  ];
 