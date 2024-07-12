import { Params } from '@angular/router';
import { ActiveParamsType } from '../../../types/active-params.type';

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = { categories: [] };

    if(params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }

    if(params.hasOwnProperty('page')) {
      activeParams.page = +params['page'] ;
    }

    return activeParams;
  }
}
