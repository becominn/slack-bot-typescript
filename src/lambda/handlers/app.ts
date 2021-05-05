import { App, ExpressReceiver } from "@slack/bolt";
import * as awsServerlessExpress from "aws-serverless-express";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

const processBeforeResponse = true;

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? "", // Lambdaの環境変数から取得
  processBeforeResponse,
});
const app = new App({
  token: process.env.SLACK_BOT_TOKEN, // Lambdaの環境変数から取得
  receiver: expressReceiver,
  processBeforeResponse,
});

const server = awsServerlessExpress.createServer(expressReceiver.app);
export const handler = (
  event: APIGatewayProxyEvent,
  context: Context
): void => {
  awsServerlessExpress.proxy(server, event, context);
};

// "hello"が含まれているメッセージを受信した場合の処理
app.message("hello", async ({ message, say }) => {
  await say(`Hey, <@${message.user}>`);
});


// ローカル起動時であれば実行
if (process.env.IS_LOCAL === "true") {
  (async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
  })();
}