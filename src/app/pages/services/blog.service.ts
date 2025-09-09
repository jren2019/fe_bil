import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogSummary {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  slug: string;
}

export interface BlogDetail {
  id: string;
  title: string;
  date: string;
  author: string;
  image: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getBlogList(): Observable<BlogSummary[]> {
    // return this.http.get<BlogSummary[]>(`${this.baseUrl}/blog-list`);
    // Placeholder: API not ready yet
    return new Observable();
  }

  getBlogDetail(blogId: string): Observable<BlogDetail> {
    // return this.http.get<BlogDetail>(`${this.baseUrl}/blog/${blogId}`);
    // Placeholder: API not ready yet
    return new Observable();
  }
} 