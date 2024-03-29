import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import AdminLayout from "@/components/myUi/adminLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { DepartmentsData } from "@/assets/school-depts";
import { useAuth } from "@/auth/authProvider";
import { cn } from "@/lib/utils";

export function UpdateAlumni() {
  const user = useAuth();
  console.log(user);
  // const queryParams = new URLSearchParams(location.search);
  // const view = queryParams.get("view");
  const [schoolSelected, setSchoolSelected] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState("");
  const [programSelected, setProgramSelected] = useState("");
  const [addmissionYear, setAddmissionYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isHod) {
      (async () => {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_LOCAL_SERVER_URL}/api/v1/getdepartment`,
          {
            id: user.departmentId,
          }
        );
        console.log(response.data);
        setSchoolSelected(response.data.schoolName);
        setDepartmentSelected(response.data.departmentName);
      })();
    }
  });
  // console.log(response.da);
  return (
    <AdminLayout>
      <h1 className="decoration-2 text-3xl underline underline-offset-[12px]">
        Update Alumni
      </h1>
      <div className="flex flex-col gap-5">
        <Select
          disabled={user.isHod}
          value={schoolSelected}
          onValueChange={setSchoolSelected}
        >
          <SelectTrigger className={cn("w-[280px] rounded-full text-left")}>
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {Object.entries(DepartmentsData).map(([schoolName]) => (
              <SelectItem key={schoolName} value={schoolName}>
                {schoolName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          disabled={!schoolSelected || user.isHod}
          value={departmentSelected}
          onValueChange={setDepartmentSelected}
        >
          <SelectTrigger className="w-[280px] rounded-full text-left">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="rounded-lg text-left">
            {schoolSelected &&
              DepartmentsData[schoolSelected]?.Departments &&
              Object.keys(DepartmentsData[schoolSelected].Departments).map(
                (dept) => {
                  return (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  );
                }
              )}
          </SelectContent>
        </Select>
        <Select
          disabled={!departmentSelected}
          value={programSelected}
          onValueChange={setProgramSelected}
        >
          <SelectTrigger className="w-[280px] rounded-full text-left">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent className="rounded-lg text-left">
            {schoolSelected &&
              departmentSelected &&
              DepartmentsData[schoolSelected]?.Departments &&
              DepartmentsData[schoolSelected].Departments[departmentSelected]
                ?.Programs &&
              Object.keys(
                DepartmentsData[schoolSelected].Departments[departmentSelected]
                  .Programs
              ).map((program) => {
                return (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Year of addmission"
          id="admissionYear"
          className="rounded-full"
          value={addmissionYear}
          onChange={(e) => {
            setAddmissionYear(e.target.value);
          }}
        />
      </div>

      <Button
        disabled={!(programSelected && addmissionYear)}
        className="rounded-full w-[180px]"
        onClick={() => {
          navigate(
            `/adminpanel/updatealumniview/?school=${schoolSelected}&dept=${departmentSelected}&program=${programSelected}&year=${addmissionYear}`
          );
        }}
      >
        Next
      </Button>
    </AdminLayout>
  );
}
