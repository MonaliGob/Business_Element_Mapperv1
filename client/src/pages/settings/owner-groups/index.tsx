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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { OwnerGroupForm } from "@/components/settings/owner-group-form";
import type { OwnerGroup } from "@db/schema";

export default function OwnerGroupsPage() {
  const [open, setOpen] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateGroupName, setDuplicateGroupName] = useState("");

  const { data: groups, isLoading } = useQuery<OwnerGroup[]>({ 
    queryKey: ["/api/owner-groups"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<OwnerGroup, 'id'>) => {
      const res = await apiRequest("POST", "/api/owner-groups", data);
      if (!res.ok) {
        const error = await res.json();
        setDuplicateGroupName(data.name);
        setShowDuplicateAlert(true);
        throw new Error(error.message || "Failed to create owner group");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner-groups"] });
      setOpen(false);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Owner Groups</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Owner Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Owner Group</DialogTitle>
            </DialogHeader>
            <OwnerGroupForm onSubmit={(data) => createMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Owner Group</AlertDialogTitle>
            <AlertDialogDescription>
              An owner group named "{duplicateGroupName}" already exists. 
              Please choose a different name.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-2">
            <AlertDialogCancel onClick={() => setShowDuplicateAlert(false)}>
              OK
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups?.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}