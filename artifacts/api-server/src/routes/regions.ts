import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wilayasTable, citiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/regions", async (req, res) => {
  try {
    const wilayas = await db.select().from(wilayasTable).orderBy(wilayasTable.code);
    const cities = await db.select().from(citiesTable).orderBy(citiesTable.name);

    const result = wilayas.map((w) => ({
      ...w,
      cities: cities.filter((c) => c.wilayaCode === w.code),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch regions");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch regions" });
  }
});

router.get("/regions/:code/cities", async (req, res) => {
  try {
    const cities = await db
      .select()
      .from(citiesTable)
      .where(eq(citiesTable.wilayaCode, req.params.code))
      .orderBy(citiesTable.name);

    res.json(cities);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch cities");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch cities" });
  }
});

export default router;
