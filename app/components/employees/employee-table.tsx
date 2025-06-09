// "use client";

// import {
//   deleteEmployee,
//   getEmployees,
//   updateEmployee,
// } from "@/actions/employee-actions";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { createClient } from "@/lib/supabase/client";
// import React from "react";
// import { User, UserResponse } from "@supabase/supabase-js";
// import { Button } from "../ui/button";
// import { Trash } from "lucide-react";

// export function EmployeeTable({ employees }: { employees: any[] }) {
//   const client = createClient();
//   const [user, setUser] = React.useState<User | null>(null);

//   React.useEffect(() => {
//     const fetchSession = async () => {
//       const { data } = await client.auth.getUser();
//       if (data.user) {
//         setUser(data.user);
//       }
//     };
//     fetchSession();
//   }, [client]);

//   return (
//     <div className="border rounded-lg container mx-auto p-4">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Email</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {employees.map((employee) => (
//             <TableRow key={employee.id}>
//               <TableHead>{employee.user.email}</TableHead>
//               <TableHead>{employee.role}</TableHead>
//               <TableHead>
//                 {user ? (
//                   user.email == employee.user.email ? null : (
//                     <div className="flex gap-2 items-center">
//                       <Button
//                         size="icon"
//                         onClick={() => {
//                           deleteEmployee(employee.id);
//                         }}
//                       >
//                         <Trash />
//                       </Button>
//                       <Button
//                         onClick={() => {
//                           updateEmployee(
//                             employee.id,
//                             employee.role == "admin" ? "moderator" : "admin"
//                           );
//                         }}
//                       >
//                         Change To{" "}
//                         {employee.role == "admin" ? "Moderator" : "Admin"}
//                       </Button>
//                     </div>
//                   )
//                 ) : null}
//               </TableHead>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
