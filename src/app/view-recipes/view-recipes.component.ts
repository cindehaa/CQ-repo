import { Component, inject } from '@angular/core';
import { Firestore, collectionData, deleteDoc, doc, where } from '@angular/fire/firestore';
import { collection, query, getDocs, writeBatch, deleteField } from 'firebase/firestore';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { menuItems } from '../shared/menu-items';
import { Recipe, RecipeIngredient, Time } from '../shared/shared.model';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { labels } from '../shared/labels';
import { IdentifierService } from '../shared/identifier.service';
import { ViewRecipesService } from './view-recipes.service';

interface Dropdown {
  label: string;
  value: string;
}

@Component({
  selector: 'app-view-recipes',
  templateUrl: './view-recipes.component.html',
  styleUrls: ['./view-recipes.component.css']
})
export class ViewRecipesComponent {
  firestore: Firestore = inject(Firestore)
  recipeCollection: any;
  recipes: any[] = [];
  labels = labels;

  // Menu Bar
  menuItems: MenuItem[] = menuItems;

  // Time
  timeOptions: Dropdown[] = [
    { label: 'minutes', value: 'minutes' },
    { label: 'hours', value: 'hours' },
  ];

  // Pagination
  first = 0;
  rows = 5;

  // Sidebar
  sidebarId: string = '';
  sidebarVisible: boolean = false;
  sidebarName: string = '';
  sidebarDesc: string = '';
  sidebarTime: Time = {
    time: 0,
    unit: ''
  };
  sidebarIngredients: RecipeIngredient[] = [];
  sidebarInstructions: string = '';
  sidebarTags: string[] = [];

  // Editing
  isEditing: boolean = false;
  editName: string = '';
  editDesc: string = '';
  editTime: Time = {
    time: 0,
    unit: ''
  };
  editIngredients: RecipeIngredient[] = [];
  editInstructions: string = '';
  editTags: string[] = [];
  editIngredientsCount: number = 1;

  // Identifiers
  identifier: string = '';
  isIdentifierEditable: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private http: HttpClient,
    public identifierService: IdentifierService,
    public viewRecipesService: ViewRecipesService
  ) {
    this.recipeCollection = collection(this.firestore, 'view-recipe')
  }

  /**
   * Initialization
   */

  ngOnInit() {
    this.getIdentifier();
    this.getAllRecipes();
    this.resetDefaults();
  }

  getAllRecipes() {
    collectionData(this.recipeCollection).subscribe((data) => {
      this.recipes = data
      // Capitalize first letter of each ingredient
      this.recipes.forEach((r: Recipe) => {
        r.ingredients?.forEach((i: RecipeIngredient) => {
          i.name = i.name.charAt(0).toUpperCase() + i.name.slice(1);
        });
      });
      console.log("INFO: Recipes loaded: ", this.recipes)
    });
  }

  getIdentifier() {
    this.identifier = this.identifierService.getIdentifier();
    this.isIdentifierEditable = this.identifierService.isIdentifierEditable();
  }

  resetDefaults() {
    this.isEditing = false;
    this.sidebarVisible = false;
    this.editIngredientsCount = 1;
  }


  /**
   * Sidebar
   */

  showSidebar(recipe: Recipe) {
    console.log("INFO:  Showing sidebar with recipe: ", recipe)
    this.sidebarVisible = true;
    recipe.id ? this.sidebarId = recipe.id : this.sidebarId = ''
    recipe.name ? this.sidebarName = recipe.name : this.sidebarName = ''
    recipe.desc ? this.sidebarDesc = recipe.desc : this.sidebarDesc = ''
    recipe.time ? this.sidebarTime = recipe.time : this.sidebarTime = { time: 0, unit: '' }
    recipe.instructions ? this.sidebarInstructions = recipe.instructions : this.sidebarInstructions = ''
    recipe.ingredients ? this.sidebarIngredients = recipe.ingredients : this.sidebarIngredients = []
    recipe.tags ? this.sidebarTags = recipe.tags : this.sidebarTags = []

    this.editName = JSON.parse(JSON.stringify(this.sidebarName));
    this.editDesc = JSON.parse(JSON.stringify(this.sidebarDesc));
    this.editTime = JSON.parse(JSON.stringify(this.sidebarTime));
    this.editIngredients = JSON.parse(JSON.stringify(this.sidebarIngredients));
    this.editInstructions = JSON.parse(JSON.stringify(this.sidebarInstructions));
    this.editTags = JSON.parse(JSON.stringify(this.sidebarTags));
    this.editIngredientsCount = this.editIngredients.length;
  }

  /**
   * Editing Recipes
   */

  onEditRecipe() {
    this.isEditing = true;
  }

  onCancelEdit() {
    this.isEditing = false;
  }

  // Editing Ingredients
  onAddIngredient() {
    this.editIngredientsCount++;
    this.editIngredients.push({ name: '', amount: 0, unit: '' });
  }
  onDeleteIngredient(index: number) {
    this.editIngredientsCount--;
    this.editIngredients.splice(index, 1);
  }
  onDeleteRecipe(id: string) {
    this.confirmDelete(id);
  }

  canSaveEdit() {
    if (!this.isIdentifierEditable) return false;
    let originalJson = JSON.stringify(this.sidebarName) + JSON.stringify(this.sidebarDesc) + JSON.stringify(this.sidebarTime) + JSON.stringify(this.sidebarIngredients) + JSON.stringify(this.sidebarInstructions) + JSON.stringify(this.sidebarTags)
    let newJson = JSON.stringify(this.editName) + JSON.stringify(this.editDesc) + JSON.stringify(this.editTime) + JSON.stringify(this.editIngredients) + JSON.stringify(this.editInstructions) + JSON.stringify(this.editTags)
    return originalJson !== newJson
  }

  onSaveRecipe() {
    let newRecipe: Recipe = {
      id: this.sidebarId,
      name: this.editName,
      desc: this.editDesc,
      time: this.editTime,
      ingredients: this.editIngredients,
      instructions: this.editInstructions,
      tags: this.editTags
    }

    this.viewRecipesService.saveRecipeToFirestore(this.firestore, newRecipe).then(() => {
      this.ngOnInit();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recipe Updated' });
    }).catch((error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Updating Recipe' });
    });
  }

  /**
   * Deleting Recipes
   */

  canDelete() {
    return this.isIdentifierEditable;
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this recipe?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        console.log("INFO: Deleting recipe with id: ", id)
        this.deleteRecipe(id);
      },
      reject: () => {
      }
    });
  }

  deleteRecipe(id: string) {
    this.viewRecipesService.deleteRecipeFromFirestore(this.firestore, id).then(() => {
      this.ngOnInit();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recipe Deleted' });
    }).catch((error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Deleting Recipe' });
    });
  }

  /**
   * Pagination
   */

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.recipes ? this.first === this.recipes.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.recipes ? this.first === 0 : true;
  }

  /**
   * Filtering
   */

  filterInput(event: any, table: Table) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
  }

  clear(table: Table) {
    table.clear();
  }
}

