import { env } from "../../config/env";
import type { TranslateInput } from "./translation.validation";

type TranslationResult = {
  sourceText: string;
  translatedText: string;
};

type BhashiniResponse = Record<string, unknown>;

const headers = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-udhyat-key": env.BHASHINI_UDYAT_KEY ?? "",
  "x-interface-api-key": env.BHASHINI_INTERFACE_API_KEY ?? "",
  udhyatKey: env.BHASHINI_UDYAT_KEY ?? "",
  interfaceApiKey: env.BHASHINI_INTERFACE_API_KEY ?? "",
});

const findFirstString = (value: unknown, keys: string[]): string | undefined => {
  if (!value || typeof value !== "object") return undefined;

  const stack: unknown[] = [value];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;

    if (!Array.isArray(current)) {
      const record = current as Record<string, unknown>;
      for (const key of keys) {
        const maybe = record[key];
        if (typeof maybe === "string" && maybe.trim().length > 0) return maybe;
      }
      for (const nested of Object.values(record)) {
        stack.push(nested);
      }
      continue;
    }

    for (const nested of current) {
      stack.push(nested);
    }
  }

  return undefined;
};

const extractTranslatedText = (payload: BhashiniResponse): string | undefined =>
  findFirstString(payload, ["translatedText", "target", "translation", "output"]);

const translateOne = async (sourceText: string, sourceLang: string, targetLang: string): Promise<string> => {
  if (!env.BHASHINI_BASE_URL || !env.BHASHINI_INTERFACE_API_KEY || !env.BHASHINI_UDYAT_KEY) {
    return sourceText;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.BHASHINI_TIMEOUT_MS);

  try {
    const response = await fetch(env.BHASHINI_BASE_URL, {
      method: "POST",
      headers: headers(),
      signal: controller.signal,
      body: JSON.stringify({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        input: sourceText,
        inputText: sourceText,
      }),
    });

    if (!response.ok) {
      return sourceText;
    }

    const payload = (await response.json()) as BhashiniResponse;
    return extractTranslatedText(payload)?.trim() || sourceText;
  } catch {
    return sourceText;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const translationService = {
  isEnabled() {
    return (
      Boolean(env.ENABLE_BHASHINI) &&
      Boolean(env.BHASHINI_BASE_URL) &&
      Boolean(env.BHASHINI_INTERFACE_API_KEY) &&
      Boolean(env.BHASHINI_UDYAT_KEY)
    );
  },

  async translate(input: TranslateInput): Promise<TranslationResult[]> {
    if (input.sourceLang === input.targetLang) {
      return input.texts.map((text) => ({ sourceText: text, translatedText: text }));
    }

    const translatedTexts: string[] = [];
    for (const text of input.texts) {
      const translated = await translateOne(text, input.sourceLang, input.targetLang);
      translatedTexts.push(translated);
    }

    return input.texts.map((sourceText, index) => ({
      sourceText,
      translatedText: translatedTexts[index] || sourceText,
    }));
  },
};
