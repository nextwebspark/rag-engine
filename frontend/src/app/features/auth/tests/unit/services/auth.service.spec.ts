import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../../services/auth.service';
import {
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
  Organization,
  AuthTokens,
} from '../../../models/auth.types';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockOrg: Organization = {
    id: 'org1',
    name: 'Mock Organization',
    domain: 'mock.com',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUser: User = {
    id: 'user1',
    email: 'user@example.com',
    firstName: 'Mock',
    lastName: 'User',
    role: UserRole.ADMIN,
    organizationId: 'org1',
    organization: mockOrg,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
    expiresIn: Date.now() + 3600 * 1000,
    user: mockUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store user/tokens/organization', () => {
    const credentials: LoginRequest = {
      email: 'user@example.com',
      password: 'password'
    };

    service.login(credentials).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service['currentUserSubject'].value).toEqual(mockUser);
      expect(service['isAuthenticatedSubject'].value).toBeTrue();
      expect(service['isAdminSubject'].value).toBeTrue();

      const storedUser = JSON.parse(localStorage.getItem('user')!);
      const storedOrg = JSON.parse(localStorage.getItem('organization')!);
      const storedTokens = JSON.parse(localStorage.getItem('auth_tokens')!);

      expect(storedUser.email).toBe(mockUser.email);
      expect(storedOrg.id).toBe(mockOrg.id);
      expect(storedTokens.accessToken).toBe(mockLoginResponse.accessToken);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });

  it('should logout and clear all stored data', () => {
    localStorage.setItem('auth_tokens', JSON.stringify(mockLoginResponse));
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('organization', JSON.stringify(mockOrg));

    service.logout();

    expect(localStorage.getItem('auth_tokens')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('organization')).toBeNull();

    expect(service['currentUserSubject'].value).toBeNull();
    expect(service['isAuthenticatedSubject'].value).toBeFalse();

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should refresh token and store new tokens', () => {
    const storedTokens: AuthTokens = {
      accessToken: 'old',
      refreshToken: 'mockRefreshToken',
      expiresIn: Date.now() - 1000
    };
    localStorage.setItem('auth_tokens', JSON.stringify(storedTokens));

    const newTokens: AuthTokens = {
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      expiresIn: Date.now() + 3600 * 1000
    };

    service.refreshToken().subscribe(tokens => {
      expect(tokens.accessToken).toBe('newAccessToken');
      const stored = JSON.parse(localStorage.getItem('auth_tokens')!);
      expect(stored.accessToken).toBe('newAccessToken');
    });

    const req = httpMock.expectOne('/api/auth/refresh-token');
    expect(req.request.method).toBe('POST');
    req.flush(newTokens);
  });

  it('should return current user from /me', () => {
    service.getCurrentUser().subscribe(user => {
      expect(user.id).toBe(mockUser.id);
      expect(service['currentUserSubject'].value).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should emit error on failed login', () => {
    const credentials: LoginRequest = {
      email: 'fail@example.com',
      password: 'wrong'
    };

    service.login(credentials).subscribe({
      error: (err) => {
        expect(err.message).toBe('Invalid login');
      }
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ message: 'Invalid login' }, { status: 401, statusText: 'Unauthorized' });
  });
});

