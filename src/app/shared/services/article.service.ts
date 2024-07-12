import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PopArticleType } from '../../../types/pop-article.type';
import { environment } from '../../../environments/environment';
import { ActiveParamsType } from '../../../types/active-params.type';
import { ArticlesType } from '../../../types/articles.type';
import { ArticleType } from '../../../types/article.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient) {
  }

  getPopArticles(): Observable<PopArticleType[]> {
    return this.http.get<PopArticleType[]>(`${environment.api}articles/top`); // http://localhost:3000/api/products/best
  }

  getArticles(params: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(`${environment.api}articles`, { params });
  }

  getArticle(urlOfArticle: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(`${environment.api}articles/${urlOfArticle}`);// 6_saitov_dlya_povisheniya__produktivnosti');
  }

  getRelatedArticle(urlOfArticle: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(`${environment.api}articles/related/${urlOfArticle}`);// 6_saitov_dlya_povisheniya__produktivnosti');
  }
}
