import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BusinessElement } from "@db/schema";
import { Link } from "wouter";
import { Database, List, User } from "lucide-react";
import { ElementSankey } from "@/components/elements/element-sankey";

export default function Home() {
  const { data: elements = [] } = useQuery<BusinessElement[]>({
    queryKey: ["/api/elements"],
  });

  const stats = {
    total: elements.length,
    categories: new Set(elements.map((el) => el.category)).size,
    owners: new Set(elements.map((el) => el.owner)).size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Business Element Manager
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and track your business elements, definitions, and database mappings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Elements</CardTitle>
              <List className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Business elements in system
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Distinct categories
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Owners</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.owners}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique element owners
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white p-6">
          <ElementSankey />
        </Card>

        <div className="mt-8">
          <Link href="/elements">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              View all elements →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}