export async function onRequest(context) {
  try {
    const data = await context.request.json();
    const { id, title, subtitle, position, author, excerpt, wattpad, cover } = data;

    await context.env.DB.prepare(`
      UPDATE books
      SET title = ?, subtitle = ?, position = ?, author = ?, excerpt = ?, wattpad = ?, cover = ?
      WHERE id = ?
    `).bind(title, subtitle, position, author, excerpt, wattpad, cover, id).run();

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
