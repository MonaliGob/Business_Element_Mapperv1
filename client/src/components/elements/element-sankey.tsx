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

// Pastel colors array
const pastelColors = [
  "#FFB3BA", // pastel pink
  "#BAFFC9", // pastel green
  "#BAE1FF", // pastel blue
  "#FFFFBA", // pastel yellow
  "#FFB3F7", // pastel purple
  "#E0BBE4", // pastel lavender
  "#957DAD", // pastel violet
  "#FEC8D8", // pastel salmon
  "#D4F0F0", // pastel turquoise
  "#FFDFD3"  // pastel peach
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
    <div className="w-full h-[400px] mt-8">
      <h2 className="text-xl font-semibold mb-4">Element Mapping Flow</h2>
      <div className="w-full h-full">
        <Sankey
          width={800}
          height={400}
          data={{ nodes, links }}
          node={{
            colors: pastelColors,
            onClick: (nodeData: any) => {
              console.log("Clicked node:", nodeData);
            },
          }}
          link={{
            stroke: (linkData: any) => {
              // Get source node's color for the link
              const sourceColor = pastelColors[linkData.source % pastelColors.length];
              return sourceColor;
            },
            strokeOpacity: 0.4,
            fill: (linkData: any) => {
              // Get source node's color for the link
              const sourceColor = pastelColors[linkData.source % pastelColors.length];
              return sourceColor;
            },
            fillOpacity: 0.2,
          }}
          margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          nodeWidth={10}
          nodePadding={60}
        >
          <Tooltip />
        </Sankey>
      </div>
    </div>
  );
}