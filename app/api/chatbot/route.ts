

import { NextResponse } from "next/server";
import { runChatAgent } from "@/actions/orchestrate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await runChatAgent({ message });

    let reply = "No reply received.";

    if (typeof result === "string") {
      reply = result;
    } else if (
      result &&
      typeof result === "object" &&
      "reply" in result &&
      typeof (result as { reply: unknown }).reply === "string"
    ) {
      reply = (result as { reply: string }).reply;
    } else if (
      result &&
      typeof result === "object" &&
      "result" in result &&
      typeof (result as { result: unknown }).result === "string"
    ) {
      reply = (result as { result: string }).result;
    } else if (result != null) {
      reply = JSON.stringify(result);
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot route error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get chatbot reply",
      },
      { status: 500 }
    );
  }
}