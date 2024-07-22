import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderType } from '../../../types/order.type';
import { OrderService } from '../../shared/services/order.service';
import { ArticleService } from '../../shared/services/article.service';
import { PopArticleType } from '../../../types/pop-article.type';
import { DefaultResponseType } from '../../../types/default-response.type';
import { CategoryType } from '../../../types/category.type';
import { CategoryService } from '../../shared/services/category.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit {
  selected: string = 'Копирайтинг';

  articles: PopArticleType[] = [];

  isLight: boolean = false;

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  @ViewChild('popupOrder') popupOrder!: TemplateRef<ElementRef>;

  dialogRef: MatDialogRef<any> | null = null;

  dialogRefOrder: MatDialogRef<any> | null = null;

  formGroup: CategoryType[] = [];
  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoHeight: false,
    autoplay: true,
    // center: true,
    // margin: 24,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },

      1200: {
        items: 1,
      },

    },
    nav: false,
  };
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    // center: true,
    // margin: 24,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      700: {
        items: 2,
      },
      1050: {
        items: 3,
      },
      1200: {
        items: 4,
      },

    },
    nav: false,
  };
  customOptionsServices: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    // center: true,
    // margin: 24,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      700: {
        items: 2,
      },
      1050: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
    nav: false,
  };

  customOptionsReview: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 26,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      900: {
        items: 2,
      },
      1240: {
        items: 3,
      },

    },
    nav: false,
  };

  categories: CategoryType[] = [];

  orderForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    service: [''],
    type: [''],
  });

  reviews = [
    {
      name: 'Наталья',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    /*    {
          name: 'Аделина',
          image: 'review4.png',
          text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! ' +
            'Все просто в восторге от мини-сада! ' +
            'А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
        },
        {
          name: 'Яника',
          image: 'review5.png',
          text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
        },
        {
          name: 'Марина',
          image: 'review6.png',
          text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
        },
        {
          name: 'Станислав',
          image: 'review7.png',
          text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
        } */
  ];

  constructor(
    config: NgbCarouselConfig,
    private articleService: ArticleService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private router: Router,
  ) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
    this.articleService.getPopArticles()
      .subscribe((data: PopArticleType[]) => {
        this.articles = data;
      });
    // console.log(this.articles);

    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
        //    console.log(this.categories);
      });
    //   console.log(this.categories);
  }

  compare(c1: { name: string }, c2: { name: string }) {
    return c1 && c2 && c1.name === c2.name;
  }

  navigate() {
  }

  more(serviceName: string) {
    this.selected = serviceName;
    // this.orderForm.value.service = serviceName;
    this.orderForm.patchValue({ service: serviceName });
    this.dialogRefOrder = this.dialog.open(this.popupOrder);
    this.dialogRefOrder.backdropClick()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  createOrder() {
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
      });
    if (this.orderForm.valid && this.orderForm.value.name
      && this.orderForm.value.phone && this.orderForm.value.service) {
      const paramObject: OrderType = {
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        service: this.orderForm.value.service,
        type: 'order',
      };

      this.orderService.createOrder(paramObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }
            // console.log(this.orderForm.value);
            this.updateOrderTypeValidation();
            this.closePopupOrder();
            this.dialogRef = this.dialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe(() => {
                this.router.navigate(['/']);
              });
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка заказа!');
            }
          },
        });
    } else {
      this.orderForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля ');
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }

  closePopupOrder() {
    this.reset();
    this.dialogRefOrder?.close();
    this.router.navigate(['/']);
  }

  updateOrderTypeValidation() {
    this.orderForm.get('name')?.removeValidators(Validators.required);
    this.orderForm.get('name')?.setValue('');
    this.orderForm.get('phone')?.removeValidators(Validators.required);
    this.orderForm.get('phone')?.setValue('');
    this.orderForm.get('service')?.removeValidators(Validators.required);
    this.orderForm.get('service')?.setValue('');
  }

  reset() {
    this.orderForm.get('name')?.setValue('');
    this.orderForm.get('phone')?.setValue('');
    this.orderForm.markAsPristine();// чистая
    this.orderForm.reset(); // will reset to null
  }

}
