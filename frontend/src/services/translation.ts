import axios from "axios";

export type TranslationPair = {
  sourceText: string;
  translatedText: string;
};

type TranslationResponse = {
  success: boolean;
  enabled?: boolean;
  data?: TranslationPair[];
};

export const translationService = {
  async translateBatch(input: { sourceLang: string; targetLang: string; texts: string[] }) {
    const response = await axios.post<TranslationResponse>("/api/translation/translate", input);
    if (!response.data?.success || !Array.isArray(response.data.data)) {
      return {
        enabled: false,
        data: input.texts.map((text) => ({ sourceText: text, translatedText: text })),
      };
    }

    return {
      enabled: Boolean(response.data.enabled),
      data: response.data.data,
    };
  },
};
