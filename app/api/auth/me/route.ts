import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const bearerToken = req.headers.get("authorization");
  if (!bearerToken) {
    return new Response(JSON.stringify("error"), { status: 401 });
  }
  const token = bearerToken.split(" ")[1];
  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    return new Response(JSON.stringify({ message: "Unauthorized requests" }), {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  if (!user) {
    return new Response(JSON.stringify("User not found"), { status: 401 });
  }

  return new Response(
    JSON.stringify({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      city: user.city,
    }),
    { status: 200 }
  );
}
