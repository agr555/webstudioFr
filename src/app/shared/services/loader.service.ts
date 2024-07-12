import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  // private isShowed: boolean = false;
  isShowed$ = new Subject<boolean>();

  constructor() {
  }

  show() {
    // this.isShowed = true;
    this.isShowed$.next(true);
  }

  hide() {
    // this.isShowed = false;
    this.isShowed$.next(false);
  }
}
