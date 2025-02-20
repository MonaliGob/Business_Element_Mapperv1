import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import {
  businessElements,
  elementDefinitions,
  databaseMappings,
  databaseConfigs,
  categories,
  ownerGroups,
  dataQualityRules,
  userProjects,
  users,
} from "@db/schema";
import { eq, and } from "drizzle-orm";
import { seedDatabase } from "./seed";
import { setupAuth, requireAdmin } from "./auth";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Set up authentication
  setupAuth(app);

  // Admin routes for user management
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const allUsers = await db.query.users.findMany({
      with: {
        projects: {
          with: {
            element: true,
          },
        },
      },
    });
    res.json(allUsers);
  });

  // Project assignment routes
  app.post("/api/admin/assign-project", requireAdmin, async (req, res) => {
    const { userId, elementId, role } = req.body;

    // Check if assignment already exists
    const existing = await db.query.userProjects.findFirst({
      where: and(
        eq(userProjects.userId, userId),
        eq(userProjects.elementId, elementId)
      ),
    });

    if (existing) {
      return res.status(400).json({ message: "User already assigned to this project" });
    }

    const assignment = await db.insert(userProjects)
      .values({ userId, elementId, role })
      .returning();

    res.json(assignment[0]);
  });

  // Database Configs
  app.get("/api/database-configs", async (req, res) => {
    const configs = await db.query.databaseConfigs.findMany();
    res.json(configs);
  });

  app.post("/api/database-configs", async (req, res) => {
    const newConfig = await db.insert(databaseConfigs).values(req.body).returning();
    res.json(newConfig[0]);
  });

  app.patch("/api/database-configs/:id", async (req, res) => {
    const { id } = req.params;
    const updated = await db
      .update(databaseConfigs)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(databaseConfigs.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/database-configs/:id", async (req, res) => {
    const { id } = req.params;
    await db.delete(databaseConfigs).where(eq(databaseConfigs.id, parseInt(id)));
    res.status(204).end();
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    const cats = await db.query.categories.findMany();
    res.json(cats);
  });

  app.post("/api/categories", async (req, res) => {
    // Check for existing category with same name (case insensitive)
    const existingCategory = await db.query.categories.findFirst({
      where: (categories, { sql }) => sql`LOWER(${categories.name}) = LOWER(${req.body.name})`
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: `A category with the name "${req.body.name}" already exists` 
      });
    }

    const newCategory = await db.insert(categories).values(req.body).returning();
    res.json(newCategory[0]);
  });

  app.patch("/api/categories/:id", async (req, res) => {
    const { id } = req.params;

    if (req.body.name) {
      // Check for existing category with same name, excluding current category
      const existingCategory = await db.query.categories.findFirst({
        where: (categories, { sql, and, ne }) => 
          and(
            sql`LOWER(${categories.name}) = LOWER(${req.body.name})`,
            ne(categories.id, parseInt(id))
          )
      });

      if (existingCategory) {
        return res.status(400).json({ 
          message: `A category with the name "${req.body.name}" already exists` 
        });
      }
    }

    const updated = await db
      .update(categories)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(categories.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    await db.delete(categories).where(eq(categories.id, parseInt(id)));
    res.status(204).end();
  });

  // Owner Groups
  app.get("/api/owner-groups", async (req, res) => {
    const groups = await db.query.ownerGroups.findMany();
    res.json(groups);
  });

  app.post("/api/owner-groups", async (req, res) => {
    // Check for existing group with same name (case insensitive)
    const existingGroup = await db.query.ownerGroups.findFirst({
      where: (groups, { sql }) => sql`LOWER(${groups.name}) = LOWER(${req.body.name})`
    });

    if (existingGroup) {
      return res.status(400).json({ 
        message: `An owner group with the name "${req.body.name}" already exists` 
      });
    }

    const newGroup = await db.insert(ownerGroups).values(req.body).returning();
    res.json(newGroup[0]);
  });

  app.patch("/api/owner-groups/:id", async (req, res) => {
    const { id } = req.params;

    if (req.body.name) {
      // Check for existing group with same name, excluding current group
      const existingGroup = await db.query.ownerGroups.findFirst({
        where: (groups, { sql, and, ne }) => 
          and(
            sql`LOWER(${groups.name}) = LOWER(${req.body.name})`,
            ne(groups.id, parseInt(id))
          )
      });

      if (existingGroup) {
        return res.status(400).json({ 
          message: `An owner group with the name "${req.body.name}" already exists` 
        });
      }
    }

    const updated = await db
      .update(ownerGroups)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(ownerGroups.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  });

  // Business Elements
  app.get("/api/elements", async (req, res) => {
    const elements = await db.query.businessElements.findMany({
      with: {
        category: true,
        ownerGroup: true,
        definitions: true,
        mappings: {
          with: {
            databaseConfig: true,
          },
        },
        qualityRules: true,
      },
    });
    res.json(elements);
  });

  app.post("/api/elements", async (req, res) => {
    // Check for existing element with same name (case insensitive)
    const existingElement = await db.query.businessElements.findFirst({
      where: (elements, { sql }) => sql`LOWER(${elements.name}) = LOWER(${req.body.name})`
    });

    if (existingElement) {
      return res.status(400).json({ 
        message: `A business element with the name "${req.body.name}" already exists` 
      });
    }

    const newElement = await db.insert(businessElements).values(req.body).returning();
    res.json(newElement[0]);
  });

  app.patch("/api/elements/:id", async (req, res) => {
    const { id } = req.params;

    if (req.body.name) {
      // Check for existing element with same name, excluding current element
      const existingElement = await db.query.businessElements.findFirst({
        where: (elements, { sql, and, ne }) => 
          and(
            sql`LOWER(${elements.name}) = LOWER(${req.body.name})`,
            ne(elements.id, parseInt(id))
          )
      });

      if (existingElement) {
        return res.status(400).json({ 
          message: `A business element with the name "${req.body.name}" already exists` 
        });
      }
    }

    const updated = await db
      .update(businessElements)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(businessElements.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/elements/:id", async (req, res) => {
    const { id } = req.params;
    await db.delete(businessElements).where(eq(businessElements.id, parseInt(id)));
    res.status(204).end();
  });

  app.post("/api/elements/:id/definitions", async (req, res) => {
    const { id } = req.params;
    const latestVersion = await db.query.elementDefinitions.findFirst({
      where: eq(elementDefinitions.elementId, parseInt(id)),
      orderBy: (def) => def.version,
      desc: true,
    });

    const newVersion = (latestVersion?.version ?? 0) + 1;
    const newDefinition = await db
      .insert(elementDefinitions)
      .values({
        ...req.body,
        elementId: parseInt(id),
        version: newVersion,
      })
      .returning();

    res.json(newDefinition[0]);
  });

  app.post("/api/elements/:id/mappings", async (req, res) => {
    const { id } = req.params;
    const newMapping = await db
      .insert(databaseMappings)
      .values({
        ...req.body,
        elementId: parseInt(id),
      })
      .returning();
    res.json(newMapping[0]);
  });

  app.delete("/api/mappings/:id", async (req, res) => {
    const { id } = req.params;
    await db.delete(databaseMappings).where(eq(databaseMappings.id, parseInt(id)));
    res.status(204).end();
  });
  // Data Quality Rules
  app.get("/api/elements/:id/rules", async (req, res) => {
    const { id } = req.params;
    const rules = await db.query.dataQualityRules.findMany({
      where: eq(dataQualityRules.elementId, parseInt(id)),
    });
    res.json(rules);
  });

  app.post("/api/elements/:id/rules", async (req, res) => {
    const { id } = req.params;
    const newRule = await db
      .insert(dataQualityRules)
      .values({
        ...req.body,
        elementId: parseInt(id),
      })
      .returning();
    res.json(newRule[0]);
  });

  app.patch("/api/rules/:id", async (req, res) => {
    const { id } = req.params;
    const updated = await db
      .update(dataQualityRules)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(dataQualityRules.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  });

  app.delete("/api/rules/:id", async (req, res) => {
    const { id } = req.params;
    await db.delete(dataQualityRules).where(eq(dataQualityRules.id, parseInt(id)));
    res.status(204).end();
  });


  app.post("/api/seed", async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Error seeding database" });
    }
  });

  return httpServer;
}