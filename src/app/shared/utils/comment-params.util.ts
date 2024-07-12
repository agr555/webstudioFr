import { Params } from '@angular/router';
import { CommentParamsType } from '../../../types/comment-params.type';

export class CommentParamsUtil {
  static processCommentParams(params: Params): CommentParamsType {
    const activeParams: CommentParamsType = { article: '' };

    if (params.hasOwnProperty('article')) {
      activeParams.article = params['article'];
    }

    if (params.hasOwnProperty('offset')) {
      activeParams.offset = params['offset'];

      if (params.hasOwnProperty('text')) {
        activeParams.text = params['text'];
      }
    }
    return activeParams;
  }
}
