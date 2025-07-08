export async function onRequest(context) {
  const { id } = await context.request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
  }

  try {
    await context.env.DB.prepare(`DELETE FROM books WHERE id = ?`).bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
