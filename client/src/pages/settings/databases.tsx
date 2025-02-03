import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DatabaseConfigForm } from "@/components/settings/database-config-form";
import { DatabaseConfig } from "@db/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DatabasesPage() {
  const [selectedConfig, setSelectedConfig] = useState<DatabaseConfig | null>(null);
  const { toast } = useToast();
  const { data: configs = [] } = useQuery<DatabaseConfig[]>({
    queryKey: ["/api/database-configs"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: DatabaseConfig) => {
      const res = await apiRequest("POST", "/api/database-configs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/database-configs"] });
      toast({
        title: "Success",
        description: "Database configuration added successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: DatabaseConfig) => {
      const res = await apiRequest(
        "PATCH",
        `/api/database-configs/${data.id}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/database-configs"] });
      toast({
        title: "Success",
        description: "Database configuration updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/database-configs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/database-configs"] });
      toast({
        title: "Success",
        description: "Database configuration deleted successfully",
      });
    },
  });

  const handleSubmit = async (data: DatabaseConfig) => {
    if (selectedConfig) {
      await updateMutation.mutateAsync({ ...data, id: selectedConfig.id });
    } else {
      await createMutation.mutateAsync(data);
    }
    setSelectedConfig(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Database Configurations</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Database
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Database Configuration</DialogTitle>
            </DialogHeader>
            <DatabaseConfigForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-medium">{config.name}</TableCell>
                <TableCell>{config.description}</TableCell>
                <TableCell>
                  {new Date(config.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedConfig(config)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Database Configuration</DialogTitle>
                        </DialogHeader>
                        <DatabaseConfigForm
                          onSubmit={handleSubmit}
                          defaultValues={config}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Database Configuration</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this database configuration?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(config.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
