export async function onRequest(context) {
  try {
    const reqBody = await context.request.text();
    console.log("Raw request body:", reqBody);

    let data;
    try {
      data = JSON.parse(reqBody);
    } catch (parseError) {
      return new Response(JSON.stringify({
        error: "Invalid JSON format",
        details: parseError.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id, title, subtitle, position, author, excerpt, wattpad, cover } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing book ID" }), { status: 400 });
    }

    console.log("Parsed update data:", data);

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
    console.error("Update error:", e);

    return new Response(JSON.stringify({
      error: e.message,
      stack: e.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
