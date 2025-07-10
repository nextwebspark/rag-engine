import { User, LoginRequest, SignupRequest, ResetPasswordRequest, NewPasswordRequest, AuthTokens, AuthState, LoginResponse, Organization, UserRole, InviteUserRequest } from '../../../models/auth.types';

describe('Auth Types', () => {
  describe('Organization Interface', () => {
    it('should create a valid Organization object with required fields', () => {
      const org: Organization = {
        id: '123',
        name: 'Test Organization'
      };
      expect(org.id).toBeDefined();
      expect(org.name).toBeDefined();
    });

    it('should create a valid Organization object with optional fields', () => {
      const org: Organization = {
        id: '123',
        name: 'Test Organization',
        domain: 'test.com',
        logo: 'https://test.com/logo.png',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      expect(org.domain).toBeDefined();
      expect(org.logo).toBeDefined();
      expect(org.createdAt).toBeDefined();
      expect(org.updatedAt).toBeDefined();
    });
  });

  describe('User Interface', () => {
    it('should create a valid User object with required fields', () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        role: UserRole.USER,
        organizationId: 'org123',
        isActive: true
      };
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.role).toBe(UserRole.USER);
      expect(user.organizationId).toBeDefined();
      expect(user.isActive).toBeDefined();
    });

    it('should create a valid admin User object', () => {
      const user: User = {
        id: '123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        organizationId: 'org123',
        isActive: true,
        firstName: 'Admin',
        lastName: 'User',
        organization: {
          id: 'org123',
          name: 'Test Organization'
        }
      };
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.organization).toBeDefined();
    });
  });

  describe('LoginRequest Interface', () => {
    it('should create a valid LoginRequest object', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };
      expect(loginRequest.email).toBeDefined();
      expect(loginRequest.password).toBeDefined();
    });

    it('should accept optional rememberMe field', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      };
      expect(loginRequest.rememberMe).toBe(true);
    });
  });

  describe('LoginResponse Interface', () => {
    it('should create a valid LoginResponse object', () => {
      const loginResponse: LoginResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: UserRole.USER,
          organizationId: 'org123',
          isActive: true
        },
        expiresIn: 3600
      };
      expect(loginResponse.accessToken).toBeDefined();
      expect(loginResponse.refreshToken).toBeDefined();
      expect(loginResponse.user).toBeDefined();
      expect(loginResponse.expiresIn).toBeDefined();
    });
  });

  describe('SignupRequest Interface', () => {
    it('should create a valid SignupRequest object with required fields', () => {
      const signupRequest: SignupRequest = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        organizationName: 'Test Organization'
      };
      expect(signupRequest.email).toBeDefined();
      expect(signupRequest.password).toBeDefined();
      expect(signupRequest.confirmPassword).toBeDefined();
      expect(signupRequest.organizationName).toBeDefined();
    });

    it('should accept optional fields', () => {
      const signupRequest: SignupRequest = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        organizationName: 'Test Organization',
        firstName: 'John',
        lastName: 'Doe',
        organizationDomain: 'test.com'
      };
      expect(signupRequest.firstName).toBeDefined();
      expect(signupRequest.lastName).toBeDefined();
      expect(signupRequest.organizationDomain).toBeDefined();
    });
  });

  describe('InviteUserRequest Interface', () => {
    it('should create a valid InviteUserRequest object with required fields', () => {
      const inviteRequest: InviteUserRequest = {
        email: 'newuser@example.com',
        role: UserRole.USER
      };
      expect(inviteRequest.email).toBeDefined();
      expect(inviteRequest.role).toBeDefined();
    });

    it('should create a valid InviteUserRequest object with optional fields', () => {
      const inviteRequest: InviteUserRequest = {
        email: 'newuser@example.com',
        role: UserRole.USER,
        firstName: 'John',
        lastName: 'Doe'
      };
      expect(inviteRequest.firstName).toBeDefined();
      expect(inviteRequest.lastName).toBeDefined();
    });
  });

  describe('ResetPasswordRequest Interface', () => {
    it('should create a valid ResetPasswordRequest object', () => {
      const resetRequest: ResetPasswordRequest = {
        email: 'test@example.com'
      };
      expect(resetRequest.email).toBeDefined();
    });
  });

  describe('NewPasswordRequest Interface', () => {
    it('should create a valid NewPasswordRequest object', () => {
      const newPasswordRequest: NewPasswordRequest = {
        token: 'reset-token',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123'
      };
      expect(newPasswordRequest.token).toBeDefined();
      expect(newPasswordRequest.newPassword).toBeDefined();
      expect(newPasswordRequest.confirmPassword).toBeDefined();
    });
  });

  describe('AuthTokens Interface', () => {
    it('should create a valid AuthTokens object', () => {
      const tokens: AuthTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      };
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBeDefined();
    });
  });

  describe('AuthState Interface', () => {
    it('should create a valid initial AuthState object', () => {
      const authState: AuthState = {
        user: null,
        organization: null,
        tokens: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        isAdmin: false
      };
      expect(authState.user).toBeNull();
      expect(authState.organization).toBeNull();
      expect(authState.tokens).toBeNull();
      expect(authState.loading).toBeDefined();
      expect(authState.error).toBeNull();
      expect(authState.isAuthenticated).toBeDefined();
      expect(authState.isAdmin).toBeDefined();
    });

    it('should create a valid authenticated admin AuthState object', () => {
      const authState: AuthState = {
        user: {
          id: '123',
          email: 'admin@example.com',
          role: UserRole.ADMIN,
          organizationId: 'org123',
          isActive: true
        },
        organization: {
          id: 'org123',
          name: 'Test Organization'
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          expiresIn: 3600
        },
        loading: false,
        error: null,
        isAuthenticated: true,
        isAdmin: true
      };
      expect(authState.user).toBeDefined();
      expect(authState.organization).toBeDefined();
      expect(authState.tokens).toBeDefined();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.isAdmin).toBe(true);
    });
  });
}); 