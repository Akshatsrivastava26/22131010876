export async function Log(stack, level, pkg, message, accessToken) {
  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message
      })
    });

    const data = await response.json();
    console.log("📄 Log sent:", data);
  } catch (error) {
    console.error("❌ Failed to send log:", error);
  }
}
