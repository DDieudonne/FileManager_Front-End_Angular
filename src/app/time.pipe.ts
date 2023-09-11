import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeP'
})
export class TimePipe implements PipeTransform {

  transform(value: any): any {
    return moment(value).locale('fr').format('lll');
  }

}
