import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BusinessElement } from "@db/schema";
import { Search, Plus, ExternalLink } from "lucide-react";

type ElementWithRelations = BusinessElement & {
  category: { name: string };
  ownerGroup: { name: string };
};

export function ElementTable() {
  const [search, setSearch] = useState("");
  const { data: elements = [] } = useQuery<ElementWithRelations[]>({ 
    queryKey: ["/api/elements"]
  });

  const filteredElements = elements.filter(
    (el) =>
      el.name.toLowerCase().includes(search.toLowerCase()) ||
      el.description.toLowerCase().includes(search.toLowerCase()) ||
      el.category.name.toLowerCase().includes(search.toLowerCase()) ||
      el.ownerGroup.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/elements/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Element
          </Button>
        </Link>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredElements.map((element) => (
              <TableRow key={element.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{element.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {element.category.name}
                  </span>
                </TableCell>
                <TableCell>{element.ownerGroup.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(element.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/elements/${element.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}