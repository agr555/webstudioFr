import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
import {  FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AppliedFilterType } from '../../../../types/applied-filter.type';
import { ArticleService } from '../../../shared/services/article.service';
import { ActiveParamsType } from '../../../../types/active-params.type';
import { CategoryType } from '../../../../types/category.type';
import { CategoryService } from '../../../shared/services/category.service';
import { ActiveParamsUtil } from '../../../shared/utils/active-params.util';
import { ArticlesType } from '../../../../types/articles.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  @Input() selected!: string;

  filteringOpen: boolean = false;

  @Output() selectedChange = new EventEmitter<string>();

  articles!: ArticlesType;

  service: string = '';

  categories: CategoryType[] = [];
  formGroup: CategoryType[] = [];

  activeParams: ActiveParamsType = { categories: [] };

  pages: number[] = [];

/*  orderForm = this.fb.group({
    service: [''],
  });*/

  appliedFilters: AppliedFilterType[] = [];

  constructor(
private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private categoryService: CategoryService,
              // public dialog: MatDialog,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
        //     console.log(this.categories);

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500),
          )
          .subscribe((params) => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            //     console.log(this.activeParams )

            this.appliedFilters = [];
            this.activeParams.categories.forEach((url) => {
              for (let i = 0; i < this.categories.length; i++) {
                const foundCategory = this.categories[i].url === url ? this.categories[i] : null;
                if (foundCategory) {
                  this.appliedFilters.push({
                    name: foundCategory.name,
                    urlParam: foundCategory.url,
                  });
                }
              }
            });
            //      console.log(this.appliedFilters)

            this.articleService.getArticles(this.activeParams)
              .subscribe({
                next: (data: ArticlesType) => {
                  this.pages = [];
                  for (let i = 1; i <= data.pages; i++) {
                    this.pages.push(i);
                  }

                  this.articles = data as ArticlesType;// data.items;
                  //        console.log(this.articles);
                },
              });
          });
      });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter((item) => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams,
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams,
    });
  }

  toggleFiltering() {
    this.filteringOpen = !this.filteringOpen;
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      // console.log(this.activeParams.page)

      this.router.navigate(['/articles'], {
        queryParams: this.activeParams,
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/articles'], {
        queryParams: this.activeParams,
      });
      //   console.log(this.selected)
    }
  }

}
