db = db.getSiblingDB('medipass');

// Create collections
db.createCollection('users');

// Create indexes
db.users.createIndex({ "medipassId": 1 }, { unique: true });
db.users.createIndex({ "mobileNumber": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true });

print('Database initialization completed successfully'); 