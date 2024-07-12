import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of, Subject, throwError} from 'rxjs';
import { DefaultResponseType } from '../../../types/default-response.type';
import { LoginResponseType } from '../../../types/login-response.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';

  public refreshTokenKey: string = 'refreshToken';

  public userIdKey: string = 'userIdToken';

  public isLogged$: Subject<boolean> = new Subject<boolean>();

  public isLogged: boolean = false;

  public isLoggedName: string = '';///

  // public userName: string = '';///
  public userNameKey: string = 'userName';///

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(`${environment.api}login`, {
      email, password, rememberMe,
    });
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(`${environment.api}signup`, {
      name, email, password,
    });
  }

  getInfo(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();// вдруг захотим вынести отдельно (хотя можно и из LocalStorage)
    if (tokens && tokens.refreshToken) {
      return this.http.get<DefaultResponseType | LoginResponseType>(`${environment.api}users`);
    }
  return of({
    error: true,
    message: 'Не найден токен!'
  })
    // throw throwError(() => 'Can not find token');
  }///

  /// Al
  getUserInfo(): Observable<LoginResponseType | DefaultResponseType> {
    const token: string = this.getTokens().accessToken as string;
    let headers: HttpHeaders = new HttpHeaders();
    if (token) {
      headers = headers.set('x-auth', token);
    }
    return this.http.get<LoginResponseType | DefaultResponseType>(`${environment.api}users`, { headers });
  }

  getHeader(): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    const token: string = this.getTokens().accessToken as string;
    if (token) {
      headers = headers.set('x-auth', token);
    }
    return headers;
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();// вдруг захотим вынести отдельно (хотя можно и из LocalStorage)
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(`${environment.api}logout`, {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Can not find token');
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(`${environment.api}refresh`, {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Can non use token.');
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  public getIsLoggedInName() {
    // console.log(this.userName);
    return this.userName;
  }///

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userNameKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  get userName(): null | string {
    return localStorage.getItem(this.userNameKey);
  }///

  set userName(name: null | string) {
    if (name) {
      localStorage.setItem(this.userNameKey, name);
      console.log(name);
      console.log(localStorage);
    } else {
      localStorage.removeItem(this.userNameKey);
    }
  }///

  set userId(id: null | string) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }
}
