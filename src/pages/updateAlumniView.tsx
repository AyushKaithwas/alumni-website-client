import AdminLayout from "@/components/myUi/adminLayout";
import { DataTable } from "@/components/myUi/dataTable";
import { useToast } from "@/components/ui/use-toast";
import { Alumni } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type EditableDataKey = "name" | "occupation" | "address" | "email" | "linkedin";

const updateAlumniEndpoint = `${
  import.meta.env.VITE_APP_LOCAL_SERVER_URL
}/api/v1/updatealumni`;

const deleteAlumniEndpoint = `${
  import.meta.env.VITE_APP_LOCAL_SERVER_URL
}/api/v1/delete/`;

export function UpdateAlumniView() {
  // Initialize editableData with an object shape that matches your data
  const { toast } = useToast();
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const editableDataRef = useRef<Alumni>({
    id: -1,
    name: "",
    occupation: "",
    address: "",
    email: "",
    linkedin: "",
  });

  const handleInputChange = (key: EditableDataKey, value: string) => {
    editableDataRef.current[key] = value;
  };

  const queryParams = new URLSearchParams(location.search);
  const school = queryParams.get("school");
  const department = queryParams.get("dept");
  const program = queryParams.get("program");
  const admissionYear = queryParams.get("year");

  const [alumni, setAlumni] = useState<Alumni[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${
        import.meta.env.VITE_APP_LOCAL_SERVER_URL
      }/api/v1/students`;

      let data = { school, department, program, admissionYear };

      try {
        const response = await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
        });
        toast({
          title: "Success",
          description: "Data fetched successfully",
        });
        setAlumni(response.data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Occurred",
          description: error.response.data,
        });
        console.error("There was an error!", error);
      }
    };

    fetchData();
  }, [school, department, program, admissionYear]);

  const columnsUpdateAlumni: ColumnDef<Alumni>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => {
        if (editingRowId === info.row.index) {
          return (
            <input
              className="border border-black rounded-sm"
              defaultValue={alumni[info.row.index]?.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              // //onBlur={() => saveChanges(info.row.index)}
            />
          );
        }
        return info.getValue();
      },
    },
    {
      accessorKey: "occupation",
      header: "Present Occupation",
      cell: (info) => {
        if (editingRowId === info.row.index) {
          return (
            <input
              className="border border-black rounded-sm"
              defaultValue={alumni[info.row.index]?.occupation}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
              required
              //onBlur={() => saveChanges(info.row.index)}
            />
          );
        }
        return info.getValue();
      },
    },
    {
      accessorKey: "address",
      header: "Present Address",
      cell: (info) => {
        if (editingRowId === info.row.index) {
          return (
            <input
              className="border border-black rounded-sm"
              defaultValue={alumni[info.row.index]?.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              //onBlur={() => saveChanges(info.row.index)}
            />
          );
        }
        return info.getValue();
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => {
        if (editingRowId === info.row.index) {
          return (
            <input
              className="border border-black rounded-sm"
              defaultValue={alumni[info.row.index]?.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              //onBlur={() => saveChanges(info.row.index)}
            />
          );
        }
        return info.getValue();
      },
    },
    {
      accessorKey: "linkedin",
      header: "LinkedIn or Personal Webpage",
      cell: (info) => {
        if (editingRowId === info.row.index) {
          return (
            <input
              className="border border-black rounded-sm"
              defaultValue={alumni[info.row.index]?.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              required
              //onBlur={() => saveChanges(info.row.index)}
            />
          );
        }
        return info.getValue();
      },
    },
    {
      accessorKey: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const currentlyEditing = editingRowId === row.index;

        const handleEdit = () => {
          setEditingRowId(row.index);
          // Populate the editableDataRef with the row's data
          editableDataRef.current = {
            id: alumni[row.index].id,
            name: alumni[row.index].name,
            occupation: alumni[row.index].occupation,
            address: alumni[row.index].address,
            email: alumni[row.index].email,
            linkedin: alumni[row.index].linkedin,
          };
        };

        const handleSave = async () => {
          const updatedData = { ...editableDataRef.current };
          if (Object.values(updatedData).some((value) => value === "")) {
            alert("All fields are required");
            return;
          }
          console.log(updatedData);
          try {
            const response = await axios.put(
              updateAlumniEndpoint,
              updatedData,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            console.log("Data saved:", response.data);
            setAlumni((prev) => {
              return prev.map((item) =>
                item.id === updatedData.id ? { ...item, ...updatedData } : item
              );
            });
            setEditingRowId(null); // Exit editing mode

            toast({
              title: "Success",
              description: "Student updated successfully",
            });
          } catch (error: any) {
            console.error("Failed to save changes:", error);

            toast({
              variant: "destructive",
              title: "Error Occurred",
              description: error.response.data,
            });
          }
        };

        const handleDelete = async () => {
          const selectRowData = { ...editableDataRef.current };
          console.log(selectRowData);
          try {
            const response = await axios.delete(
              deleteAlumniEndpoint + selectRowData.id,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            console.log("Data saved:", response.data);
            const alumniWithoutCurrent = alumni.filter(
              (item) => item.id !== selectRowData.id
            );
            setAlumni(alumniWithoutCurrent);
            setEditingRowId(null); // Exit editing mode

            toast({
              title: "Success",
              description: "Student deleted successfully",
            });
          } catch (error: any) {
            console.error("Failed to save changes:", error);

            toast({
              variant: "destructive",
              title: "Error Occurred",
              description: error.response.data,
            });
          }
        };

        return currentlyEditing ? (
          <div className="flex gap-3">
            <button onClick={handleSave}>
              {/* <Save className="w-4" /> */}
              Save
            </button>
            <Dialog>
              <DialogTrigger>Delete</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this Alumni?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the student's information.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Yes, delete Alumni
                    </Button>
                  </DialogClose>
                  <Button type="button" variant="secondary">
                    Go back
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button onClick={() => setEditingRowId(null)}>
              {/* <X className="w-5" /> */}
              Cancel
            </button>
          </div>
        ) : (
          <button className="w-[2rem] h-[2rem]" onClick={handleEdit}>
            {/* <Pencil className="w-4" /> */}
            Edit
          </button>
        );
      },
    },
  ];

  return (
    <AdminLayout className="gap-[5rem] py-0">
      {school && department && admissionYear && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl">Update Alumni Details</h1>
          <p className="">for {school}</p>
          <p className="border border-black py-1 px-4 rounded-sm">
            {program} | {department} | {admissionYear}
          </p>
        </div>
      )}
      <div className="max-w-screen-2xl py-10 w-full">
        <DataTable columns={columnsUpdateAlumni} data={alumni} />
      </div>
    </AdminLayout>
  );
}
