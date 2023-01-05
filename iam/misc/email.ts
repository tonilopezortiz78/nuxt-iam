// Email services
import sgMail from "@sendgrid/mail";
import { H3Error } from "h3";
import nodemailer from "nodemailer";
import { EmailOptions } from "~~/iam/misc/types";

const config = useRuntimeConfig();

/**
 * @desc Sends email with Sendgrid
 * @param options Email message options like to, from etc.
 * @returns {Promise<H3Error | true>}
 */
export async function emailWithSendgrid(
  options: EmailOptions
): Promise<H3Error | true> {
  const apiKey = config.iamSendGridApiKey;
  let emailError = null;

  // If Sendgrid api key not found
  if (!apiKey) {
    console.log("Sendgrid Api key not found. Cannot send email. Aborting.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Attempting to send mail with Sendgrid
  sgMail.setApiKey(apiKey);

  // Create messag object
  const msg = {
    to: options.to,
    from: options.from, // Change to your verified sender
    subject: options.subject,
    text: options.text ? options.text : "",
    html: options.html ? options.html : options.text,
  };

  console.log("=======SENDGRID EMAIL OPTIONS =========================");
  console.log("from: ", msg.from);
  console.log("to: ", msg.to);
  console.log("subject: ", msg.subject);
  console.log("text: ", msg.text);
  console.log("html: ", msg.html);
  console.log("=======SENDGRID EMAIL OPTIONS END=========================");

  // Send email
  console.log("Attempting to send email with Sendgrid");
  console.log(
    "Sendgrid requires verified senders. Make sure your sender is verified by Sendgrid."
  );
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      emailError = error;
    });

  // If error, return error
  if (emailError) {
    console.log("Error when sending email in Sendgrid");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // If successful
  return true;
}

/**
 *@desc Sends email using Nodemailer service (e.g. hotmail)
 * @param senderEmail Sender's email address
 * @param senderPassword Sender's password
 * @param service Sender's service such as hotmail
 * @param options Options for email such as to, from, subject etc.
 * @returns
 */
export async function emailWithNodemailerService(
  senderEmail: string,
  senderPassword: string,
  service: string,
  options: EmailOptions
): Promise<H3Error | true> {
  // Error flag
  let errorFound = null;

  const emailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Sending email using nodemailer-service
  console.log("Attempting to send mail using nodemailer-service");

  if (!service) {
    console.log("Error: Service not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for email user
  if (!senderEmail) {
    console.log("Error: Sender email not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for password
  if (!senderPassword) {
    console.log("Error: Email password not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: service,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  // Check if email server is ready to take our messages
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      console.log("Email server verify problem");
      errorFound = error;
    } else {
      console.log("Server is ready to take our messages");
      console.log("Success: ", success);
    }
  });

  // If transporter verify error, return
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Attempt to send email
  transporter.sendMail(emailOptions, (err, result) => {
    console.log(
      `Attempting to send email to reset password for user: ${options.to}`
    );

    // If error, log error and return
    if (err) {
      console.log(err);
      errorFound = err;
      console.log("Send reset password email error");
    } else {
      console.log("Email successfully sent");
      console.log("Email result: ", result);
    }
  });

  // If errorFound, return error
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Otherwise successful
  return true;
}

/**
 * @desc Sends email using Nodemailer SMTP
 * @param senderEmail Sender's email address
 * @param senderPassword Sender's password
 * @param host Email server host
 * @param port Email server port
 * @param options Options for email such as to, from, subject etc.
 * @returns
 */
export async function emailWithNodemailerSmtp(
  senderEmail: string,
  senderPassword: string,
  host: string,
  port: string,
  options: EmailOptions
): Promise<H3Error | true> {
  // Error flag
  let errorFound = null;

  const emailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Sending email using nodemailer-service
  console.log("Attempting to send mail using nodemailer-service");

  if (!host) {
    console.log("Error: Email host not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for email user
  if (!senderEmail) {
    console.log("Error: Sender email not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for password
  if (!senderPassword) {
    console.log("Error: Sender password not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    pool: true,
    host: host,
    port: port,
    secure: true, // use TLS
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  // Check if email server is ready to take our messages
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      console.log("Email server verify problem");
      errorFound = error;
    } else {
      console.log("Server is ready to take our messages");
      console.log("Success: ", success);
    }
  });

  // If transporter verify error, return
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Attempt to send email
  transporter.sendMail(emailOptions, (err, result) => {
    console.log(
      `Attempting to send email to reset password for user: ${options.to}`
    );

    // If error, log error and return
    if (err) {
      console.log(err);
      errorFound = err;
      console.log("Send reset password email error");
    } else {
      console.log("Email successfully sent");
      console.log("Email result: ", result);
    }
  });

  // If errorFound, return error
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Otherwise successful
  return true;
}