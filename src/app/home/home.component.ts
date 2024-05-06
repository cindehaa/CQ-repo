import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { labels } from '../shared/labels';
import { LanguageService } from '../shared/language.service';
import { IdentifierService } from '../shared/identifier.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  labels = labels;
  imageUrl = '';
  editKey = '';

  constructor(
    public language: LanguageService,
    private identifierService: IdentifierService
  ) { }

  ngOnInit() {
    this.imageUrl = "/assets/home/home" + (Math.floor(Math.random() * 2) + 1).toString() + ".jpg";
    console.log(this.imageUrl);
  }

  onEnter() {
    this.identifierService.setIdentifier(this.editKey.trim());
  }

}
