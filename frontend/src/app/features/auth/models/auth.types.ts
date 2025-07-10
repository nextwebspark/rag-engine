/**
 * Organization interface representing company/team data
 */
export interface Organization {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

/**
 * Core user interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  organizationId: string;
  organization?: Organization;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Login request payload interface
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login response interface containing auth tokens and user data
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

/**
 * Signup request payload interface
 */
export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword: string;
  organizationName: string;
  organizationDomain?: string;
}

/**
 * Password reset request payload interface
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * New password request payload interface for completing password reset
 */
export interface NewPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Auth tokens interface
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Auth state interface for state management
 */
export interface AuthState {
  user: User | null;
  organization: Organization | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

/**
 * Invite user request payload interface
 */
export interface InviteUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
} 