import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";

import Cookies from "js-cookie";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const errors: string[] = [];
  const { firstName, lastName, email, phone, city, password } =
    await req.json();

  const validationSchema = [
    {
      valid: validator.isLength(firstName, { min: 1, max: 20 }),
      errorMessage: "First name is invalid",
    },
    {
      valid: validator.isLength(lastName, { min: 1, max: 20 }),
      errorMessage: "Last name is invalid",
    },
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: "Phone number is invalid",
    },
    {
      valid: validator.isLength(city, { min: 1 }),
      errorMessage: "City is invalid",
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: "Password is not strong enough",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length) {
    return new Response(JSON.stringify({ errorMessage: errors[0] }), {
      status: 400,
    });
  }

  const userWithEmail = await prisma.user.findUnique({ where: { email } });

  if (userWithEmail) {
    return new Response(
      JSON.stringify({
        errorMessage: "Email is associated with another account",
      }),
      {
        status: 400,
      }
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      password: hashPassword,
      city,
      phone,
      email,
    },
  });

  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({
    email: user.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  Cookies.set("jwt", token);

  return new Response(
    JSON.stringify({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    }),
    { status: 200 }
  );
}
