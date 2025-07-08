export async function onRequest(context) {
  try {
    const data = await context.request.json();
    const { id, title, subtitle, position, author, excerpt, wattpad, cover } = data;

    // Basic check for missing ID
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing book ID" }), { status: 400 });
    }

    // Optional: Log the data for debugging (remove in production)
    console.log("Updating book ID:", id);
    console.log("Received data:", data);

    // Update query
    const result = await context.env.DB.prepare(`
      UPDATE books
      SET title = ?, subtitle = ?, position = ?, author = ?, excerpt = ?, wattpad = ?, cover = ?
      WHERE id = ?
    `).bind(
      title || null,
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
    return new Response(JSON.stringify({
      error: e.message,
      stack: e.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
