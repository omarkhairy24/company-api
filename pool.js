const pg = require('pg');

class Pool {
    _pool = null;

    connect(){
        this._pool = new pg.Pool({
            host:process.env.host,
            port:process.env.port,
            database:process.env.database,
            user:process.env.user,
            password:process.env.password,
        });
        return this._pool.query('SELECT 1+1;'); 
    }

    close() {
        if (this._pool) {
            return this._pool.end();
        }
        throw new Error('Pool is not initialized');
    }

    query(sql, params) {
        if (this._pool) {
            return this._pool.query(sql, params);
        }
        throw new Error('Pool is not initialized');
    }
}

module.exports = new Pool();
