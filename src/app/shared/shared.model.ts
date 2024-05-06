export interface Recipe {
    name: string;
    desc?: string;
    time?: Time;
    ingredients?: RecipeIngredient[];
    instructions?: string;
    img?: string;
    tags?: string[];
    id: string;
}

export interface RecipeIngredient {
    name: string;
    amount?: number;
    unit?: string;
}

export interface RecipeIngredientSuggestion {
    name: string;
    units: string[];
}

export interface Time {
    time: number;
    unit: string;
}

export enum Language {
    en, ch
}