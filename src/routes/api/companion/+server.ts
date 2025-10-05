import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";
import {
  DEFAULT_LOCALE,
  getProfile,
  isSupportedLocale,
  matchKnowledgeBase,
  type CompanionMessage,
  type SupportedLocale,
} from "$lib/memory/companionProfiles";

const OPENAI_API_KEY = env.OPENAI_API_KEY;
const OPENAI_MODEL =
  env.OPENAI_COMPANION_MODEL ?? env.OPENAI_MODEL ?? "gpt-3.5-turbo";
const OPENAI_BASE_URL =
  env.OPENAI_BASE_URL ?? "https://api.openai.com/v1/chat/completions";
const MAX_HISTORY = 10;

const sanitiseMessages = (messages: unknown): CompanionMessage[] => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message): message is CompanionMessage => {
      if (!message || typeof message !== "object") return false;

      const candidate = message as CompanionMessage;
      return (
        typeof candidate.text === "string" &&
        (candidate.sender === "user" || candidate.sender === "companion")
      );
    })
    .slice(-MAX_HISTORY)
    .map((message) => ({
      sender: message.sender,
      text: message.text.trim(),
    }));
};

const buildSystemPrompt = (locale: SupportedLocale) => {
  const profile = getProfile(locale);
  return [
    `You are ${profile.name}, ${profile.role}.`,
    "You represent AlgoRhythmics, an AI consultancy. Provide helpful, culturally aware answers in the user's language.",
    "Keep replies under 120 words unless asked for more detail, and suggest practical next steps when appropriate.",
    "If unsure, invite the user to continue the conversation with a human at hello@algorhythmics.com.",
  ].join(" ");
};

export const POST: RequestHandler = async ({ request, fetch }) => {
  let body: { locale?: string; messages?: unknown } | null = null;

  try {
    body = await request.json();
  } catch (error) {
    return json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const locale = isSupportedLocale(body?.locale)
    ? body?.locale
    : DEFAULT_LOCALE;
  const messages = sanitiseMessages(body?.messages);

  if (!messages.length) {
    return json({
      reply: getProfile(locale).greeting,
      locale,
      source: "greeting",
    });
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.sender === "user");
  const fallback = latestUserMessage
    ? matchKnowledgeBase(locale, latestUserMessage.text)
    : getProfile(locale).fallback;

  if (!OPENAI_API_KEY) {
    return json({ reply: fallback, locale, source: "knowledge-base" });
  }

  try {
    const response = await fetch(OPENAI_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.5,
        messages: [
          { role: "system", content: buildSystemPrompt(locale) },
          ...messages.map((message) => ({
            role: message.sender === "user" ? "user" : "assistant",
            content: message.text,
          })),
        ],
      }),
    });

    if (!response.ok) {
      return json(
        { reply: fallback, locale, source: "knowledge-base" },
        { status: 200 },
      );
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return json(
        { reply: fallback, locale, source: "knowledge-base" },
        { status: 200 },
      );
    }

    return json({ reply, locale, source: "openai" });
  } catch (error) {
    return json(
      { reply: fallback, locale, source: "knowledge-base" },
      { status: 200 },
    );
  }
};
