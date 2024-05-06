import { MenuItem } from 'primeng/api';
import { LanguageService } from './language.service';

export const menuItems: MenuItem[] = [
    { label: 'Add Recipes', icon: 'pi pi-plus', routerLink: ['/add-recipes'] },
    { label: 'View Recipes', icon: 'pi pi-eye', routerLink: ['/view-recipes'] }
];

