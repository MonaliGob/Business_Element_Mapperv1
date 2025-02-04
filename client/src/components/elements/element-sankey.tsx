import { useQuery } from "@tanstack/react-query";
import { Sankey, Tooltip } from "recharts";
import { BusinessElement } from "@db/schema";

type SankeyNode = {
  name: string;
};

type SankeyLink = {
  source: number;
  target: number;
  value: number;
};

// Professional blue-based color palette inspired by Citi's branding
const corporateColors = [
  "#002D72", // Citi deep blue
  "#0057B8", // Bright blue
  "#0077C8", // Medium blue
  "#00A1DE", // Light blue
  "#003087", // Navy blue
  "#001F5B", // Dark blue
  "#005587", // Steel blue
  "#007BA7", // Ocean blue
  "#00496D", // Slate blue
  "#003D57"  // Deep slate blue
];

export function ElementSankey() {
  const { data: elements = [] } = useQuery<BusinessElement[]>({
    queryKey: ["/api/elements"],
  });

  // Process data for Sankey diagram
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];
  const nodeMap = new Map<string, number>();

  // Add elements as source nodes
  elements.forEach((element) => {
    if (!nodeMap.has(element.name)) {
      nodeMap.set(element.name, nodes.length);
      nodes.push({ name: element.name });
    }
  });

  // Add database mappings as target nodes and create links
  elements.forEach((element) => {
    if (element.mappings) {
      element.mappings.forEach((mapping) => {
        const targetName = `${mapping.databaseName}.${mapping.schemaName}.${mapping.tableName}`;
        let targetIndex = nodeMap.get(targetName);

        if (targetIndex === undefined) {
          targetIndex = nodes.length;
          nodeMap.set(targetName, targetIndex);
          nodes.push({ name: targetName });
        }

        links.push({
          source: nodeMap.get(element.name)!,
          target: targetIndex,
          value: 1,
        });
      });
    }
  });

  // If no data, show placeholder
  if (nodes.length === 0) {
    return <div>No data available for visualization</div>;
  }

  return (
    <div className="w-full h-[200px] mt-8">
      <h2 className="text-xl font-semibold mb-4">Element Mapping Flow</h2>
      <div className="w-full h-full flex justify-center items-center">
        <Sankey
          width={600}
          height={160}
          data={{ nodes, links }}
          node={{
            fill: (nodeData) => corporateColors[nodeData.index % corporateColors.length],
          }}
          link={{
            stroke: (linkData) => corporateColors[linkData.source % corporateColors.length],
            strokeOpacity: 0.4,
            fill: (linkData) => corporateColors[linkData.source % corporateColors.length],
            fillOpacity: 0.2,
          }}
          margin={{ top: 10, right: 80, bottom: 10, left: 80 }}
          nodeWidth={10}
          nodePadding={60}
        >
          <Tooltip />
        </Sankey>
      </div>
    </div>
  );
}