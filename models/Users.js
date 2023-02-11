module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'name'
		},
		email: {
			type: DataTypes.STRING(250),
			allowNull: true,
			field: 'email'
		},
		password: {
			type: DataTypes.STRING(250),
			allowNull: true,
			field: 'password'
		},
		user_type: {
			type: DataTypes.ENUM,
			values: ['superAdmin', 'normalUser'],
			defaultValue: 'normalUser',
			validate: {
				isIn: {
					args: [['superAdmin', 'normalUser']],
					msg: 'Invalid user type',
				},
			},
		},
	},
		{
			underscored: true,
			freezeTableName: true,
		},
		{
			tableName: 'users'
		});

	/*User.associate = models => {
		User.hasOne(models.stores, { foreignKey: 'user_id' });
		User.hasMany(models.offers, { foreignKey: 'user_id' });
		User.hasMany(models.favourites, { foreignKey: 'user_id' });
	};*/

	return User;

};