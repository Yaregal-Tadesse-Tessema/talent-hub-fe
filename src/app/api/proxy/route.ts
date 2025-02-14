export async function POST(req: Request) {
    const body = await req.json();
  
    const res = await fetch("https://talent-hub-n6o6.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  }
  