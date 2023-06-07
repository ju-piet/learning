# Apprentissage du Node.js

Vous trouverez ci-joint les notions importantes apprises durant mon apprentissage du Node.js. Ces notions pourront vous êtes utiles pour la suite de vos projets notamment pour la construction d'API REST.

## Utilisation de npm

Le module *npm* permet d'installer de nombreux packages utiles à la fois au : 
-  Fonctionnement de l'application : 
	- Création de points de terminaison (*express*)
	- Encryptage des mots de passe (*bcrypt*)
	- ORM (*sequelize*)
	- etc.
- Développement : 
	- Rechargement de l'application à chaque modification (*nodemon*) 
	- Outils de *logging* (*morgan*)

### Installation d'un package

L'installation d'un package *npm* se fait à l'aide de la commande : `nmp install`
Comme dit précédemment, il est possible d'ajouter des packages de fonctionnalité et de développement qui doivent être donc installer différemment. 

Voici donc 2 procédures d'installations :
- Package de fonctionnalité : `npm install express --save`
- Package de développement : `npm install nodemon --save-dev`

## Création de route avec *express*

Le package *express* permet avec simplicité de créer des points de terminaison GET, POST, PUT et DELETE. Pour faire cela, il faut d'abord installer le package (voir la section précédente), l'importer et l'instancier :
```
const express = require('express')  //récupération de la dépendance
const app = express()   //instance de de l'app express
```

Une fois cela fait, nous pouvons créer nos routes :
- GET (*all*) :
```
app.get('/api/pokemons', (req, res) => {
	/* code de récupération de la liste des pokémons */
})
```
- GET (*unique*) :
```
app.get('/api/pokemons/:id', auth, (req, res) => {
	/* code de récupération du pokémon correspondant à l'id recherché */
})
```
- POST :
```
app.post('/api/pokemons', auth, (req, res) => {
	/* code de création du pokémon utilisant le body de la requête */
})
```
- PUT :
```
app.put('/api/pokemons/:id', (req, res) => {
	/* code de modification du pokémon correspondant à l'id utilisant le body de la requête */
})
```
- DELETE :
```
app.delete('/api/pokemons/:id', (req, res) => {
	/* code de suppression du pokémon correspondant à l'id */
})
```