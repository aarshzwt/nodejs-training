const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

console.log(`APP_NAME ${process.env.APP_NAME}`);
console.log(`APP_ENV ${process.env.APP_ENV}`);
console.log(`APP_PORT ${process.env.APP_PORT}`);
console.log(`DEBUG ${process.env.DEBUG}`);

