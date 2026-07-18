"use server";

import { Resend } from "resend";
import * as React from "react";
import { PortfolioContactEmail } from "@/emails/portfolio-contact-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  // 1. Provide a fallback if the optional name is left blank
  const name = (formData.get("name") as string) || "Anonymous";
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // 2. Only strictly require email and message
  if (!email || !message) {
    return { error: "Email and message are required." };
  }
  if (message.length < 13) {
    return { error: "Message must be at least 13 characters." };
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "samyb.samir@gmail.com",
      subject: `New Freelance Lead from ${name}`,
      react: React.createElement(PortfolioContactEmail, { name, email, message }),
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send email. Please try again later." };
  }
}