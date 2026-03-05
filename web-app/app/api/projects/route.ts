import { db } from "@/app/lib/db";

export async function GET() {
  const res = await db.query("SELECT * FROM projects");
  return Response.json(res.rows);
}