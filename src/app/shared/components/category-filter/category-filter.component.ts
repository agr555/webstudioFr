import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../utils/active-params.util";
import {CategoryType} from "../../../../types/category.type";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  @Input() category!: CategoryType;
  @Input() index!: number;
  @Output() filteringOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  active: boolean = false;
  activeParams: ActiveParamsType = {categories: []}; // все параметры опциональны, кроме типа, который передается всегда, пустой массив

  // selected: string = 'Копирайтинг';

  constructor(private router: Router, private activateRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activateRouter.queryParams.subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        if (params['categories']) {
          this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        }
        if (this.category && this.activeParams.categories.some(url => this.category.url === url)) {
          this.active = true;
          this.filteringOpen.emit(this.active);
        }
      }
    );
  }

  updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryParams = this.activeParams.categories.find(item => item === url);
      if (existingCategoryParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
        this.active = false;
        // console.log(this.activeParams.categories)
      } else if (!existingCategoryParams && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url];
        this.active = true;
        // console.log(this.activeParams.categories)
      }
    } else if (checked) {
      this.activeParams.categories = [url];
      this.active = true;
      // console.log(this.activeParams.categories)
    }
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }


}
