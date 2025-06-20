import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addEmployee } from "@/actions/employee-actions";
import { useRouter } from "@tanstack/react-router";

export function AddEmployee() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEmployee({ data: { email, role } });
      toast.success("Employee added successfully");
      setEmail("");
      setRole("moderator");
      router.invalidate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form
      className="flex items-end gap-2 container mx-auto justify-end"
      onSubmit={handleSubmit}
    >
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter employee email"
          required
        />
      </div>
      <Button type="submit" className="ml-2">
        Add Employee
      </Button>
    </form>
  );
}
