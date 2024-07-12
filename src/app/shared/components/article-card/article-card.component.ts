import {Component, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../../environments/environment';
import {PopArticleType} from '../../../../types/pop-article.type';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent {
  serverStaticPath = environment.serverStaticPath;

  @Input() article!: PopArticleType;

  isLogged: boolean = false;

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {}
}
