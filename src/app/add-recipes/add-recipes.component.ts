import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AutoComplete } from 'primeng/autocomplete';
import { FormControl, FormGroup } from '@angular/forms';
import { Recipe, RecipeIngredient, Time } from '../shared/shared.model';
import { tagSuggestions } from '../shared/tag-suggestions';
import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { menuItems } from '../shared/menu-items';
import { Router } from '@angular/router';
import { labels } from '../shared/labels';
import { v4 as uuidv4 } from 'uuid';
import { IdentifierService } from '../shared/identifier.service';
import { AddRecipesService } from './add-recipes.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface Dropdown {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-recipes',
  templateUrl: './add-recipes.component.html',
  styleUrls: ['./add-recipes.component.css']
})
export class AddRecipesComponent {
  labels = labels;

  // Database
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  recipes: Observable<any[]>;
  recipeCollection: CollectionReference;

  // Menu Bar
  menuItems: MenuItem[] = menuItems;

  // Name
  name: string = '';
  nameFocus = true;

  // Description
  desc: string = '';

  // Time
  time: Time = {
    time: 10,
    unit: 'minutes'
  };

  timeOptions: Dropdown[] = [
    { label: 'minutes', value: 'minutes' },
    { label: 'hours', value: 'hours' },
  ];

  // Ingredients
  selectedIngredients: RecipeIngredient[] = [{
    name: '',
    amount: 1,
    unit: 'Select unit'
  }];
  selectedIngredientsCount: number = 1;
  allIngredients: any = []; // name and units of pre-defined ingredients
  filteredIngredients: any = [];

  // Instructions
  instructions: string = '';

  // Tags
  tags: string[] = [];
  allTags: string[] = tagSuggestions;
  filteredTags: string[] = [];

  // Identifiers
  identifier: string = '';
  isIdentifierEditable: boolean = false;

  constructor(private http: HttpClient,
    private elementRef: ElementRef,
    private router: Router,
    private messageService: MessageService,
    public identifierService: IdentifierService,
    public addRecipesService: AddRecipesService
  ) {
    this.recipeCollection = collection(this.firestore, 'view-recipe');
    this.recipes = collectionData(this.recipeCollection) as Observable<any[]>;
  }

  /**
   * Initialization
   */

  ngOnInit() {
    this.resetForm();
    this.getAllIngredients();
    this.getIdentifier();
  }

  getAllIngredients() {
    this.http.get('assets/all-ingredients.json').subscribe({
      next: (data) => {
        const obj = JSON.parse(JSON.stringify(data));
        const foods = obj["foods" as keyof typeof obj];

        for (let i = 0; i < foods.length; i++) {
          let ingredient = {
            name: foods[i as keyof typeof foods]["name"],
            units: foods[i as keyof typeof foods]["units"]
          }
          ingredient.name = ingredient.name.toLowerCase();
          this.allIngredients.push(ingredient);
        }
        console.log('INFO: Get all ingredients success');
      },
      error: (error) => {
        console.error('ERROR: Fetching ingredients data:', error);
      }
    });
  }

  getIdentifier() {
    this.identifier = this.identifierService.getIdentifier();
    this.isIdentifierEditable = this.identifierService.isIdentifierEditable();
  }

  resetForm() {
    this.name = '';
    this.desc = '';
    this.time = {
      time: 10,
      unit: 'minutes'
    };
    this.selectedIngredients = [];
    this.instructions = '';
    this.tags = [];
    this.selectedIngredientsCount = 1;
    this.selectedIngredients = [{
      name: '',
      amount: 1,
      unit: 'Select unit'
    }];
  }

  /**
   * Ingredients
   */

  updateSelectedIngredient(index: number) {
    const name = this.selectedIngredients[index].name;
    const units = this.getIngredientUnits(name);
    if (units.length > 0) {
      this.selectedIngredients[index].unit = units[0].value;
    }    
  }
  
  onAddIngredient() {
    this.selectedIngredientsCount++;
    this.selectedIngredients.push({
      name: '',
      amount: 1,
      unit: 'Select unit'
    });
  }

  onDeleteIngredient(index: number) {
    this.selectedIngredientsCount--;
    this.selectedIngredients.splice(index, 1);
  }

  // Returns the dropdown options for the ingredient units
  getIngredientUnits(ingredientName: string) {
    let ret: Dropdown[] = [];
    let ingredient = this.allIngredients.find((i: any) => i.name.toLowerCase() == ingredientName.toLowerCase());
    if (ingredient) {
      for (let i = 0; i < ingredient.units.length; i++) {
        ret.push({
          label: ingredient.units[i],
          value: ingredient.units[i]
        })
      }
    } else {
      ret = [];
    }

    return ret;
  }

  // Called when typing in the ingredient input in order to filter the list of ingredients
  filterIngredients(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query.trim().toLowerCase(); // Trim white spaces

    // Reset filteredIngredients if query is empty
    if (!query) {
      this.filteredIngredients = this.allIngredients;
      return;
    }

    // Filter suggestions based on query
    for (let i = 0; i < (this.allIngredients as any[]).length; i++) {
      let ingredient = (this.allIngredients as any[])[i];
      if (ingredient.name.toLowerCase().indexOf(query) == 0) {
        filtered.push(ingredient.name); //add the feature to select when name is shorter than autocomplete options
      }
    }

    // Add the query as a suggestion if it's not already in the filtered array
    if (!filtered.includes(query)) {
      filtered.push(query);
    }

    this.filteredIngredients = filtered;
  }

  /*
   * Tags
   */

  // Called when typing in the tags input in order to filter the list of tags
  filterTags(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query.trim().toLowerCase(); // Trim white spaces

    // Reset filteredTags if query is empty
    if (!query) {
      this.filteredTags = this.allTags;
      return;
    }

    // Filter suggestions based on query (if contains query in string)
    for (let i = 0; i < this.allTags.length; i++) {
      let tag = this.allTags[i];
      if (tag.toLowerCase().indexOf(query) != -1) {
        filtered.push(tag);
      }
    }

    // Add the query as a suggestion if it's not already in the filtered array
    if (!filtered.includes(query)) {
      filtered.push(query);
    }

    this.filteredTags = filtered;
  }

  /*
   * Form
   */

  formIsValid() {
    if (!this.isIdentifierEditable) {
      return false;
    }

    if (this.name == '') {
      return false;
    }

    if (this.selectedIngredients.length == 0) {
      return false;
    }

    for (let i = 0; i < this.selectedIngredients.length; i++) {
      if (this.selectedIngredients[i].name.trim() == '') {
        return false;
      }
    }

    return true;
  }

  buildRecipe(): Recipe  {
    let recipe: Recipe = {
      name: this.name,
      desc: this.desc,
      time: this.time,
      ingredients: this.selectedIngredients,
      instructions: this.instructions,
      tags: this.tags,
      id: uuidv4()
    };
    console.log("INFO: Building recipe", recipe);
    return recipe;
  }

  trimForm() {
    this.name = this.name.trim();
    this.desc = this.desc.trim();
    this.instructions = this.instructions.trim();
    for (let i = 0; i < this.selectedIngredients.length; i++) {
      this.selectedIngredients[i].name = this.selectedIngredients[i].name.trim();
      if (this.selectedIngredients[i].unit == '') {
        this.selectedIngredients[i].unit = 'unit';
      }
      if (this.selectedIngredients[i].unit == 'Select unit') {
        this.selectedIngredients[i].unit = 'unit';
      }
      if (this.selectedIngredients[i].unit) {
        this.selectedIngredients[i].unit!.trim();
      }
      if (this.selectedIngredients[i].amount == 0) {
        this.selectedIngredients[i].amount = 1;
      }
    }

    if (this.tags) {
      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i] = this.tags[i].trim();
      }
    }

    if (this.time.time == 1 && this.time.unit == 'minutes') {
      this.time.unit = 'minute';
    }

    if (this.time.time == 1 && this.time.unit == 'hours') {
      this.time.unit = 'hour';
    }
  }

  submitForm() {
    this.trimForm();
    let recipeData: Recipe = this.buildRecipe();

    this.addRecipesService.addRecipeToFirestore(this.recipeCollection, recipeData).then((id) => {
      console.log('INFO: Recipe added to database', recipeData, id);
      this.ngOnInit();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recipe Added' });
    }), (error: any) => {
      console.error('ERROR: Adding recipe to database', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Adding Recipe' });
    };
  }

}


