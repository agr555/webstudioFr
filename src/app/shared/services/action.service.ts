import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { DefaultResponseType } from '../../../types/default-response.type';
import { environment } from '../../../environments/environment';
import { ActionType } from '../../../types/action.type';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  addAction(urlComment: string, action: string): Observable<DefaultResponseType> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments/${urlComment}/apply-action`,
      {
        action,
      },
      { headers },
    );// ,{withCredentials: true});
  }

  getActionForComment(urlOfComment: string): Observable<ActionType[] | DefaultResponseType> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<ActionType[] | DefaultResponseType>(
      `${environment.api}comments${urlOfComment}/actions`,
      { headers },
    ); // ,  {withCredentials: true});
  }

  getArticleCommentAction(urlOfArticle: string): Observable<ActionType[] | DefaultResponseType> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<ActionType[] | DefaultResponseType>(
      `${environment.api
      }comments/article-comment-actions?articleId=${urlOfArticle}`,
      { headers },
    );//       {withCredentials: true});
  }

  getArticleCommentAction1(urlOfArticle: string): Observable<ActionType[] | DefaultResponseType> {
    const headers: HttpHeaders = this.authService.getHeader();
    const params = new HttpParams()
      .set('articleId', urlOfArticle);
    return this.http.get<ActionType[] | DefaultResponseType>(
      `${environment.api
      }comments/article-comment-actions?${params}`,
      { headers },
    ); // ,  {withCredentials: true});
  }
}
