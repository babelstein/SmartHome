import { DataTypes, Model, Sequelize } from "sequelize";

const sequelize = new Sequelize('sqlite::memory:');
export class PvChargeDTO extends Model {};

PvChargeDTO.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  voltage: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false
  },
  current: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false
  },
  power: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW')
  }
}, {
  sequelize,
  createdAt: false,
  updatedAt: false,
  modelName: 'PvCharge',
});
console.log(PvChargeDTO === sequelize.models.PvCharge); // true