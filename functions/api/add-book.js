export async function onRequest(context) {
  const data = await context.request.json();
  const { title, subtitle, excerpt, cover, wattpad } = data;

  if (!title) {
    return new Response(JSON.stringify({ error: "Missing title" }), { status: 400 });
  }

  try {
    await context.env.DB.prepare(`
      INSERT INTO books (title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?)
    `).bind(title, subtitle, excerpt, cover, wattpad).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
