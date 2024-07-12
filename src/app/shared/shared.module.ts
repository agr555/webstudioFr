import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { ShorterPipePipe } from './pipes/shorter-pipe.pipe';
import { HeadShorterPipePipe } from './pipes/head-shorter-pipe.pipe';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ArticleCardComponent,
    CategoryFilterComponent,
    ShorterPipePipe,
    HeadShorterPipePipe,
    LoaderComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule, MatSelectModule, FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    ArticleCardComponent,
    CategoryFilterComponent,
    ShorterPipePipe,
    HeadShorterPipePipe,
    LoaderComponent,

  ],

})
export class SharedModule {
}
