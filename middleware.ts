import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const bearerToken = req.headers.get("authorization");

  if (!bearerToken) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized requests" }),
      {
        status: 401,
      }
    );
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized requests" }),
      {
        status: 401,
      }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized requests" }),
      {
        status: 401,
      }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/me/"],
};
