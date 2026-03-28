import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and, gte, lte, like, desc, asc, sql, ne } from "drizzle-orm";

const router: IRouter = Router();

const productSelect = {
  id: productsTable.id,
  name: productsTable.name,
  nameAr: productsTable.nameAr,
  nameFr: productsTable.nameFr,
  slug: productsTable.slug,
  price: productsTable.price,
  originalPrice: productsTable.originalPrice,
  currency: productsTable.currency,
  image: productsTable.image,
  categoryId: productsTable.categoryId,
  categoryName: categoriesTable.name,
  categoryNameAr: categoriesTable.nameAr,
  categoryNameFr: categoriesTable.nameFr,
  inStock: productsTable.inStock,
  rating: productsTable.rating,
  reviewCount: productsTable.reviewCount,
  isFeatured: productsTable.isFeatured,
  discount: productsTable.discount,
};

router.get("/products/featured", async (req, res) => {
  try {
    const products = await db
      .select(productSelect)
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.isFeatured, true))
      .limit(12);

    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch featured products");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch featured products" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      inStock,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, parseInt(limit) || 20);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (search) {
      conditions.push(
        sql`(${productsTable.name} ILIKE ${'%' + search + '%'} OR ${productsTable.nameAr} ILIKE ${'%' + search + '%'} OR ${productsTable.nameFr} ILIKE ${'%' + search + '%'})`
      );
    }

    if (categoryId) {
      conditions.push(eq(productsTable.categoryId, parseInt(categoryId)));
    }

    if (minPrice) {
      conditions.push(gte(productsTable.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(productsTable.price, maxPrice));
    }

    if (inStock === "true") {
      conditions.push(eq(productsTable.inStock, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sortBy) {
      case "price_asc":
        orderBy = asc(sql`cast(${productsTable.price} as numeric)`);
        break;
      case "price_desc":
        orderBy = desc(sql`cast(${productsTable.price} as numeric)`);
        break;
      case "popular":
        orderBy = desc(productsTable.reviewCount);
        break;
      case "newest":
      default:
        orderBy = desc(productsTable.createdAt);
        break;
    }

    const [products, countResult] = await Promise.all([
      db
        .select(productSelect)
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    res.json({
      products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch products");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch products" });
  }
});

router.get("/products/:id/related", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid_id", message: "Invalid product ID" });
      return;
    }

    const [product] = await db
      .select({ categoryId: productsTable.categoryId })
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      res.json([]);
      return;
    }

    const related = await db
      .select(productSelect)
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(eq(productsTable.categoryId, product.categoryId!), ne(productsTable.id, id)))
      .limit(8);

    res.json(related);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch related products");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch related products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid_id", message: "Invalid product ID" });
      return;
    }

    const [product] = await db
      .select({
        ...productSelect,
        description: productsTable.description,
        descriptionAr: productsTable.descriptionAr,
        descriptionFr: productsTable.descriptionFr,
        images: productsTable.images,
        specifications: productsTable.specifications,
        stockQuantity: productsTable.stockQuantity,
        sku: productsTable.sku,
        brand: productsTable.brand,
        tags: productsTable.tags,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch product");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch product" });
  }
});

export default router;
