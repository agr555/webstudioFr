import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {ArticleType} from '../../../../types/article.type';
import {ArticleService} from '../../../shared/services/article.service';
import {AuthService} from '../../../core/auth/auth.service';
import {CategoryService} from '../../../shared/services/category.service';
import {environment} from '../../../../environments/environment';
import {ActiveParamsType} from '../../../../types/active-params.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {CommentsType} from '../../../../types/comments.type';
import {CommentParamsType} from '../../../../types/comment-params.type';
import {CommentService} from '../../../shared/services/comment.service';
import {ActionType} from '../../../../types/action.type';
import {ActionService} from '../../../shared/services/action.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  article!: ArticleType;

  actionForArticle: ActionType[] = [];

  commentsNext!: CommentsType;


  slice: number = 0;

  showMore: boolean = false;

  cursorMoreOff: boolean = false;

  articleRel: ArticleType[] = [];

  serverStaticPath = environment.serverStaticPath;

  activeParams: ActiveParamsType = {categories: []};

  isLogged: boolean = false;

  commentForm = this.fb.group({
    text: ['', Validators.required],
  });

  paramObject: CommentParamsType = {
    offset: 0,
    article: '',
  };

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService,
    private actionService: ActionService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private categoryService: CategoryService,
    // public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    // private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.getArticle();
  }

  getArticle() {
    this.activatedRoute.params.subscribe(params => {
      //GET article
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.slice = this.article.comments?.length || 0;
          this.showMore = false;
          (this.article.commentsCount <= 3) ? this.cursorMoreOff = true : this.cursorMoreOff = false;
          this.getActionForArticle();
        });
      //GET related articles
      this.articleService.getRelatedArticle(params['url'])
        .subscribe((dataRel: ArticleType[]) => {
          this.articleRel = dataRel;
        });
    });
  }

  getComments() {
    this.paramObject = {
      offset: this.slice,
      article: this.article!.id,
    };
    if (this.article && this.article.comments) {
      this.commentsNext = {allCount: this.article.commentsCount, comments: this.article.comments};
    }
    this.commentService.getCommentFromArticle(this.paramObject)
      .subscribe((commentData: CommentsType | DefaultResponseType) => {
        if ((commentData as DefaultResponseType).error !== undefined) {
          throw new Error((commentData as DefaultResponseType).message);
        }
        const data: CommentsType = commentData as CommentsType;

        if (data.comments) {
          this.commentsNext.comments!.push(...data.comments);
          this.slice += data.comments?.length || 0;
          this.showMore = true;
        }
        if (this.commentsNext.allCount && data.comments?.length && this.commentsNext.comments?.length && (this.commentsNext.allCount <= (this.commentsNext.comments?.length))) {
          this.cursorMoreOff = true;
        }
      });
    if (this.commentsNext && this.commentsNext.comments) {
      this.actionForArticle.forEach((itemC) => {
        this.commentsNext.comments?.forEach((item) => {
          if (item.id === itemC.comment) {
            if (itemC.action === 'like') {
              item.myLike = true;
            }
            if (itemC.action === 'dislike') {
              item.myDislike = true;
            }
            if (itemC.action === 'violate') {
              item.myViolate = true;
            }
          }
        });
      });
    }
  }

  addComment() {
    if (this.isLogged) {
      if (this.commentForm.valid && this.commentForm.value.text) {
        this.commentService.addComment(this.article.id, this.commentForm.value.text)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if (data.error) {
                this._snackBar.open(data.message);
                throw new Error(data.message);
              } else {
                this._snackBar.open('Данные успешно сохранены');
                this._snackBar.open(data.message);
                // this.getComments();
                this.getArticle();

                this.reset();
              }
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
                // this._snackBar.open(errorResponse.error);
              } else {
                this._snackBar.open('Ошибка сохранения!');
                this._snackBar.open(errorResponse.error.message);
                this._snackBar.open(errorResponse.error);
              }
            },
          });
      } else {
        this._snackBar.open('Для отправки комментария напишите что-нибудь');
      }
    } else {
      this._snackBar.open('Отправлять комментарии могут только зарегистрированные пользователи');
    }
  }

  addAction(urlComment: string, action: string) {
    if (this.isLogged) {
      if (this.authService.isLogged) {
        if (this.article && this.article.id) {
          this.actionService.addAction(urlComment, action)
            .subscribe({
              next: (data: DefaultResponseType) => {
                this.recount3LikesArticle(urlComment, action);
                this._snackBar.open('0');
                this._snackBar.open(data.message);
                if (data.error) {
                  throw new Error(data.message);
                } else {
                  this.getActionForArticle();

                  if (this.commentsNext && this.commentsNext.comments) {
                    this.recountLikes10Comments(urlComment, action);
                  }
                  if (action !== 'violate') {
                    this._snackBar.open(data.message);
                    this._snackBar.open('Ваш голос учтен');
                  } else {
                    this._snackBar.open('Жалоба отправлена');
                  }
                }
              },
              error: (errorResponse: HttpErrorResponse) => {
                if (errorResponse.error && errorResponse.error.message) {
                  if (action === 'violate') {
                    this._snackBar.open('Жалоба уже была отправлена');
                  }
                } else {
                  this._snackBar.open('Ошибка сохранения!');
                }
              },
            });
        }
      } else {
        this._snackBar.open('Отправлять комментарии могут только зарегистрированные пользователи');
      }
    }
    else {
      this._snackBar.open('Для этого действия нужно авторизоваться');
    }
  }

  recount3LikesArticle(urlComment: string, action: string) {
    if (this.article.comments) {
      this.article.comments?.forEach((item) => {
        // перезапись статусов страницы с 3 комментариями от самой статьи
        if (item.id === urlComment) {
          if (action === 'like') {
            if (!item.myLike && !item.myDislike) {
              item.myLike = true;// установить лайк
              this._snackBar.open('Спасибо за реакцию!');
              item.likesCount = item.likesCount ? item.likesCount + 1 : 1;
            } else if (!item.myLike && item.myDislike) {
              item.myLike = true;// установить лайк, но выкл дизлайк
              item.myDislike = false;
              item.likesCount = item.likesCount ? item.likesCount + 1 : 1;
              item.dislikesCount = item.dislikesCount ? item.dislikesCount - 1 : 0;
              this._snackBar.open(' Был выбран ранее лайк');
              // return 0;
            } else if (item.myLike) {
              item.myLike = false;// убрать
              item.likesCount = item.likesCount ? item.likesCount - 1 : 0;
              this._snackBar.open('Отмена выбора');
              // return 0;
            }
          } else if (action === 'dislike') {
            if (!item.myDislike && !item.myLike) {
              item.myDislike = true;// установить
              this._snackBar.open('Спасибо за реакцию!');
              item.dislikesCount = item.dislikesCount ? item.dislikesCount + 1 : 1;
              // return 0;
            } else if (!item.myDislike && item.myLike) {
              item.myDislike = true;
              item.myLike = false;// переключить
              item.likesCount = item.likesCount ? item.likesCount - 1 : 0;
              item.dislikesCount = item.dislikesCount ? item.dislikesCount + 1 : 1;
              this._snackBar.open(' Был выбран ранее дизлайк');
              // return 0;
            } else if (item.myDislike) {
              item.myDislike = false;// убрать
              this._snackBar.open(' Отмена выбора');
              item.dislikesCount = item.dislikesCount ? item.dislikesCount - 1 : 0;
              // но если был дизлайк- убрать дизлайк
            }
          } else if (action === 'violate') {
            if (!item.myViolate) {
              item.myViolate = true;
              this._snackBar.open('Жалоба  отправлена');
            } else {
              this._snackBar.open('Жалоба уже была отправлена');
            }
          }
        }
      });
    }
  }

  recountLikes10Comments(urlComment: string, action: string) {
    // this.actionForArticle.forEach(itemC => {
    this.commentsNext.comments?.forEach((item) => {
      // перезапись статусов страницы с 3 комментариями от самой статьи
      if (item.id === urlComment) {
        if (action === 'like') {
          if (!item.myLike && !item.myDislike) {
            item.myLike = true;// установить лайк
            this._snackBar.open('Спасибо за реакцию!');
            item.likesCount = item.likesCount ? item.likesCount + 1 : 1;
          } else if (!item.myLike && item.myDislike) {
            item.myLike = true;// установить лайк, но выкл дизлайк
            item.myDislike = false;
            item.likesCount = item.likesCount ? item.likesCount + 1 : 1;
            item.dislikesCount = item.dislikesCount ? item.dislikesCount - 1 : 0;
            this._snackBar.open(' Был выбран ранее лайк');
            // return 0;
          } else if (item.myLike) {
            item.myLike = false;// убрать
            item.likesCount = item.likesCount ? item.likesCount - 1 : 0;
            this._snackBar.open('Отмена выбора');
            // return 0;
          }
        } else if (action === 'dislike') {
          if (!item.myDislike && !item.myLike) {
            item.myDislike = true;// установить
            this._snackBar.open('Спасибо за реакцию!');
            item.dislikesCount = item.dislikesCount ? item.dislikesCount + 1 : 1;
            // return 0;
          } else if (!item.myDislike && item.myLike) {
            item.myDislike = true;
            item.myLike = false;// переключить
            item.likesCount = item.likesCount ? item.likesCount - 1 : 0;
            item.dislikesCount = item.dislikesCount ? item.dislikesCount + 1 : 1;
            this._snackBar.open(' Был выбран ранее дизлайк');
            // return 0;
          } else if (item.myDislike) {
            item.myDislike = false;// убрать
            this._snackBar.open(' Отмена выбора');
            item.dislikesCount = item.dislikesCount ? item.dislikesCount - 1 : 0;
            // но если был дизлайк- убрать дизлайк
          }
        } else if (action === 'violate') {
          if (!item.myViolate) {
            item.myViolate = true;
            this._snackBar.open('Жалоба  отправлена');
          } else {
            this._snackBar.open('Жалоба уже была отправлена');
          }
        }
      }
    });
  }

  getActionForArticle() {
    if (this.isLogged) {
      if (this.article && this.article.id) {
        this.actionService.getArticleCommentAction(this.article.id)
          .subscribe((dataArticleComm: ActionType[] | DefaultResponseType) => {
            if ((dataArticleComm as DefaultResponseType).error !== undefined) {
              const error = (dataArticleComm as DefaultResponseType).message;
              throw new Error(error);
            }
            this.actionForArticle = dataArticleComm as ActionType[];// data.items;
            this.actionForArticle.forEach((itemC) => {
              this.article.comments?.forEach((item) => {
                // set this.article.comments.myLike...
                if (item.id === itemC.comment) {
                  if (itemC.action === 'like') {
                    (item.myLike = true);
                  } else if (itemC.action === 'dislike') {
                    (item.myDislike = true);
                  } else if (itemC.action === 'violate') {
                    (item.myViolate = true);
                  }
                }
              });
            });
          });
      }
    }
  }

  reset() {
    this.commentForm.get('text')?.setValue('');
    this.commentForm.markAsPristine();// чистая
    this.commentForm.reset(); // will reset to null
  }
}
