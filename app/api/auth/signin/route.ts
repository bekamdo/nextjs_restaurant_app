import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const errors: string[] = [];

  const prisma = new PrismaClient();

  const validationSchema = [
    { valid: validator.isEmail(email), errorMessage: "Email is Invalid" },
    {
      valid: validator.isLength(password, { min: 1 }),
      errorMessage: "Password is Invalid",
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

  if (!userWithEmail) {
    return new Response(
      JSON.stringify({ Errormessage: "Email or Password is Invalid" }),
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, userWithEmail.password);

  if (!isMatch) {
    return new Response(
      JSON.stringify({ Errormessage: "Email or Password is Invalid" }),
      { status: 401 }
    );
  }

  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({
    email: userWithEmail.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  cookies().set("jwt", token);

  return new Response(
    JSON.stringify({
      firstName: userWithEmail.first_name,
      lastName: userWithEmail.last_name,
      email: userWithEmail.email,
      phone: userWithEmail.phone,
      city: userWithEmail.city,
    }),
    {
      status: 200,
    }
  );

  return new Response(JSON.stringify({ message: "User has sign in" }), {
    status: 200,
  });
}
