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

// Professional muted blue palette
const corporateColors = [
  "#336B87", // Steel blue
  "#2A3F54", // Dark navy
  "#4682B4", // Classic steel blue
  "#5F9EA0", // Cadet blue
  "#4F6D7A", // Slate
  "#7BA7BC", // Light steel blue
  "#34495E", // Wet asphalt
  "#5D8AA8", // Air force blue
  "#4A708B", // Sky blue deep
  "#4682B4"  // Steel blue alt
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
    <div className="flex flex-col w-full" style={{ height: "400px" }}>
      <h2 className="text-xl font-semibold mb-4">Element Mapping Flow</h2>
      <div className="flex-1">
        <Sankey
          width={800}
          height={350}
          data={{ nodes, links }}
          node={{
            fill: (nodeData) => corporateColors[nodeData.index % corporateColors.length],
            opacity: 0.9,
          }}
          link={{
            stroke: (linkData) => corporateColors[linkData.source % corporateColors.length],
            strokeOpacity: 0.2,
            fill: (linkData) => corporateColors[linkData.source % corporateColors.length],
            fillOpacity: 0.1,
          }}
          margin={{
            top: 20,
            right: 100,
            bottom: 20,
            left: 100,
          }}
          nodeWidth={20}
          nodePadding={50}
          iterations={64}
        >
          <Tooltip />
        </Sankey>
      </div>
    </div>
  );
}