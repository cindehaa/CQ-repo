import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from './language.service'; 

@Pipe({
  name: 'lang'
})
export class LanguagePipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  transform(label: any): string {
    return this.languageService.isLanguageEn() ? label.en : label.ch;
  }
}
