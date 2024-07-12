import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'headShorterPipe',
})
export class HeadShorterPipePipe implements PipeTransform {
  transform(value: string): string {
    return (value.length > 80) ? (`${value.slice(0, 80)}<...>`) : value;
  }
}
