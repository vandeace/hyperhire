import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  console.log("request :", request);
  try {
    const body = await request.json();
    console.log("body :", body);
    const response = await fetch(`${process.env.BE_URL}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to add menu");
    }

    const data = await response.json();
    revalidatePath("/");
    return new Response(JSON.stringify(data), {
      status: 201,
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
