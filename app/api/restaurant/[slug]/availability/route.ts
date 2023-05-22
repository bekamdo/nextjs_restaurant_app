import { parse } from "url";
import { times } from "./../../../../../data";
import { PrismaClient } from "@prisma/client";
import { tr } from "date-fns/locale";
import { findAvailableTables } from "@/services/restaurant/findAvailableTable";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { query } = parse(req.url, true);
  const { slug } = params;
  const { day, time, partySize } = query as {
    day: string;
    time: string;
    partySize: string;
  };

  // http://localhost:3000/api/restaurant/ramakrishna-indian-restaurant-ottawa/availability?day=2023-05-19&time=14:00:00.000Z&partySize=4
  if (!day || !time || !partySize) {
    return new Response(
      JSON.stringify({ errorMessage: "Invalid data provided" })
    );
    {
      status: 400;
    }
  }
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return new Response(JSON.stringify({ message: "Invalid data Provided" }), {
      status: 400,
    });
  }

  const searchTimesWithTable = await findAvailableTables({
    slug,
    day,
    time,
    restaurant,
  });

  if (!searchTimesWithTable) {
    return new Response(JSON.stringify({ Message: "Invalid Data Provided" }), {
      status: 400,
    });
  }

  const availabilities = searchTimesWithTable
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);
      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    })
    .filter((availability) => {
      const timeIsAfterOpeningHour =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      const timeIsAfterClosingHour =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);

      return timeIsAfterOpeningHour && timeIsAfterClosingHour;
    });

  return new Response(JSON.stringify(availabilities), {
    status: 200,
  });
}
