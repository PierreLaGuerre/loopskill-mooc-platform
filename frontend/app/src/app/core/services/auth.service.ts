import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_ADMIN_USER, MOCK_USER } from '../mocks/mock-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_CURRENT_USER_KEY = 'loopskill_current_user';
  private readonly STORAGE_USERS_KEY = 'loopskill_users';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    this.initializeUsers();

    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const users = this.getUsers();

    const foundUser = users.find(
      (user) =>
        user.email.trim().toLowerCase() === normalizedEmail &&
        user.password === normalizedPassword
    );

    if (foundUser != null) {
      this.setCurrentUser(foundUser);
      return true;
    } else {
      return false;
    }
  }

  register(
    name: string,
    email: string,
    password: string,
    clientType: string
  ): boolean {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const users = this.getUsers();

    const existingUser = users.find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    );

    if (existingUser != null) {
      return false;
    }

    const newUser: User = {
      id: this.generateNextId(users),
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      role: 'student',
      clientType: clientType,
      planId: 1,
      interests: []
    };

    const updatedUsers: User[] = [...users, newUser];

    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    this.setCurrentUser(newUser);

    return true;
  }

  updateCurrentUserInterests(interests: string[]): void {
    const currentUser = this.getCurrentUser();

    if (currentUser == null) {
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      interests: interests
    };

    this.persistUpdatedUser(updatedUser);
  }

  updateCurrentUserPlan(planId: number): void {
    const currentUser = this.getCurrentUser();

    if (currentUser == null) {
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      planId: planId
    };

    this.persistUpdatedUser(updatedUser);
  }

  updateCurrentUserProfile(name: string, email: string): boolean {
    const currentUser = this.getCurrentUser();

    if (currentUser == null) {
      return false;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const users = this.getUsers();

    const existingUser = users.find(
      (user) =>
        user.email.trim().toLowerCase() === normalizedEmail &&
        user.id !== currentUser.id
    );

    if (existingUser != null) {
      return false;
    }

    const updatedUser: User = {
      ...currentUser,
      name: normalizedName,
      email: normalizedEmail
    };

    this.persistUpdatedUser(updatedUser);
    return true;
  }

  updateCurrentUserPassword(currentPassword: string, newPassword: string): boolean {
    const currentUser = this.getCurrentUser();

    if (currentUser == null) {
      return false;
    }

    const normalizedCurrentPassword = currentPassword.trim();
    const normalizedNewPassword = newPassword.trim();

    if (currentUser.password !== normalizedCurrentPassword) {
      return false;
    }

    const updatedUser: User = {
      ...currentUser,
      password: normalizedNewPassword
    };

    this.persistUpdatedUser(updatedUser);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUser$;
  }

  isLoggedIn(): boolean {
    if (this.currentUserSubject.value != null) {
      return true;
    } else {
      return false;
    }
  }

  private initializeUsers(): void {
    const storedUsers = localStorage.getItem(this.STORAGE_USERS_KEY);

    if (storedUsers == null) {
      const initialUsers: User[] = [MOCK_USER, MOCK_ADMIN_USER];
      localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(initialUsers));
    }
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.STORAGE_USERS_KEY);

    if (usersJson != null) {
      return JSON.parse(usersJson) as User[];
    } else {
      return [];
    }
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_CURRENT_USER_KEY);

    if (userJson != null) {
      return JSON.parse(userJson) as User;
    } else {
      return null;
    }
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private persistUpdatedUser(updatedUser: User): void {
    const users = this.getUsers();
    const updatedUsers = users.map((user) => {
      if (user.id === updatedUser.id) {
        return updatedUser;
      } else {
        return user;
      }
    });

    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(this.STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }

  private generateNextId(users: User[]): number {
    if (users.length === 0) {
      return 1;
    } else {
      const ids = users.map((user) => user.id);
      return Math.max(...ids) + 1;
    }
  }
}