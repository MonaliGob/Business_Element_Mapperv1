import { db } from "@db";
import { businessElements, databaseMappings, databaseConfigs, categories, ownerGroups } from "@db/schema";

const categoryNames = [
  "Customer",
  "Financial",
  "Product",
  "Sales",
  "Employee",
  "Marketing",
  "Operations",
  "Inventory"
];

const ownerGroupNames = [
  "Data Team",
  "Finance Department",
  "Sales Team",
  "HR Department",
  "Product Team"
];

const databases = [
  { name: "CustomerDB", schemas: ["public", "analytics"] },
  { name: "FinanceDB", schemas: ["accounting", "reporting"] },
  { name: "ProductDB", schemas: ["inventory", "catalog"] },
  { name: "EmployeeDB", schemas: ["hr", "payroll"] },
];

const elementTemplates = [
  // Customer elements
  { name: "Customer ID", categoryName: "Customer", ownerName: "Data Team", description: "Unique identifier for customer records" },
  { name: "Customer Name", categoryName: "Customer", ownerName: "Data Team", description: "Full name of the customer" },
  { name: "Customer Email", categoryName: "Customer", ownerName: "Data Team", description: "Primary email address for customer communication" },
  // Financial elements
  { name: "Revenue", categoryName: "Financial", ownerName: "Finance Department", description: "Total revenue from all sources" },
  { name: "Operating Cost", categoryName: "Financial", ownerName: "Finance Department", description: "Total operational costs" },
  { name: "Profit Margin", categoryName: "Financial", ownerName: "Finance Department", description: "Profit margin percentage" },
  // Product elements
  { name: "Product SKU", categoryName: "Product", ownerName: "Product Team", description: "Stock keeping unit for product identification" },
  { name: "Product Name", categoryName: "Product", ownerName: "Product Team", description: "Name of the product" },
  { name: "Product Category", categoryName: "Product", ownerName: "Product Team", description: "Category classification of product" },
];

// Generate 100 elements by combining base elements with variations
const generateElements = (categoryMap: Map<string, number>, ownerMap: Map<string, number>) => {
  const allElements = [];
  const baseElements = elementTemplates;

  for (let i = 0; i < Math.ceil(100 / baseElements.length); i++) {
    baseElements.forEach((base) => {
      if (allElements.length >= 100) return;

      const element = {
        name: i === 0 ? base.name : `${base.name} ${i + 1}`,
        description: base.description,
        categoryId: categoryMap.get(base.categoryName)!,
        ownerGroupId: ownerMap.get(base.ownerName)!,
      };

      allElements.push(element);
    });
  }

  return allElements;
};

// Generate mappings for an element
const generateMappings = (elementId: number, dbConfigMap: Map<string, number>) => {
  const mappings = [];
  const mappingTypes = ["direct", "derived", "calculated"];
  const numMappings = Math.floor(Math.random() * 3) + 1; // 1-3 mappings per element

  for (let i = 0; i < numMappings; i++) {
    const db = databases[Math.floor(Math.random() * databases.length)];
    const schema = db.schemas[Math.floor(Math.random() * db.schemas.length)];

    mappings.push({
      elementId,
      databaseConfigId: dbConfigMap.get(db.name)!,
      schemaName: schema,
      tableName: `tbl_${schema}_data`,
      columnName: `col_${Math.random().toString(36).substring(7)}`,
      mappingType: mappingTypes[Math.floor(Math.random() * mappingTypes.length)],
      transformationLogic: i === 2 ? { formula: "CONCAT(col1, ' ', col2)" } : null,
    });
  }

  return mappings;
};

// Insert reference data first
async function insertReferenceData() {
  const categoryMap = new Map<string, number>();
  const ownerMap = new Map<string, number>();
  const dbConfigMap = new Map<string, number>();

  // Insert categories
  for (const name of categoryNames) {
    const [category] = await db
      .insert(categories)
      .values({ name, description: `${name} related elements` })
      .returning();
    categoryMap.set(name, category.id);
  }

  // Insert owner groups
  for (const name of ownerGroupNames) {
    const [ownerGroup] = await db
      .insert(ownerGroups)
      .values({ name, description: `${name} ownership group` })
      .returning();
    ownerMap.set(name, ownerGroup.id);
  }

  // Insert database configs
  for (const database of databases) {
    const [config] = await db
      .insert(databaseConfigs)
      .values({
        name: database.name,
        connectionUrl: `postgresql://user:pass@${database.name.toLowerCase()}.example.com:5432/db`,
        description: `${database.name} database configuration`,
      })
      .returning();
    dbConfigMap.set(database.name, config.id);
  }

  return { categoryMap, ownerMap, dbConfigMap };
}

export async function seedDatabase() {
  try {
    // Insert reference data first
    const { categoryMap, ownerMap, dbConfigMap } = await insertReferenceData();

    // Generate and insert elements
    const elements = generateElements(categoryMap, ownerMap);

    for (const element of elements) {
      const [inserted] = await db.insert(businessElements).values(element).returning();

      // Generate and insert mappings for this element
      const mappings = generateMappings(inserted.id, dbConfigMap);
      for (const mapping of mappings) {
        await db.insert(databaseMappings).values(mapping);
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}