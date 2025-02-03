import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ElementForm } from "@/components/elements/element-form";
import { MappingForm } from "@/components/elements/mapping-form";
import { RuleForm } from "@/components/elements/rule-form";
import { RuleTable } from "@/components/elements/rule-table";
import { Button } from "@/components/ui/button";
import { BusinessElement, NewBusinessElement, NewDatabaseMapping, DataQualityRule, NewDataQualityRule } from "@db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus } from "lucide-react";

export default function ElementPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isNew = id === "new";

  const { data: element } = useQuery<BusinessElement>({
    queryKey: [`/api/elements/${id}`],
    enabled: !isNew,
  });

  const createMutation = useMutation({
    mutationFn: async (data: NewBusinessElement) => {
      const res = await apiRequest("POST", "/api/elements", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/elements"] });
      navigate(`/elements/${data.id}`);
      toast({
        title: "Success",
        description: "Element created successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: NewBusinessElement) => {
      const res = await apiRequest("PATCH", `/api/elements/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/elements/${id}`] });
      toast({
        title: "Success",
        description: "Element updated successfully",
      });
    },
  });

  const mappingMutation = useMutation({
    mutationFn: async (data: NewDatabaseMapping) => {
      const res = await apiRequest("POST", `/api/elements/${id}/mappings`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/elements/${id}`] });
      toast({
        title: "Success",
        description: "Mapping added successfully",
      });
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: async (data: NewDataQualityRule) => {
      const res = await apiRequest("POST", `/api/elements/${id}/rules`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/elements/${id}`] });
      toast({
        title: "Success",
        description: "Rule added successfully",
      });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: async (data: DataQualityRule) => {
      const res = await apiRequest("PATCH", `/api/rules/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/elements/${id}`] });
      toast({
        title: "Success",
        description: "Rule updated successfully",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: number) => {
      await apiRequest("DELETE", `/api/rules/${ruleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/elements/${id}`] });
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });
    },
  });

  const handleSubmit = async (data: NewBusinessElement) => {
    if (isNew) {
      await createMutation.mutateAsync(data);
    } else {
      await updateMutation.mutateAsync(data);
    }
  };

  const handleAddMapping = async (data: NewDatabaseMapping) => {
    await mappingMutation.mutateAsync(data);
  };

  const handleAddRule = async (data: NewDataQualityRule) => {
    await createRuleMutation.mutateAsync(data);
  };

  const handleUpdateRule = async (data: DataQualityRule) => {
    await updateRuleMutation.mutateAsync(data);
  };

  const handleDeleteRule = async (ruleId: number) => {
    await deleteRuleMutation.mutateAsync(ruleId);
  };

  if (!isNew && !element) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {isNew ? "New Business Element" : `Edit ${element?.name}`}
      </h1>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {!isNew && <TabsTrigger value="mappings">Database Mappings</TabsTrigger>}
          {!isNew && <TabsTrigger value="rules">Data Quality Rules</TabsTrigger>}
          {!isNew && <TabsTrigger value="versions">Version History</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          <ElementForm onSubmit={handleSubmit} defaultValues={element} />
        </TabsContent>

        {!isNew && (
          <TabsContent value="mappings" className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Mappings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Database</TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Column</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {element?.mappings?.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>{mapping.databaseConfig.name}</TableCell>
                      <TableCell>{mapping.schemaName}</TableCell>
                      <TableCell>{mapping.tableName}</TableCell>
                      <TableCell>{mapping.columnName}</TableCell>
                      <TableCell>{mapping.mappingType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add New Mapping</h3>
              <MappingForm elementId={parseInt(id)} onSubmit={handleAddMapping} />
            </div>
          </TabsContent>
        )}

        {!isNew && (
          <TabsContent value="rules" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Quality Rules</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Data Quality Rule</DialogTitle>
                  </DialogHeader>
                  <RuleForm onSubmit={handleAddRule} />
                </DialogContent>
              </Dialog>
            </div>

            <RuleTable 
              rules={element?.qualityRules || []} 
              onEdit={handleUpdateRule}
              onDelete={handleDeleteRule}
            />
          </TabsContent>
        )}

        {!isNew && (
          <TabsContent value="versions">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Definition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {element?.definitions?.map((def) => (
                  <TableRow key={def.id}>
                    <TableCell>{def.version}</TableCell>
                    <TableCell>{def.createdBy}</TableCell>
                    <TableCell>
                      {new Date(def.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{def.definition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}