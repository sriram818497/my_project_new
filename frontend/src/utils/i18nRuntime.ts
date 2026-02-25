import { translationService } from "../services/translation";

const STORAGE_KEY = "proteccio-preferred-language";
const SOURCE_LANGUAGE = "en";
const LANGUAGE_EVENT = "proteccio:language-changed";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);
const MAX_NODE_TEXT_LENGTH = 180;
const MAX_BATCH_SIZE = 20;

const originalTextByNode = new WeakMap<Text, string>();
const translationCache = new Map<string, string>();

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

export const getPreferredLanguage = () => {
  if (typeof window === "undefined") return SOURCE_LANGUAGE;
  return (window.localStorage.getItem(STORAGE_KEY) || SOURCE_LANGUAGE).toLowerCase();
};

export const setPreferredLanguage = (lang: string) => {
  if (typeof window === "undefined") return;
  const normalized = lang.toLowerCase().trim();
  window.localStorage.setItem(STORAGE_KEY, normalized);
  window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: { lang: normalized } }));
};

const isIgnoredNode = (node: Text) => {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  if (parent.closest("[data-i18n-ignore='true']")) return true;
  return false;
};

const collectEligibleNodes = () => {
  if (typeof document === "undefined") return [] as Text[];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      const textNode = current as Text;
      if (!isIgnoredNode(textNode)) {
        const normalized = normalizeText(textNode.nodeValue || "");
        if (normalized.length > 1 && normalized.length <= MAX_NODE_TEXT_LENGTH) {
          nodes.push(textNode);
        }
      }
    }
    current = walker.nextNode();
  }

  return nodes;
};

const restoreOriginalEnglish = () => {
  const nodes = collectEligibleNodes();
  for (const node of nodes) {
    const original = originalTextByNode.get(node);
    if (original) {
      node.nodeValue = original;
    }
  }
};

const chunk = <T,>(items: T[], size: number) => {
  const parts: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    parts.push(items.slice(i, i + size));
  }
  return parts;
};

export const applyLanguageToPage = async (targetLang: string) => {
  const normalizedTarget = targetLang.toLowerCase().trim();
  if (normalizedTarget === SOURCE_LANGUAGE) {
    restoreOriginalEnglish();
    return;
  }

  const nodes = collectEligibleNodes();
  if (nodes.length === 0) return;

  const normalizedByNode = new Map<Text, string>();
  for (const node of nodes) {
    const raw = node.nodeValue || "";
    if (!originalTextByNode.has(node)) {
      originalTextByNode.set(node, raw);
    }
    normalizedByNode.set(node, normalizeText(raw));
  }

  const uniqueTexts = Array.from(new Set(Array.from(normalizedByNode.values())));
  const textsToRequest = uniqueTexts.filter((text) => !translationCache.has(`${SOURCE_LANGUAGE}:${normalizedTarget}:${text}`));

  for (const batch of chunk(textsToRequest, MAX_BATCH_SIZE)) {
    try {
      const response = await translationService.translateBatch({
        sourceLang: SOURCE_LANGUAGE,
        targetLang: normalizedTarget,
        texts: batch,
      });
      for (const pair of response.data) {
        const key = `${SOURCE_LANGUAGE}:${normalizedTarget}:${pair.sourceText}`;
        translationCache.set(key, pair.translatedText || pair.sourceText);
      }
    } catch {
      for (const text of batch) {
        translationCache.set(`${SOURCE_LANGUAGE}:${normalizedTarget}:${text}`, text);
      }
    }
  }

  for (const node of nodes) {
    const normalized = normalizedByNode.get(node);
    if (!normalized) continue;
    const key = `${SOURCE_LANGUAGE}:${normalizedTarget}:${normalized}`;
    const translated = translationCache.get(key);
    if (!translated) continue;

    const originalRaw = originalTextByNode.get(node) || node.nodeValue || "";
    const trimmedOriginal = originalRaw.trim();
    if (!trimmedOriginal) continue;

    const leading = originalRaw.match(/^\s*/)?.[0] ?? "";
    const trailing = originalRaw.match(/\s*$/)?.[0] ?? "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }
};

export const languageEvents = {
  eventName: LANGUAGE_EVENT,
};
