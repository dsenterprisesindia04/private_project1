export async function onRequest({ request, env }) {
  const headers = { "Content-Type": "application/json" };

  try {
    if (!env.DB) {
      return Response.json({ error: "Database binding DB is missing" }, { status: 500 });
    }

    if (request.method === "GET") {
      const result = await env.DB.prepare(
        "SELECT id, name, details, price, stock, gst_rate, warranty, image_url FROM catalog_products WHERE is_active = 1 ORDER BY id DESC"
      ).all();

      return Response.json({ products: result.results || [] });
    }

    if (!["POST", "PUT", "DELETE"].includes(request.method)) {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const password = env.DS_ADMIN_PASSWORD;
    const auth = request.headers.get("Authorization") || "";

    if (!password || auth !== `Bearer ${password}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (request.method === "DELETE") {
      const body = await request.json();
      if (!body.id) {
        return Response.json({ error: "Product ID required" }, { status: 400 });
      }

      await env.DB.prepare(
        "UPDATE catalog_products SET is_active = 0 WHERE id = ?"
      ).bind(body.id).run();

      return Response.json({ success: true });
    }

    const body = await request.json();

    if (!body.name || !String(body.name).trim()) {
      return Response.json({ error: "Product name required" }, { status: 400 });
    }

    const name = String(body.name).trim();
    const details = String(body.details || "");
    const price = body.price === "" || body.price == null ? null : Number(body.price);
    const stock = Math.max(0, Number(body.stock) || 0);
    const gst = Math.max(0, Number(body.gst_rate) || 0);
    const warranty = String(body.warranty || "");
    const image = String(body.image_url || "");

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      return Response.json({ error: "Invalid price" }, { status: 400 });
    }

    if (request.method === "POST") {
      await env.DB.prepare(
        "INSERT INTO catalog_products (name, details, price, stock, gst_rate, warranty, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
      ).bind(name, details, price, stock, gst, warranty, image).run();

      return Response.json({ success: true });
    }

    if (!body.id) {
      return Response.json({ error: "Product ID required" }, { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE catalog_products SET name=?, details=?, price=?, stock=?, gst_rate=?, warranty=?, image_url=? WHERE id=?"
    ).bind(name, details, price, stock, gst, warranty, image, body.id).run();

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
