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
```jsx
const express = require('express')  //récupération de la dépendance
const app = express()   //instance de de l'app express
```

Une fois cela fait, nous pouvons créer nos routes :
- GET (*all*) :
```jsx
app.get('/api/pokemons', (req, res) => {
	/* code de récupération de la liste des pokémons */
})
```
- GET (*unique*) :
```jsx
app.get('/api/pokemons/:id', auth, (req, res) => {
	/* code de récupération du pokémon correspondant à l'id recherché */
})
```
- POST :
```jsx
app.post('/api/pokemons', auth, (req, res) => {
	/* code de création du pokémon utilisant le body de la requête */
})
```
- PUT :
```jsx
app.put('/api/pokemons/:id', (req, res) => {
	/* code de modification du pokémon correspondant à l'id utilisant le body de la requête */
})
```
- DELETE :
```jsx
app.delete('/api/pokemons/:id', (req, res) => {
	/* code de suppression du pokémon correspondant à l'id */
})
```

## L'utilisation des *middlewares*

Les *middlewares* sont des fonctions intermédiaires utilisées pour gérer les requêtes HTTP entrantes avant qu'elles n'atteignent la route finale de l'application. Elles agissent comme une couche de traitement intermédiaire entre le serveur et l'application. Elles prennent 3 paramètres : la requête , la réponse et la fonction suivante dans la chaîne des *middlewares* (souvent appelée next). 

Il existe 4 types de *middlewares* : 
- Le Middleware d’application :
```jsx
app.use((req, res, next) => {
	console.log('Time: ', Date.now())
	next()
}
```

- Le Middleware du routeur : 
```jsx
express.Router()
```

- Le Middleware de traitements d’erreurs :
```jsx
app.use((err, req, res, next) => {
	console.error(err))
	res.send('Erreur!')
}
```

- Les Middlewares tiers (exemple avec le package *morgan*) :
```jsx
app.use(morgan('dev'))
```

### Utilisation du *bodyparser*

## Communication API REST - Base de données (MariaDB) avec *sequelize*

Afin de pouvoir communiquer avec notre BDD, nous utilisons un ORM (Object-Relational Mapping) qui est un module qui facilite l'interaction entre une API REST et une BDD relationnelle. Il permet de mapper les objets de votre application directement aux tables de la base de données, en évitant ainsi la nécessité d'écrire manuellement des requêtes SQL. Il fournit des méthodes et des fonctionnalités pour effectuer des opérations de création, lecture, mise à jour et suppression (CRUD) sur les données de la BDD en utilisant des objets JavaScript plutôt que des requêtes SQL.

Cela apporte de nombreux avantages :
- Pas besoin de connaitre SQL
- Utilise le langage de programmation utilisé dans le projet
- Abstraction de la base de données
- Manipulation de simples objets 
- Requêtes simples : findAll, findOne, etc.

Dans notre cas, nous utilisons l'ORM *sequelize* permettant de communiquer avec les BDD de type MariaDB notamment.

Ainsi nous avons installé les packages *sequelize* et *maria-db*.

### Connexion à la BDD

La connexion à la BDD se fait avec le code suivant :
```jsx
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
	'pokedex',    //Nom de la BDD
	'root',       //Info de connexion : user
	'',           //Info de connexion : password
	{
	    host: 'localhost',     //Host de la BDD (ici on est en local)
	    dialect: 'mariadb',    //Type de BDD
	    dialectOptions: {
	        timezone: 'Etc/GMT-2'
	    },
    logging: false
})
```

### Création et configuration des modèles de données 

Afin de configurer nos tables nous utilisons des modèles de données. Dans notre projet de formation, nous créons une application de gestion de pokémons, nous avons donc créé un modèle de données respectant les caractéristiques d'un pokémon et qui permettra de configurer notre table :
```jsx
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    types: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}
```

Afin de pouvoir créer nos tables, nous utilisons la fonction `sync` de *sequelize* : 
```jsx
const { Sequelize, DataTypes } = require('sequelize')
let PokemonModel = require('./../models/pokemon')
let UserModel = require('./../models/user')
let pokemons = require('./mock-pokemon')

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync({force : true}).then(() => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name : pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types
            }).then(pokemonCreated => console.log(pokemonCreated.toJSON()))
        })
    })
}

module.exports = { initDb, Pokemon, User }
```

Dans notre cas, nous remplissons la table avec des pokémons créés en amont dans le dossier *mock-pokemons.js*

### Utilisation des méthode de *sequelize*

Nous utilisons donc les méthodes offertes par *sequelize* afin de pouvoir réaliser l'ensemble des opération CRUD :
- CREATE :
```jsx 
const {Pokemon} = require('../db/sequelize')    //Appel du modèle Pokemon

app.post('/api/pokemons', auth, (req, res) => {
        Pokemon.create({    //Appel de la fonction create pour créer un nouveau pokemon
            name : req.body.name,
            hp: req.body.hp,
            cp: req.body.cp,
            picture: req.body.picture,
            types: req.body.types
        })
        .then(pokemon => {
            const message = `Le pokémon ${pokemon.name} a bien été créé.`
            res.json({ message, data : pokemon })
        })
	})
})
```
- READ (all) :
```jsx
const {Pokemon} = require('../db/sequelize')    //Appel du modèle Pokemon

app.get('/api/pokemons', auth, (req, res) => {
	Pokemon.findAll({ order: ['name'] })    //Appel de la fonction findAll pour récupérer la liste des pokémons triée par ordre alphabétique
    .then(pokemons => {
	    const message = 'La liste des pokémons a bien été récupérée.'
		res.json({ message, data : pokemons })
    })
})
```
- READ (unique) :
```jsx
const {Pokemon} = require('../db/sequelize')    //Appel du modèle Pokemon

app.get('/api/pokemons/:id', auth, (req, res) => {
        Pokemon.findByPk(req.params.id)   //Appel de la fonction findByPk pour récupérer le pokémon correspondant à l'id recherché
        .then(pokemon => {
            const message = `Le pokémon ${pokemon.name} a bien été récupéré.`
            res.json({message, data : pokemon})
        })
    })
})
```
- UPDATE :
```jsx
const {Pokemon} = require('../db/sequelize')    //Appel du modèle Pokemon

app.put('/api/pokemons/:id', (req, res) => {
        const id = req.params.id
        Pokemon.update(req.body, {    //Appel de la fonction update et de l'attribut where pour modifier le pokémon correspondant à l'id recherché
            where: { id: id }
        })
        .then(_ => {
            return Pokemon.findByPk(id)
            .then(pokemon => {
                if(pokemon === null){
                    const message = `Le pokémon n'a pas pu être récupéré.`
                    res.status(404).json({message, data: err})
                }
                const message = `Le pokémon ${pokemon.name} a bien été modifié.`
                res.json({ message, data : pokemon })
            })
        })
	})
})
```
- DELETE :
```jsx
const {Pokemon} = require('../db/sequelize')

app.delete('/api/pokemons/:id', (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            if(pokemon === null){
                const message = `Le pokémon n'a pas pu être récupéré.`
                res.status(404).json({ message, data: err })
            }
            const pokemonDeleted = pokemon
            return Pokemon.destroy({ where : { id: pokemon.id } })    //Appel de la fonction destroy pour supprimé le pokémon correspondant à l'id recherché
            .then(_ => {
                const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
                res.json({ message, data : pokemonDeleted })
            })
        })
    })
})
```

### Configuration des validateurs 

*Sequelize* embarque ce qu'on appelle des validateur, ils permettent comme leurs noms l'indiquent de valider ou non les données que l'on souhaite transmettre à notre BDD. Il existe des validateurs natifs à *sequelize* mais nous pouvons aussi en créer nous même. Il se configure à l'aide de l'option `validate`

#### Validateurs natifs 

Voici une petite liste des validateurs que nous utilisons dans l'API :
```jsx
validate: {
	notEmpty: { msg: "Le nom du pokémon ne peut pas être vide" },
    notNull: { msg: "Le nom est une propriété requise" },
    min: {
	    args: [0],
	    msg: "Le nom doit contenir contenir au moins 1 caractère"
    },
    max: {
	    args: [20],
        msg: "Le nom doit contenir contenir moins de 20 caractères"
    }
}
```

Ce validateur est appliqué au champ *name* de notre pokémon est permet de valider plusieurs choses comme :
- Que le champ est bien rempli avec l'option *notEmpty*
- Que le champ ne soit pas *null* avec *notNull*
- Que le nom contienne entre 1 et 20 caractères avec *min* et *max*

Dans le cas d'un champ de type entier (int), nous pouvons aussi vérifier le type avec l'option *isInt*.

#### Validateurs personnalisés 

Dans le cas où les validateurs natifs ne permettent pas de vérifier une information sur les données, nous pouvons en créer. Ce que nous avons donc fait :
```jsx
validate: {
    isTypeValid(value) {
        if (!value) {
            throw new Error('Un pokémon doit avoir au moins un type')
        }
        if (value.split(',').length > 3) {
            throw new Error('Un pokémon ne peut pas avoir plus de 3 types')
        }
        value.split(',').forEach(type => {
            if (!validTypes.includes(type)) {
                throw new Error(`Le type ${type} est invalide, il doit appartenir à la liste suivante : ${validTypes}`)
            }
        });
    }
}
```

## Gestion des erreurs 

Comme pour toutes API, la gestion des erreurs est très importante, elle permet à la fois d'aiguiller l'utilisateur ainsi que le développeur.

Voici quelques erreurs que nous traitons :
```jsx
app.put('/api/pokemons/:id', auth, (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, {
        where: { id: id }
    })
    .then(_ => {
        return Pokemon.findByPk(id)
        .then(pokemon => {
            if(pokemon === null){    //Si on ne récupère pas le pokémon
                const message = `Le pokémon n'a pas pu être récupéré.`
                res.status(404).json({message, data: err})    //Erreur 404
            }
            const message = `Le pokémon ${pokemon.name} a bien été modifié.`
            res.json({ message, data : pokemon })
        })
    })
    .catch(err => {
        if(err instanceof ValidationError){    // Si la donnée n'est pas valide (ref. validateur)
            return res.status(400).json({ message: err.message, data: err })    //Erreur 400
        }
        if(err instanceof UniqueConstraintError){    //Si la donnée n'est pas unique
            return res.status(400).json({ message: err.message, data: err })    //Erreur 400
        }
        const message = `Le pokémon n'a pas pu être modifié.`
        res.status(500).json({message, data: err})    //Erreur 500
    })
})
```

## Authentification avec JWT

Afin de s'authentifier à l'application et sécuriser les échanges des utilisateurs avec notre API, nous utilisons le standard JWT (JSON Web Token). 

### Le *login*

Pour générer notre *token*, nous avons créé un point de terminaison que voici :
```jsx
app.post('/api/login', (req, res) => {
        User.findOne({ where: { username: req.body.username } }).then(user => {
            if(!user){
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ message })
            }

            bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
                if(!isPasswordValid) {
                    const message = `Le mot de passe de l'utilisateur est incorrect.`;
                    return res.status(401).json({ message })
                }

                //JWT
                const token = jwt.sign(
                    { userId: user.id },
                    privateKey,
                    { expiresIn: '24h' })

                const message = `L'utilisateur a été connecté avec succès.`;
                return res.json({ message, data: user, token })
            })
        })
        .catch(err => {
            const message = `L'utilisateur n'a pas pu se connecter`;
            return res.status(500).json({ message: err.message, data: err })
    })
})
```

Une fois donc l'utilisateur retrouvé en base et le mot passe vérifié et nous générons le *token*.