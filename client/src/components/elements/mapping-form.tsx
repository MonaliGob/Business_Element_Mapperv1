import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewDatabaseMapping } from "@db/schema";

const mappingSchema = z.object({
  databaseName: z.string().min(1, "Database name is required"),
  schemaName: z.string().min(1, "Schema name is required"),
  tableName: z.string().min(1, "Table name is required"),
  columnName: z.string().min(1, "Column name is required"),
  mappingType: z.enum(["direct", "derived", "calculated"]),
});

type MappingFormProps = {
  elementId: number;
  onSubmit: (data: NewDatabaseMapping) => void;
};

export function MappingForm({ elementId, onSubmit }: MappingFormProps) {
  const form = useForm<NewDatabaseMapping>({
    resolver: zodResolver(mappingSchema),
    defaultValues: {
      elementId,
      databaseName: "",
      schemaName: "",
      tableName: "",
      columnName: "",
      mappingType: "direct",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="databaseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schemaName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schema Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tableName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="columnName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Column Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mappingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mapping Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mapping type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="derived">Derived</SelectItem>
                  <SelectItem value="calculated">Calculated</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Mapping</Button>
      </form>
    </Form>
  );
}
