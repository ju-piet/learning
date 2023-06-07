const validTypes = ['Plante', 'Eau', 'Feu', 'Poison', 'Roche', 'Insecte', 'Psy', 'Vol', 'Electrik', 'Normal', 'Fée', 'Spectre', 'Ténèbre', 'Acier']

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {   //Contrainte d'unicité
        msg: 'Le nom est déjà pris'
      },
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
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Utilisez uniquement des nombres entiers pour définir les points de vie" },
        notNull: { msg: "Les points de vie sont une propriété requise" },
        min: {
          args: [0],
          msg: "Les point de vie doivent être supérieur ou égale à 0"
        },
        max: {
          args: [999],
          msg: "Les point de vie doivent être inférieur ou égale à 999"
        }
      }
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Utilisez uniquement des nombres entiers pour définir les dégats" },
        notNull: { msg: "Les dégats sont une propriété requise" },
        min: {
          args: [0],
          msg: "Les dégats doivent être supérieur ou égale à 0"
        },
        max: {
          args: [99],
          msg: "Les dégats doivent être inférieur ou égale à 99"
        }
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: { msg: "Utilisez uniquement une URL valide pour définir la photo du pokémon" },
        notNull: { msg: "La photo est une propriété requise" }
      }
    },
    types: {
      type: DataTypes.STRING,
      allowNull: false,
      //Getter : BDD -> API REST
      get() {
        return this.getDataValue('types').split(',') //Génère un tableau de string 
      },
      //Setter : API REST -> BDD
      set(types) {
        this.setDataValue('types', types.join())    //Génère un string    
      },
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
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}