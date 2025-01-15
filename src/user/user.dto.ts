export interface CreateUserDTO {
        _id: string; // Unique identifier
        name: string; // Full name of the user
        email: string; // Email address of the user
        password: string; // Hashed password
        role: 'Admin' | 'User'; // User role
      }
      
      
      export interface ResetPasswordDTO {
        email: string; // Reset token
        newPassword: string; // New password
      }
    
      