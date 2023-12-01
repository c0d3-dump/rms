import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "../ui/card";

export interface EmployeeState {
  employeeId: number;
  name: string;
  contact: string;
}

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<EmployeeState[]>();

  const fetchEmployees = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Employees`).then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const ondeleteEmployee = useCallback(
    (employeeId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Employees/${employeeId}`).then(() => {
        fetchEmployees();
      });
    },
    [fetchEmployees]
  );

  return (
    <>
      <h1 className="ml-6 my-6 text-2xl font-bold">Employees</h1>

      <div className="mb-6">
        <AddEmployeeComponent
          fetchEmployees={fetchEmployees}
        ></AddEmployeeComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {employeeData?.map((employee) => (
              <TableRow key={employee.employeeId}>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.contact}</TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ondeleteEmployee(employee.employeeId)}
                  >
                    <Trash></Trash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface AddEmployeeComponentProps {
  fetchEmployees: () => void;
}

export function AddEmployeeComponent(props: AddEmployeeComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    contact: z.string({ required_error: "Contact is required" }).min(5).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddEmployee = useCallback(async () => {
    const employeeData = {
      name: form.getValues().name,
      contact: form.getValues().contact,
    };

    await axios.post(`${env.SERVER_URL}/api/Employees`, employeeData);
    form.reset();
    form.setValue("name", "");
    form.setValue("contact", "");
    props.fetchEmployees();
  }, [form, props]);

  return (
    <Card>
      <CardContent className="bg-gray-400 flex space-x-4 py-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-auto">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="flex-auto">
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Contact" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <Button
          type="button"
          className="mt-auto"
          disabled={!form.formState.isValid}
          onClick={onAddEmployee}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
