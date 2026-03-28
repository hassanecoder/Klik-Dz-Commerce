import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        nameAr: categoriesTable.nameAr,
        nameFr: categoriesTable.nameFr,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        descriptionAr: categoriesTable.descriptionAr,
        descriptionFr: categoriesTable.descriptionFr,
        icon: categoriesTable.icon,
        image: categoriesTable.image,
        productCount: sql<number>`cast(count(${productsTable.id}) as int)`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.id)
      .orderBy(categoriesTable.name);

    res.json(categories);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch categories");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch categories" });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid_id", message: "Invalid category ID" });
      return;
    }

    const [category] = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        nameAr: categoriesTable.nameAr,
        nameFr: categoriesTable.nameFr,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        descriptionAr: categoriesTable.descriptionAr,
        descriptionFr: categoriesTable.descriptionFr,
        icon: categoriesTable.icon,
        image: categoriesTable.image,
        productCount: sql<number>`cast(count(${productsTable.id}) as int)`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(categoriesTable.id, id))
      .groupBy(categoriesTable.id);

    if (!category) {
      res.status(404).json({ error: "not_found", message: "Category not found" });
      return;
    }

    res.json(category);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch category");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch category" });
  }
});

export default router;
