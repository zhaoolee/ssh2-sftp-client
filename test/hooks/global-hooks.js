'use strict';

const dotenvPath = __dirname + '/../../.env';

require('dotenv').config({path: dotenvPath});

const Client = require('../../src/index.js');
const {join} = require('path');

// use your test ssh server config
const config = {
  host: process.env.SFTP_SERVER,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD,
  port: process.env.SFTP_PORT || 22,
  localUrl: process.env.LOCAL_URL,
  sftpUrl: process.env.SFTP_URL,
  delay: process.env.TEST_DELAY || 500,
  retries: 1
};

if (process.env.DEBUG === 'true') {
  config.debug = msg => {
    console.error(msg);
  };
}

const makeLocalPath = (...args) => {
  return join(...args);
};

const makeRemotePath = (...args) => {
  if (process.env.TEST_SERVER === 'unix') {
    return args.join('/');
  }
  return args.join('\\');
};

const getConnection = async name => {
  try {
    let con = new Client();
    await con.connect(config);
    return con;
  } catch (err) {
    console.error(`${name}: Connect failure ${err.message}`);
    console.dir(config);
    throw err;
  }
};

const closeConnection = async (name, con) => {
  try {
    if (con) {
      await con.end();
    }
    return true;
  } catch (err) {
    console.error(`${name}: Connection close failure: ${err.message}`);
    throw err;
  }
};

module.exports = {
  config,
  makeLocalPath,
  makeRemotePath,
  getConnection,
  closeConnection
};
