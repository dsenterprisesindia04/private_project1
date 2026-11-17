const json = (data, status=200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {"content-type":"application/json; charset=utf-8"}
  });

export async function onRequestGet({env}) {
  if (!env.DB) return json({products:[]});

  try {
    const {results=[]} = await env.DB
      .prepare("SELECT name, description, price FROM products WHERE active=1 ORDER BY name")
      .all();

    return json({products:results});
  } catch (e) {
    return json({products:[]});
  }
}
