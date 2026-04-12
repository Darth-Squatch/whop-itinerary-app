import Whop from "@whop/sdk";

const apiKey = process.env.WHOP_API_KEY;
const appID = process.env.WHOP_APP_ID;

if (!apiKey) {
  console.warn("Missing WHOP_API_KEY environment variable.");
}

if (!appID) {
  console.warn("Missing WHOP_APP_ID environment variable.");
}

export const whopsdk = new Whop({
  apiKey,
  appID
});
