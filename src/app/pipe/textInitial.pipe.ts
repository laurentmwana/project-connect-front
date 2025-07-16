import { ValidationServerResult } from '@/model/default';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textInitial',
})
export class TextInitialPipe implements PipeTransform {
  transform(fullName: string): string {
    const names = fullName.trim().split(' ');

    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();

    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);

    return `${firstInitial}${lastInitial}`.toUpperCase();
  }
}
