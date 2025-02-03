import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Existing tables...
export const databaseConfigs = pgTable("database_configs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  connectionUrl: text("connection_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ownerGroups = pgTable("owner_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const businessElements = pgTable("business_elements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  ownerGroupId: integer("owner_group_id").references(() => ownerGroups.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// New table for data quality rules
export const dataQualityRules = pgTable("data_quality_rules", {
  id: serial("id").primaryKey(),
  elementId: integer("element_id").references(() => businessElements.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  ruleType: text("rule_type").notNull(), // format, range, enum, regex, custom
  ruleConfig: jsonb("rule_config").notNull(), // JSON configuration specific to rule type
  severity: text("severity").notNull(), // error, warning, info
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const elementDefinitions = pgTable("element_definitions", {
  id: serial("id").primaryKey(),
  elementId: integer("element_id").references(() => businessElements.id).notNull(),
  version: integer("version").notNull(),
  definition: text("definition").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").notNull(),
});

export const databaseMappings = pgTable("database_mappings", {
  id: serial("id").primaryKey(),
  elementId: integer("element_id").references(() => businessElements.id).notNull(),
  databaseConfigId: integer("database_config_id").references(() => databaseConfigs.id).notNull(),
  schemaName: text("schema_name").notNull(),
  tableName: text("table_name").notNull(),
  columnName: text("column_name").notNull(),
  mappingType: text("mapping_type").notNull(), // direct, derived, calculated
  transformationLogic: jsonb("transformation_logic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const elementRelations = relations(businessElements, ({ one, many }) => ({
  category: one(categories, {
    fields: [businessElements.categoryId],
    references: [categories.id],
  }),
  ownerGroup: one(ownerGroups, {
    fields: [businessElements.ownerGroupId],
    references: [ownerGroups.id],
  }),
  definitions: many(elementDefinitions),
  mappings: many(databaseMappings),
  qualityRules: many(dataQualityRules),
}));

export const definitionRelations = relations(elementDefinitions, ({ one }) => ({
  element: one(businessElements, {
    fields: [elementDefinitions.elementId],
    references: [businessElements.id],
  }),
}));

export const mappingRelations = relations(databaseMappings, ({ one }) => ({
  element: one(businessElements, {
    fields: [databaseMappings.elementId],
    references: [businessElements.id],
  }),
  databaseConfig: one(databaseConfigs, {
    fields: [databaseMappings.databaseConfigId],
    references: [databaseConfigs.id],
  }),
}));

export const ruleRelations = relations(dataQualityRules, ({ one }) => ({
  element: one(businessElements, {
    fields: [dataQualityRules.elementId],
    references: [businessElements.id],
  }),
}));

// Schemas
export const insertDatabaseConfigSchema = createInsertSchema(databaseConfigs);
export const selectDatabaseConfigSchema = createSelectSchema(databaseConfigs);

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const insertOwnerGroupSchema = createInsertSchema(ownerGroups);
export const selectOwnerGroupSchema = createSelectSchema(ownerGroups);

export const insertElementSchema = createInsertSchema(businessElements);
export const selectElementSchema = createSelectSchema(businessElements);

export const insertDefinitionSchema = createInsertSchema(elementDefinitions);
export const selectDefinitionSchema = createSelectSchema(elementDefinitions);

export const insertMappingSchema = createInsertSchema(databaseMappings);
export const selectMappingSchema = createSelectSchema(databaseMappings);

export const insertRuleSchema = createInsertSchema(dataQualityRules);
export const selectRuleSchema = createSelectSchema(dataQualityRules);

// Types
export type DatabaseConfig = typeof databaseConfigs.$inferSelect;
export type NewDatabaseConfig = typeof databaseConfigs.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type OwnerGroup = typeof ownerGroups.$inferSelect;
export type NewOwnerGroup = typeof ownerGroups.$inferInsert;

export type BusinessElement = typeof businessElements.$inferSelect;
export type NewBusinessElement = typeof businessElements.$inferInsert;

export type ElementDefinition = typeof elementDefinitions.$inferSelect;
export type NewElementDefinition = typeof elementDefinitions.$inferInsert;

export type DatabaseMapping = typeof databaseMappings.$inferSelect;
export type NewDatabaseMapping = typeof databaseMappings.$inferInsert;

export type DataQualityRule = typeof dataQualityRules.$inferSelect;
export type NewDataQualityRule = typeof dataQualityRules.$inferInsert;