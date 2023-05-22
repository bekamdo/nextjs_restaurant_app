import { findAvailableTables } from "@/services/restaurant/findAvailableTable";
import { PrismaClient } from "@prisma/client";
import { parse } from "url";

const prisma = new PrismaClient();
export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { query } = parse(req.url, true);

  const { day, time, partySize } = query as {
    day: string;
    time: string;
    partySize: string;
  };

  const {
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  } = await req.json();

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
      id: true,
    },
  });

  if (!restaurant) {
    return new Response(JSON.stringify({ message: "Invalid Data Provided" }), {
      status: 400,
    });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return new Response(
      JSON.stringify({ message: "restaurant is not open at that time" }),
      { status: 400 }
    );
  }

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    slug,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return new Response(JSON.stringify({ message: "Invalid data Provided" }), {
      status: 400,
    });
  }

  const searchTimeWithTable = searchTimesWithTables.find((t) => {
    return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
  });

  const tableCount: { 2: number[]; 4: number[] } = {
    2: [],
    4: [],
  };

  if (!searchTimeWithTable) {
    return new Response(
      JSON.stringify({ message: "No avialabilty,cannot book" }),
      {
        status: 400,
      }
    );
  }
  searchTimeWithTable.tables.forEach((table) => {
    if (table.seats === 2) {
      tableCount[2].push(table.id);
    } else {
      tableCount[4].push(table.id);
    }
  });

  const tablesToBook: number[] = [];

  let seatsRemaining = parseInt(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tableCount[4].length) {
        tablesToBook.push(tableCount[4][0]);
        tableCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      } else {
        tablesToBook.push(tableCount[2][0]);
        tableCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      }
    } else {
      if (tableCount[2].length) {
        tablesToBook.push(tableCount[2][0]);
        tableCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      } else {
        tablesToBook.push(tableCount[4][0]);
        tableCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_people: parseInt(partySize),
      booking_time: new Date(`${day}T${time}`),
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      restaurant_id: restaurant.id,
    },
  });

  const bookingsOnTablesData = tablesToBook.map((table_id) => {
    return {
      table_id,
      booking_id: booking.id,
    };
  });

  await prisma.bookingsOnTable.createMany({
    data: bookingsOnTablesData,
  });

  return new Response(JSON.stringify({ booking }), {
    status: 200,
  });
}
