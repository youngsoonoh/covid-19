import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'remainStat'})
export class RemainStatPipe implements PipeTransform {

    transform(status: string) {
        switch (status) {
            case 'empty': {
                return '매진';
            }
            case 'few': {
                return '2개 이상 30개 미만';
            }
            case 'sone': {
                return '30개 이상 100개 미만';
            }
            case 'plenty': {
                return '100개 이상';
            }
        }
    }
}
