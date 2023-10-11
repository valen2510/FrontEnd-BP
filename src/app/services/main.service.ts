import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class MainService {
  private baseUrl = environment.api;
  public httpOptions = {
    headers: new HttpHeaders({
      authorId: 478,
    }),
  };

  constructor(private http: HttpClient) {}

  getPosts(api: String): Observable<any> {
    return this.http.get(`${this.baseUrl}${api}`, this.httpOptions);
  }

  postPost({ api, data }: { api: String; data: Object }): Observable<any> {
    return this.http.post(`${this.baseUrl}${api}`, data, this.httpOptions);
  }

  updatePost({ api, data }: { api: String; data: Object }): Observable<any> {
    return this.http.put(`${this.baseUrl}${api}`, data, this.httpOptions);
  }

  deletePost(api: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}${api}`, this.httpOptions);
  }
}
