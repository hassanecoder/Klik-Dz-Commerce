import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KDZ-${ts}-${rand}`;
}

router.post("/orders", async (req, res) => {
  try {
    const { fullName, phone, email, wilaya, city, address, items, notes } = req.body;

    if (!fullName || !phone || !wilaya || !city || !items?.length) {
      res.status(400).json({ error: "validation_error", message: "Missing required fields" });
      return;
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + item.price * item.quantity;
    }, 0);

    const [order] = await db
      .insert(ordersTable)
      .values({
        orderNumber: generateOrderNumber(),
        status: "pending",
        fullName,
        phone,
        email: email || null,
        wilaya,
        city,
        address: address || null,
        total: total.toFixed(2),
        items,
        notes: notes || null,
      })
      .returning();

    res.status(201).json({
      ...order,
      createdAt: order.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "internal_error", message: "Failed to create order" });
  }
});

router.post("/orders/instant", async (req, res) => {
  try {
    const { fullName, phone, wilaya, city, address, productId, quantity, notes } = req.body;

    if (!fullName || !phone || !wilaya || !city || !productId || !quantity) {
      res.status(400).json({ error: "validation_error", message: "Missing required fields" });
      return;
    }

    const [product] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        price: productsTable.price,
        inStock: productsTable.inStock,
      })
      .from(productsTable)
      .where(eq(productsTable.id, productId))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }

    if (!product.inStock) {
      res.status(400).json({ error: "out_of_stock", message: "Product is out of stock" });
      return;
    }

    const price = parseFloat(product.price as string);
    const total = price * quantity;

    const [order] = await db
      .insert(ordersTable)
      .values({
        orderNumber: generateOrderNumber(),
        status: "pending",
        fullName,
        phone,
        wilaya,
        city,
        address: address || null,
        total: total.toFixed(2),
        items: [{ productId: product.id, quantity, price, name: product.name }],
        notes: notes || null,
      })
      .returning();

    res.status(201).json({
      ...order,
      createdAt: order.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create instant order");
    res.status(500).json({ error: "internal_error", message: "Failed to create instant order" });
  }
});

export default router;
