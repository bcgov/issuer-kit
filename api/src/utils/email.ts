import { HookContext } from "@feathersjs/feathers";

export async function sendEmail(context: HookContext) {
  const email = {
    to: context.data.email,
    subject: "SMTP test",
    html: "This is the email body",
  };
  await context.app.service("mailer").create(email);
  return context;
}
