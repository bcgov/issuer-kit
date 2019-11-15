const config = require('dotenv').config;
const path = require('path');

const val = config({ path: path.resolve(__dirname, './config.env') });
