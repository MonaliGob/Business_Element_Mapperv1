import { ElementTable } from "@/components/elements/element-table";

export default function ElementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Business Elements</h1>
      <ElementTable />
    </div>
  );
}