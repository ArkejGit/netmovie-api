'use strict';

const mongoose = require('mongoose');
const db = require('../config/database');

module.exports = {

  clearCollectionDB: (collection) => {
    mongoose.connection.db.listCollections({ name: collection })
      .next((e, collinfo) => {
        if (collinfo) {
          mongoose.connection.collections[collinfo.name].drop();
        }
      });
  },

  connectToDB: async () => {
    await mongoose.connect(db.mongoURL, { useNewUrlParser: true });
  },

  checkIfExistsInDB: async (collection, query) => {
    let exists;
    await collection.findOne(query)
      .then((product) => { exists = product !== null; });
    return exists;
  },
};
