import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
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
import { UserForm } from "@/components/admin/user-form";
import { ProjectAssignmentForm } from "@/components/admin/project-assignment-form";
import { ProjectForm } from "@/components/admin/project-form";
import type { User, BusinessElement } from "@db/schema";

export default function AdminPage() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: currentUser?.isAdmin ?? false,
  });

  const { data: projects } = useQuery<BusinessElement[]>({
    queryKey: ["/api/elements"],
    enabled: currentUser?.isAdmin ?? false,
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: Omit<User, "id">) => {
      const res = await apiRequest("POST", "/api/admin/users", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setUserDialogOpen(false);
    },
  });

  const assignProjectMutation = useMutation({
    mutationFn: async (data: { userId: number; elementId: number; role: string }) => {
      const res = await apiRequest("POST", "/api/admin/assign-project", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setAssignmentDialogOpen(false);
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: Partial<BusinessElement>) => {
      const projectData = {
        ...data,
        categoryId: 1, 
        ownerGroupId: 1, 
      };
      const res = await apiRequest("POST", "/api/elements", projectData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/elements"] });
      setProjectDialogOpen(false);
    },
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50/50 to-white p-8">
        <h1 className="text-3xl font-bold text-red-900">Access Denied</h1>
        <p className="mt-4">You must be an admin to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="space-x-4">
          <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <UserForm onSubmit={(data) => createUserMutation.mutate(data)} />
            </DialogContent>
          </Dialog>

          <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <ProjectForm onSubmit={(data) => createProjectMutation.mutate(data)} />
            </DialogContent>
          </Dialog>

          <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
            <DialogTrigger asChild>
              <Button>Assign Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign User to Project</DialogTitle>
              </DialogHeader>
              <ProjectAssignmentForm 
                onSubmit={(data) => assignProjectMutation.mutate(data)}
                users={users || []}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg border shadow">
          <h2 className="text-xl font-semibold p-4 border-b">Users</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Assigned Projects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.projects?.map((p) => (
                      <div key={p.id} className="text-sm">
                        {p.element.name} ({p.role})
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-lg border shadow">
          <h2 className="text-xl font-semibold p-4 border-b">Projects</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.category?.name}</TableCell>
                  <TableCell>{project.ownerGroup?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}