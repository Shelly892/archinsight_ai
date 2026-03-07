import { db } from "@/app/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db.query("SELECT id, architect, title, year, location, area, gallery, description,embedding FROM projects WHERE id=$1", [id]);

  return Response.json(result.rows[0]);
}

// type Context = {
//   params: {
//     id: string;
//   };
// };

// export async function GET(req: Request, context: Context) {
//   const { params } = context;

//   console.log(params.id);
// }
