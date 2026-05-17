import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthService } from './auth.service';

export interface CheckoutResponse {
  checkoutUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createPlanCheckout(planId: number): Observable<CheckoutResponse> {
    return this.createCheckout({
      type: 'plan',
      planId
    });
  }

  createCourseCheckout(courseId: number): Observable<CheckoutResponse> {
    return this.createCheckout({
      type: 'course',
      courseId
    });
  }

  cancelSubscription(): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${this.apiUrl}/payments/subscription/cancel`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(map(() => undefined));
  }

  redirectToCheckout(checkoutUrl: string): void {
    window.location.href = checkoutUrl;
  }

  private createCheckout(payload: Record<string, unknown>): Observable<CheckoutResponse> {
    return this.http
      .post<ApiResponse<CheckoutResponse>>(
        `${this.apiUrl}/payments/checkout`,
        payload,
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.data));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (token == null) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
