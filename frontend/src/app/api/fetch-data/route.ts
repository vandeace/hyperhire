export async function GET() {
  try {
    const response = await fetch(`${process.env.BE_URL}/menu/tree`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    // Return response as JSON
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
