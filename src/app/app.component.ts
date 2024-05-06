import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  // firestore: Firestore = inject(Firestore)
  // items$: Observable<any[]>;

  constructor() {
    // const aCollection = collection(this.firestore, 'view-recipe')
    // this.items$ = collectionData(aCollection);
    // console.log(aCollection);
    // console.log(this.items$)

  }

}
