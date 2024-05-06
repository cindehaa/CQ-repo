<h1 align="center">
  <br>
  <i>CQ Recipe</i>
  <br>
</h1>
<p align="center">
    A recipe book for my mom, CQ
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#features">Features</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#future-features">Future Features</a> 
</p>

> Note, this repository is for showcasing my code only. Certain config files are omitted for brevity and security. Building the project locally will not work.

## Introduction

Welcome to our family recipe book, found at [https://cqrecipe.com/](https://cqrecipe.com/)

Originally, all of our recipes had been written on paper, scattered in various notebooks around the house. Unsurprisingly, we'd find the recipes impossible to find when we had needed them. After the nth time of spending hours looking for a recipe, I decided to create a digital recipe book for my mom, now being used to store and share our family recipes!

My philosophy for this site was simple: I wanted the UI to focus on ease-of-access and I wanted the site to be secure yet accessible to non-family members. These core ideas influenced each of my design and feature choices of the site.

## Features

* Optional identifier field in the home page, allowing only those with the passcode to edit, add, and delete recipes
* Dynamic suggestions for ingredient names and ingredient units
  * Ex: Adding "1 ounce of pecans" to the list of ingredients requires only 2 inputs! Typing 'p', then clicking 'pecans' from the suggestions list will automatically suggest 'ounce' as the unit of measurement
* Dynamic suggestions for recipe categories, with keyboard support to quickly add multiple categories at once
* Buttons to increment or decrement numerical values, allowing changes within a single click
* Ability to format instructions advancedly: supports bold, superscript, subscript, bullet points, numeric points, and images
* Filtering and searching recipes by name, key-words, ingredients, time, and categories
* Pagination, including the number of recipes to display per page
* Completely responsive for all device sizes and types

## Technologies

* Angular framework, with the PrimeNG UI library
* Firebase Firestore database stores the recipes
* Netlify to deploy and host the site

## Future Features
* Bilingual Chinese-English language support
  * This is in-progress! A custom language pipe has been set-up already, but I will need time to create translations for each label
* Recipe visiblity settings
  * We love to share our recipes, but some recipes are just too personal to share to the public. I plan to add a feature where only those with certain identifiers may view certain recipes
* Progressive Web Application (PWA)
  * I've always wanted to develop a PWA and I think that this site would be a perfect opportunity for this. This would allow the UX to be more seamless and clean, enhancing the mobile experience of the site
  

