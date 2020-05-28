//Setup of the database
module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'softmakers',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    },
}
