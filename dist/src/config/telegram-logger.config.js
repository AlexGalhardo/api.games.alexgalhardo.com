"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
require("dotenv/config");
const constants_util_1 = require("../utils/constants.util");
class TelegramLogger {
    constructor(token = "123", channelId = 123) {
        this.token = token;
        this.channelId = channelId;
        this.isThereToken(token);
        this.isThereChannelId(channelId);
        this.token = token;
        this.channelId = channelId;
        this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    }
    isThereToken(token) {
        if (!token)
            throw new Error("There is no Telegram Token in TelegramLogger Class Constructor");
    }
    isThereChannelId(channelId) {
        if (typeof channelId !== "number" || channelId <= 0) {
            throw new Error("There is no valid Telegram Channel Id in TelegramLogger Class Constructor");
        }
    }
    log(logType, message) {
        if (constants_util_1.ENABLE_TELEGRAM_LOGS) {
            const messageToSend = `${logType}\n\n ${message} \n\n <b>Created at:</b> ${new Date().toISOString()}`;
            const urlParams = encodeURI(`chat_id=${this.channelId}&text=${messageToSend}&parse_mode=HTML`);
            const url = `${this.baseUrl}/sendMessage?${urlParams}`;
            this.sendRequest(url);
        }
    }
    sendRequest(url) {
        https
            .get(url, (res) => {
            const { statusCode } = res;
            if (statusCode !== 200) {
                let data;
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    throw new Error(data);
                });
            }
        })
            .on("error", (error) => {
            throw new Error(error.message);
        });
    }
    error(message) {
        this.log(`🚨 ERROR 🚨`, message);
    }
    info(message) {
        this.log(`💬 INFO 💬`, message);
    }
}
const TelegramLog = new TelegramLogger(process.env.TELEGRAM_BOT_HTTP_TOKEN, Number(process.env.TELEGRAM_BOT_CHANNEL_ID));
exports.default = TelegramLog;
//# sourceMappingURL=telegram-logger.config.js.map