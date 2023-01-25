import { DataTypes, Model, Sequelize } from "sequelize";

const sequelize = new Sequelize('sqlite::memory:');
export class BatChargeDTO extends Model {};

BatChargeDTO.init({
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
  temp: {
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
  modelName: 'BatCharge',
});
console.log(BatChargeDTO === sequelize.models.BatCharge); // true