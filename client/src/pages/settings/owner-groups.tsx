import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { OwnerGroupForm } from "@/components/settings/owner-group-form";
import { OwnerGroup } from "@db/schema";
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

export default function OwnerGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<OwnerGroup | null>(null);
  const { toast } = useToast();
  const { data: groups = [] } = useQuery<OwnerGroup[]>({
    queryKey: ["/api/owner-groups"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: OwnerGroup) => {
      const res = await apiRequest("POST", "/api/owner-groups", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner-groups"] });
      toast({
        title: "Success",
        description: "Owner group added successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: OwnerGroup) => {
      const res = await apiRequest(
        "PATCH",
        `/api/owner-groups/${data.id}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner-groups"] });
      toast({
        title: "Success",
        description: "Owner group updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/owner-groups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner-groups"] });
      toast({
        title: "Success",
        description: "Owner group deleted successfully",
      });
    },
  });

  const handleSubmit = async (data: OwnerGroup) => {
    if (selectedGroup) {
      await updateMutation.mutateAsync({ ...data, id: selectedGroup.id });
    } else {
      await createMutation.mutateAsync(data);
    }
    setSelectedGroup(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Owner Groups</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Owner Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Owner Group</DialogTitle>
            </DialogHeader>
            <OwnerGroupForm onSubmit={handleSubmit} />
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
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>
                  {new Date(group.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedGroup(group)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Owner Group</DialogTitle>
                        </DialogHeader>
                        <OwnerGroupForm
                          onSubmit={handleSubmit}
                          defaultValues={group}
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
                          <AlertDialogTitle>Delete Owner Group</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this owner group?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(group.id)}
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
