import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.customer.findMany();
  return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone || null,
        carType: body.carType || null,
        model: body.model || null,
        chassis: body.chassis || null,
      },
    });

    return Response.json(customer);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}