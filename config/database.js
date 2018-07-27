'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = { mongoURL: 'mongodb://netmovie:netmovie1@ds257551.mlab.com:57551/netmovie-api' };
} else if (process.env.NODE_ENV === 'test') {
  module.exports = { mongoURL: 'mongodb://localhost:27017/netmovie-test' };
} else {
  module.exports = { mongoURL: 'mongodb://localhost:27017/netmovie' };
}
