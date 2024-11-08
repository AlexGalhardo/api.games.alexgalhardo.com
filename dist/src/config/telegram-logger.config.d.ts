import "dotenv/config";
declare class TelegramLogger {
    private readonly token;
    private readonly channelId;
    private readonly baseUrl;
    constructor(token?: string, channelId?: number);
    private isThereToken;
    private isThereChannelId;
    private log;
    private sendRequest;
    error(message: string): void;
    info(message: string): void;
}
declare const TelegramLog: TelegramLogger;
export default TelegramLog;
