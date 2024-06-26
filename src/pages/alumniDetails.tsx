import { Navbar } from "@/components/myUi/navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { columnsViewAlumni } from "@/components/myUi/columns";
import { DataTable } from "@/components/myUi/dataTable";
import axios from "axios";
import { Alumni } from "@/lib/types";
import useFetchAlumni from "@/hooks/useFetchAlumni";
import { Layout } from "@/components/myUi/layout";

export function AlumniDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const school = queryParams.get("school");
  const department = queryParams.get("department");
  const program = queryParams.get("program");
  const admissionYear = queryParams.get("year");
  let alumni: Alumni[] = [];
  // const [alumni, setAlumni] = useState<Alumni[]>([]);
  if (school && department && program && admissionYear) {
    alumni = useFetchAlumni(school, department, program, admissionYear);
  }
  return (
    <Layout className="flex-col">
      {school && department && admissionYear && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl">Alumni Details</h1>
          <p className="">for {school}</p>
          <p className="border border-black py-1 px-4 rounded-sm">
            {program} | {department} | {admissionYear}
          </p>
        </div>
      )}
      <div className="container mx-auto py-10">
        <DataTable columns={columnsViewAlumni} data={alumni} />
      </div>
    </Layout>
  );
}
