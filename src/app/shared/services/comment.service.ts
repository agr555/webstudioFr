import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponseType } from '../../../types/default-response.type';
import { environment } from '../../../environments/environment';
import { CommentsType } from '../../../types/comments.type';
import { CommentParamsType } from '../../../types/comment-params.type';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  addComment(article: string, text: string): Observable<DefaultResponseType> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments`,
      {
        text,
        article,
      },
      { headers },
    );// ,{withCredentials: true});
  }

  /*  getComments(param: CommentParamsType): Observable<CommentsType > {
      // return this.http.get<CommentsType| DefaultResponseType>(environment.api + 'comments?offset=2&article=662fd807c7238961d3a3986b'//+ {params: params},
  /!*    const headers: HttpHeaders = this.authService.getHeader();
      const params: HttpParams = new HttpParams()
        .set ('offset', param.offset!)
        .set ('article', param.article)
      console.log(param.article);
      console.log(params);*!/
      return this.http.get<CommentsType >(environment.api + 'comments', {params: param}
      );// ,{headers: headers});
      // ,  {withCredentials: true});
    }

    getComment(article: string): Observable<CommentsType | DefaultResponseType> {
      return this.http.get<CommentsType | DefaultResponseType>(environment.api  + 'comments');
    }

    //  добавить userId в строку запроса, например: home/position?userId=133r4322r34
    // const params = new HttpParams().set('userId', '133r4322r34'); return this.http.get(url, { params }) */

  getCommentFromArticle(params: CommentParamsType): Observable<CommentsType | DefaultResponseType> {
    // console.log(params)
    return this.http.get<CommentsType | DefaultResponseType>(`${environment.api}comments`, { params });
    // ,  {withCredentials: true});//6_saitov_dlya_povisheniya__produktivnosti');
  }
}
