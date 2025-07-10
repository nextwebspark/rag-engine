import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  User, 
  LoginRequest, 
  SignupRequest, 
  ResetPasswordRequest, 
  NewPasswordRequest, 
  LoginResponse,
  AuthTokens,
  InviteUserRequest,
  Organization,
  UserRole
} from '../models/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_tokens';
  private readonly USER_KEY = 'user';
  private readonly ORG_KEY = 'organization';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentOrganizationSubject = new BehaviorSubject<Organization | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  currentOrganization$ = this.currentOrganizationSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  // Initialize service state from localStorage
  private initializeFromStorage(): void {
    try {
      const tokens = this.getStoredTokens();
      const user = this.getStoredUser();
      const org = this.getStoredOrganization();

      if (tokens && user) {
        this.currentUserSubject.next(user);
        this.currentOrganizationSubject.next(org);
        this.isAuthenticatedSubject.next(true);
        this.isAdminSubject.next(user.role === UserRole.ADMIN);
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.logout();
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<User> {
    this.isLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      map(response => response.user),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Signup
  signup(signupData: SignupRequest): Observable<User> {
    this.isLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/signup`, signupData).pipe(
      tap(response => this.handleAuthSuccess(response)),
      map(response => response.user),
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => new Error(error.error?.message || 'Signup failed'));
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Logout
  logout(): void {
    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ORG_KEY);

    // Reset subjects
    this.currentUserSubject.next(null);
    this.currentOrganizationSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.isAdminSubject.next(false);

    // Call logout endpoint
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      error: error => console.error('Logout error:', error)
    });
  }

  // Request password reset
  requestPasswordReset(request: ResetPasswordRequest): Observable<void> {
    this.isLoadingSubject.next(true);

    return this.http.post<void>(`${this.API_URL}/forgot-password`, request).pipe(
      catchError(error => {
        console.error('Password reset request error:', error);
        return throwError(() => new Error(error.error?.message || 'Password reset request failed'));
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Reset password
  resetPassword(request: NewPasswordRequest): Observable<void> {
    this.isLoadingSubject.next(true);

    return this.http.post<void>(`${this.API_URL}/reset-password`, request).pipe(
      catchError(error => {
        console.error('Password reset error:', error);
        return throwError(() => new Error(error.error?.message || 'Password reset failed'));
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Refresh token
  refreshToken(): Observable<AuthTokens> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthTokens>(`${this.API_URL}/refresh-token`, {
      refreshToken: tokens.refreshToken
    }).pipe(
      tap(newTokens => this.storeTokens(newTokens)),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  // Invite user
  inviteUser(invitation: InviteUserRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/invite`, invitation).pipe(
      catchError(error => {
        console.error('User invitation error:', error);
        return throwError(() => new Error(error.error?.message || 'Invitation failed'));
      })
    );
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isAdminSubject.next(user.role === UserRole.ADMIN);
      }),
      catchError(error => {
        console.error('Get current user error:', error);
        return throwError(() => new Error('Failed to fetch user profile'));
      })
    );
  }

  // Token management
  private handleAuthSuccess(response: LoginResponse): void {
    this.storeTokens(response);
    this.storeUser(response.user);
    this.storeOrganization(response.user.organization || null);

    this.currentUserSubject.next(response.user);
    this.currentOrganizationSubject.next(response.user.organization || null);
    this.isAuthenticatedSubject.next(true);
    this.isAdminSubject.next(response.user.role === UserRole.ADMIN);
  }

  private storeTokens(response: LoginResponse | AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn
    }));
  }

  private getStoredTokens(): AuthTokens | null {
    const tokens = localStorage.getItem(this.TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private storeOrganization(org: Organization | null): void {
    if (org) {
      localStorage.setItem(this.ORG_KEY, JSON.stringify(org));
    } else {
      localStorage.removeItem(this.ORG_KEY);
    }
  }

  private getStoredOrganization(): Organization | null {
    const org = localStorage.getItem(this.ORG_KEY);
    return org ? JSON.parse(org) : null;
  }
} 