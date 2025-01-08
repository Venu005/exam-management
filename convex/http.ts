import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";
const http = httpRouter();

const clerkWebhook = httpAction(async (ctx, req) => {
  const webHookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webHookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }
  // using svix
  const svix_id = req.headers.get("svix-id");
  const svix_signature = req.headers.get("svix-signature");
  const svix_timestamp = req.headers.get("svix-timestamp");
  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured --no svix", {
      status: 400,
    });
  }
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(webHookSecret);
  // get the event
  let evt: WebhookEvent;
  // use the event
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook", error);
    return new Response("Error occured", {
      status: 400,
    });
  }
  const evtType = evt.type;
  // get it from clerk-webhook
  if (evtType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      await ctx.runMutation(api.user.createUser, {
        email,
        name,
        clerkId: id,
      });
    } catch (error) {
      console.error("Error in creating a user in convex", error);
      return new Response("Error creating user", { status: 500 });
    }
  }
  return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});
export default http;
