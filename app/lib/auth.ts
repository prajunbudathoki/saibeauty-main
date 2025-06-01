import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { admin } from "better-auth/plugins";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const prisma = new PrismaClient();

const transporter = createTransport({
  // host: process.env.SMTP_HOST!,
  // port: Number(process.env.SMTP_PORT),
  // secure: process.env.SMTP_SECURE === "true",
  // auth: {
  //   user: process.env.SMTP_USER,
  //   pass: process.env.SMTP_PASS,
  // },
  host: "localhost",
  port: 1025,
  secure: false,
  // auth: { user: "user", pass: "pass" },
});
// console.log("SMTP_HOST:", process.env.SMTP_HOST);
// console.log("SMTP_PORT:", process.env.SMTP_PORT);
// console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
// console.log("SMTP_USER:", process.env.SMTP_USER);

async function sendEmail(options: Mail) {
  return await transporter.sendMail({
    from: '"Sai Beauty Salon" <noreply@saibeauty.com>',
    ...options,
  });
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
    },
    // requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
      });
    },
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  plugins: [admin({ adminRoles: ["admin", "superadmin"] })],
});
