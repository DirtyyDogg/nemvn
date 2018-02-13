const logger = require('@engine/logger')
const env = require('./env')

const chalk = require('chalk')
const moment = require('moment')
const mongoose = require('mongoose')

const smoothExit = async () => {
  const exit = () => {
    logger.info()
    logger.info(chalk.bold('------[ Server stopped at %s Uptime: %s ]------'), moment().format('YYYY-MM-DD HH:mm:ss.SSS'), moment.duration(process.uptime() * 1000).humanize())
    return process.exit(0)
  }
  if (mongoose.connection.readyState === 0) {
    return exit()
  } else {
    if (env.isTest()) await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    return exit()
  }
}

process.on('SIGINT', smoothExit).on('SIGTERM', smoothExit)
