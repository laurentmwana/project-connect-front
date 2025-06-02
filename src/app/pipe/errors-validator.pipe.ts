import { ValidationServerResult } from '@/model/default';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorsValidator',
})
export class ErrorsValidatorPipe implements PipeTransform {
  transform(validator: ValidationServerResult): string | null {
    if (!validator) return null;

    const messages: string[] = [];

    for (const key in validator.errors) {
      if (Object.prototype.hasOwnProperty.call(validator.errors, key)) {
        const element = validator.errors[key];
        if (element && element.length > 0) {
          messages.push(
            `<li class="mb-2"><strong>${key}</strong> : ${element[0]}</li>`
          );
        }
      }
    }

    if (messages.length === 0) return null;

    return `
      <div
        class="p-4 mb-4 text-sm text-red-800 rounded-lg border dark:text-red-400"
        role="alert">
        <p class="mb-2 text-sm font-semibold">${validator.message}</p>
        <ul class="ml-6 list-disc text-sm">${messages.join('')}</ul>
      </div>
    `;
  }
}
