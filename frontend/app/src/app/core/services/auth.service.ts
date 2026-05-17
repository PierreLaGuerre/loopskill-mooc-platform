import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  AuthUserResponse,
  SettingsResponse,
  TagsResponse
} from '../models/auth-api.model';
import { Plan } from '../models/plan.model';
import { ClientType, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = environment.apiUrl;

  private readonly STORAGE_CURRENT_USER_KEY = 'loopskill_current_user';
  private readonly STORAGE_TOKEN_KEY = 'loopskill_auth_token';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthUserResponse>(`${this.apiUrl}/auth/login`, {
        email: email.trim().toLowerCase(),
        password: password.trim()
      })
      .pipe(
        tap((response) => {
          this.storeSession(response);
        }),
        map((response) => response.user),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    clientType: ClientType,
    interests: string[] = []
  ): Observable<User> {
    return this.http
      .post<AuthUserResponse>(`${this.apiUrl}/auth/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        clientType: clientType,
        interests: interests
      })
      .pipe(
        tap((response) => {
          this.storeSession(response);
        }),
        map((response) => response.user),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  loadCurrentUserFromToken(): Observable<User | null> {
    const token = this.getToken();

    if (token == null) {
      this.clearSession();
      return of(null);
    }

    return this.http
      .get<AuthUserResponse>(`${this.apiUrl}/auth/me`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        tap((response) => {
          this.setCurrentUser(response.user);

          if (response.token != null) {
            this.setToken(response.token);
          }
        }),
        map((response) => response.user),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  updateCurrentUserProfile(name: string, email: string): Observable<User> {
    return this.http
      .patch<AuthUserResponse>(
        `${this.apiUrl}/auth/profile`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase()
        },
        {
          headers: this.getAuthHeaders()
        }
      )
      .pipe(
        tap((response) => {
          this.setCurrentUser(response.user);

          if (response.token != null) {
            this.setToken(response.token);
          }
        }),
        map((response) => response.user),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateCurrentUserPassword(
    currentPassword: string,
    newPassword: string
  ): Observable<ApiSuccessResponse> {
    return this.http
      .patch<ApiSuccessResponse>(
        `${this.apiUrl}/auth/password`,
        {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim()
        },
        {
          headers: this.getAuthHeaders()
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateCurrentUserInterests(interests: string[]): Observable<User> {
    return this.http
      .patch<AuthUserResponse | ApiSuccessResponse>(
        `${this.apiUrl}/auth/interests`,
        {
          interests: interests
        },
        {
          headers: this.getAuthHeaders()
        }
      )
      .pipe(
        tap((response) => {
          const currentUser = this.getCurrentUser();

          if ('user' in response) {
            this.setCurrentUser(response.user);
          } else if (currentUser != null) {
            this.setCurrentUser({
              ...currentUser,
              interests: interests
            });
          }
        }),
        map((response) => {
          if ('user' in response) {
            return response.user;
          }

          const currentUser = this.getCurrentUser();

          if (currentUser == null) {
            throw new Error('No authenticated user found');
          }

          return currentUser;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getAvailableInterests(): Observable<string[]> {
    return this.http
      .get<TagsResponse>(`${this.apiUrl}/auth/tags`)
      .pipe(
        map((response) => {
          return response.data.tags.map((tag) => tag.name);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getSettings(): Observable<{ user: User; interests: string[]; plans: Plan[] }> {
    return this.http
      .get<SettingsResponse>(`${this.apiUrl}/auth/settings`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        tap((response) => {
          this.setCurrentUser(response.data.user);
        }),
        map((response) => ({
          user: response.data.user,
          interests: response.data.tags.map((tag) => tag.name),
          plans: response.data.plans
        })),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getPlans(): Observable<Plan[]> {
    return this.http
      .get<{ success: boolean; message: string; data: { plans: Plan[] } }>(`${this.apiUrl}/plans`)
      .pipe(map((response) => response.data.plans));
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/auth');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUser$;
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    if (this.getToken() != null && this.currentUserSubject.value != null) {
      return true;
    } else {
      return false;
    }
  }

  private storeSession(response: AuthUserResponse): void {
    if (response.token != null) {
      this.setToken(response.token);
    }

    this.setCurrentUser(response.user);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.STORAGE_TOKEN_KEY, token);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    if (token == null) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_CURRENT_USER_KEY);

    if (userJson == null) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch {
      localStorage.removeItem(this.STORAGE_CURRENT_USER_KEY);
      return null;
    }
  }

  private setCurrentUser(user: User): void {
    const normalizedUser: User = {
      ...user,
      interests: user.interests ?? []
    };

    localStorage.setItem(this.STORAGE_CURRENT_USER_KEY, JSON.stringify(normalizedUser));
    this.currentUserSubject.next(normalizedUser);
  }

  private clearSession(): void {
    localStorage.removeItem(this.STORAGE_CURRENT_USER_KEY);
    localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
}
