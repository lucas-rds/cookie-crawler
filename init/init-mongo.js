db.createUser({
    user: 'cookie-user',
    pwd: 'cookie-user',
    roles: [
        {
            role: 'readWrite',
            db: 'cookies',
        },
    ],
});

db = new Mongo().getDB("cookies");

db.createCollection('cookies', { capped: false });