import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../../types/default-response.type';
import { OrderType } from '../../../types/order.type';
import { CallType } from '../../../types/call.type';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {
  }

  createOrder(params: OrderType): Observable<OrderType | DefaultResponseType> {
    // console.log(params)
    return this.http.post<OrderType | DefaultResponseType>(
      `${environment.api}requests`,
      params,
    );
  }

  callOrder(params: CallType): Observable<CallType | DefaultResponseType> {
    //  console.log(params)
    return this.http.post<CallType | DefaultResponseType>(
      `${environment.api}requests`,
      params,
    );
  }
}
