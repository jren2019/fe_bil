import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // return this.http.post(`${this.baseUrl}/login`, { username, password });
    // Placeholder: always fail for now
    return throwError(() => new Error('Login failed'));
  }

  signup(data: any): Observable<any> {
    // return this.http.post(`${this.baseUrl}/signup`, data);
    // Placeholder: always succeed for now
    return of({ success: true });
  }
} 