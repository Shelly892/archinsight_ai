import ProjectList from "@/components/ProjectList";
import { db } from "@/app/lib/db";

async function getProjects() {
  const res = await db.query("SELECT * FROM projects");
  return res.rows;
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-73px)]">
      <ProjectList projects={projects} />
    </div>
  );
}
