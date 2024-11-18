exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(
        `
            CREATE TYPE user_role AS ENUM ('customer', 'admin');

            CREATE TABLE users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role user_role NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `
    )
};


exports.down = (pgm) => {
    pgm.sql(
        `
            DROP TABLE users;
            DROP TYPE user_role;
        `
    )
};
