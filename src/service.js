const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose')
const CronJob = require('cron').CronJob;
const { sendPhoto } = require('./utils')

let connectMongoose = () => {
    mongoose.connect(
        process.env.DB_URL, 
        { useNewUrlParser: true },
        ()=>{
            console.log('Connected to Mongodb Tranquility' ) 
            startBot()
        }
    );
    mongoose.set('useCreateIndex', true);
}

let startBot = () => {
    const token = process.env.TelegramToken;
    let bot = new TelegramBot(token, {polling: true});
    require('./listener')(bot)
    startCronJob(bot)
}

let startCronJob = (bot) => {
    // let cronExp = '0 10 * * 1-5'  //weekday 10:00 am
    let cronExp = process.env.cronExp
    if( !cronExp ){ return }
    new CronJob(cronExp, () => {
        sendPhoto(bot)
    }, null, true, 'Asia/Hong_Kong');
}

module.exports = {
    connectMongoose
}