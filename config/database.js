'use strict';

if (process.env.NODE_ENV === 'test') {
  module.exports = { mongoURL: 'mongodb://localhost:27017/netmovie-test' };
} else {
  module.exports = { mongoURL: 'mongodb://localhost:27017/netmovie' };
}
