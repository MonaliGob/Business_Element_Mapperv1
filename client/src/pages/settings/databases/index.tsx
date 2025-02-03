import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatabaseForm } from "@/components/settings/database-form";
import type { DatabaseConfig } from "@db/schema";

export default function DatabasesPage() {
  const [open, setOpen] = useState(false);
  const { data: databases } = useQuery<DatabaseConfig[]>({ 
    queryKey: ["/api/database-configs"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<DatabaseConfig, 'id'>) => {
      const res = await apiRequest("POST", "/api/database-configs", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/database-configs"] });
      setOpen(false);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Database Configurations</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Database</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Database Configuration</DialogTitle>
            </DialogHeader>
            <DatabaseForm onSubmit={(data) => createMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Connection URL</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {databases?.map((db) => (
              <TableRow key={db.id}>
                <TableCell>{db.name}</TableCell>
                <TableCell className="font-mono text-sm">{db.connectionUrl}</TableCell>
                <TableCell>{db.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
