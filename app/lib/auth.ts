import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { admin, role } from "better-auth/plugins";
import { createTransport } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

const prisma = new PrismaClient();

const transporter = createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  auth: { user: "user", pass: "pass" },
});

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
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
    },
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
      role: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [admin({ adminRoles: ["admin", "superadmin", "moderator"] })],
});
