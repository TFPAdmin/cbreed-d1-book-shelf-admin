export async function onRequest(context) {
  try {
    const data = await context.request.json();
    const { id, title, subtitle, position, author, excerpt, wattpad, cover } = data;

    // Basic check for missing ID
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing book ID" }), { status: 400 });
    }

    // Update query with all fields
    const result = await context.env.DB.prepare(`
      UPDATE books
      SET title = ?, subtitle = ?, position = ?, author = ?, excerpt = ?, wattpad = ?, cover = ?
      WHERE id = ?
    `).bind(
      title,
      subtitle || null,
      position ? Number(position) : null,
      author || null,
      excerpt || null,
      wattpad || null,
      cover || null,
      id
    ).run();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    // Log detailed error info for debugging
    return new Response(JSON.stringify({
      error: e.message,
      stack: e.stack,
      received: await context.request.text()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
