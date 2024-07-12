import {
  Component, ElementRef,  TemplateRef, ViewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { CallType } from '../../../../types/call.type';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  dialogRef: MatDialogRef<any> | null = null;

  dialogRefOrder: MatDialogRef<any> | null = null;

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  @ViewChild('popupOrder') popupOrder!: TemplateRef<ElementRef>;

  callForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(
public dialog: MatDialog,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private orderService: OrderService,
              private router: Router,
  ) {
  }

  /* popup */
  more(serviceName: string) {
    this.dialogRefOrder = this.dialog.open(this.popupOrder);
    this.dialogRefOrder.backdropClick()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  callOrder() {
    if (this.callForm.valid && this.callForm.value.name
      && this.callForm.value.phone) {
      const paramObject1: CallType = {
        name: this.callForm.value.name,
        phone: this.callForm.value.phone,
        service: 'Фриланс',
        type: 'order',
      };

      this.orderService.callOrder(paramObject1)
        .subscribe({
          next: (data: CallType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined && (data as DefaultResponseType).error !== false) {
              throw new Error((data as DefaultResponseType).message);
            }
            // console.log(this.callForm.value);
            this.updateCallTypeValidation();
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
      this.callForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля ');
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }

  closePopupOrder() {
    this.dialogRefOrder?.close();
    this.router.navigate(['/']);
  }

  updateCallTypeValidation() {
    this.callForm.get('name')?.removeValidators(Validators.required);
    this.callForm.get('name')?.setValue('');
    this.callForm.get('phone')?.removeValidators(Validators.required);
    this.callForm.get('phone')?.setValue('');
  }
}
