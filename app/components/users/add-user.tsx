import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addEmployee } from "@/actions/employee-actions";
import { useRouter } from "@tanstack/react-router";

export function AddUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("role", role);
      await addEmployee({ data: formData });
      setEmail("");
      setRole("user");
      toast.success("User added successfully");
      router.invalidate();
    } catch (error: any) {
      toast.error(error.message || "Failed to add employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex items-end gap-2 container mx-auto justify-end"
      onSubmit={handleSubmit}
    >
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole} name="role">
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
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter employee email"
          required
        />
      </div>

      <Button type="submit" className="ml-2" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Employee"}
      </Button>
    </form>
  );
}
