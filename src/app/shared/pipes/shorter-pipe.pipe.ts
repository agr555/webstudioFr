import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorterPipe',
})
export class ShorterPipePipe implements PipeTransform {
  transform(value: string): string {
    return (value.length > 200) ? (`${value.slice(0, 200)}<...>`) : value;
  }
}
