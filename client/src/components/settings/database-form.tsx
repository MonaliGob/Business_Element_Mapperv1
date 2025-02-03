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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { DatabaseConfig } from "@db/schema";

const databaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  connectionUrl: z.string().min(1, "Connection URL is required"),
  description: z.string().optional(),
});

type DatabaseFormProps = {
  onSubmit: (data: Omit<DatabaseConfig, 'id'>) => void;
  defaultValues?: Partial<DatabaseConfig>;
};

export function DatabaseForm({ onSubmit, defaultValues }: DatabaseFormProps) {
  const form = useForm<Omit<DatabaseConfig, 'id'>>({
    resolver: zodResolver(databaseSchema),
    defaultValues: defaultValues || {
      name: "",
      connectionUrl: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connectionUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="postgresql://user:pass@host:5432/db" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Database</Button>
      </form>
    </Form>
  );
}
