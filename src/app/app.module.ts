import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ViewRecipesComponent } from './view-recipes/view-recipes.component';
import { AddRecipesComponent } from './add-recipes/add-recipes.component';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import firebaseConfig from "src/environment/environment"
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorModule } from 'primeng/editor';
import { AutoFocusModule } from 'primeng/autofocus';
import { PaginatorModule } from 'primeng/paginator';
import { TabMenuModule} from 'primeng/tabmenu';
import { LanguagePipe } from './shared/language.pipe';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipsModule } from 'primeng/chips';
import { PanelModule } from 'primeng/panel';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ViewRecipesComponent,
    AddRecipesComponent,
    LanguagePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    CardModule,
    TableModule,
    HttpClientModule,
    AutoCompleteModule,
    FormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    EditorModule,
    AutoFocusModule,
    PaginatorModule,
    TabMenuModule,
    ImageModule,
    InplaceModule,
    SidebarModule,
    ToastModule,
    ConfirmDialogModule, 
    ChipsModule,
    FormsModule,
    PanelModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    HttpClient,
    ConfirmationService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
