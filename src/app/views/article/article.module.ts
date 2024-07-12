import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ArticleRoutingModule } from './article-routing.module';
import { DetailComponent } from './detail/detail.component';
import { BlogComponent } from './blog/blog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BlogComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
  ],
})
export class ArticleModule {
}
