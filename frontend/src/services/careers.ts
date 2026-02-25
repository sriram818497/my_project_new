import axios from "axios";
import { CAREERS_CONTENT_SEED } from "../data/careersSeed";
import type { CareersContent } from "../types/careers";

const CONTENT_UPDATED_EVENT = "proteccio:careers-content-updated";
const CAREERS_STATE_KEY = "careers-content-v2";

type CareersCmsState = {
  draft: CareersContent;
  published: CareersContent;
  updatedAt: string;
  publishedAt: string;
};

type Listener = () => void;
const listeners = new Set<Listener>();
let cachedState: CareersCmsState | null = null;
let loadPromise: Promise<CareersCmsState> | null = null;

const nowIso = () => new Date().toISOString();

const cloneContent = (content: CareersContent): CareersContent => ({
  hero: { ...content.hero },
  regions: content.regions.map((r) => ({ ...r })),
  cultureCards: content.cultureCards.map((c) => ({ ...c })),
  valueTabs: content.valueTabs.map((t) => ({ ...t })),
  benefits: [...content.benefits],
  testimonials: content.testimonials.map((t) => ({ ...t })),
  cultureSpotlight: { ...content.cultureSpotlight },
});

const cloneSeed = () => cloneContent(CAREERS_CONTENT_SEED);

const withFallbackImage = (value: string | undefined, fallback: string) => {
  const next = (value || "").trim();
  return next ? next : fallback;
};

const ensureContentShape = (input: CareersContent): CareersContent => {
  const sourceCultureCards =
    input.cultureCards && input.cultureCards.length > 0 ? input.cultureCards : CAREERS_CONTENT_SEED.cultureCards;
  const cultureCards = sourceCultureCards.map((card, index) => ({
    ...card,
    img: withFallbackImage(
      card?.img,
      CAREERS_CONTENT_SEED.cultureCards[index]?.img || CAREERS_CONTENT_SEED.cultureCards[0].img
    ),
  }));
  if (cultureCards.length < CAREERS_CONTENT_SEED.cultureCards.length) {
    const missing = CAREERS_CONTENT_SEED.cultureCards.slice(cultureCards.length).map((card) => ({ ...card }));
    cultureCards.push(...missing);
  }

  return {
    ...input,
    hero: {
      ...input.hero,
      backgroundImage: withFallbackImage(input.hero?.backgroundImage, CAREERS_CONTENT_SEED.hero.backgroundImage),
    },
    cultureCards,
    valueTabs: (input.valueTabs || CAREERS_CONTENT_SEED.valueTabs).map((tab, index) => ({
      ...tab,
      img: withFallbackImage(tab?.img, CAREERS_CONTENT_SEED.valueTabs[index]?.img || CAREERS_CONTENT_SEED.valueTabs[0].img),
    })),
    benefits: input.benefits || [...CAREERS_CONTENT_SEED.benefits],
    testimonials: (input.testimonials || CAREERS_CONTENT_SEED.testimonials).map((item, index) => ({
      ...item,
      image: withFallbackImage(
        item?.image,
        CAREERS_CONTENT_SEED.testimonials[index]?.image || CAREERS_CONTENT_SEED.testimonials[0].image
      ),
    })),
    cultureSpotlight: {
      ...(input.cultureSpotlight || CAREERS_CONTENT_SEED.cultureSpotlight),
      image: withFallbackImage(input.cultureSpotlight?.image, CAREERS_CONTENT_SEED.cultureSpotlight.image),
    },
  };
};

const createInitialState = (): CareersCmsState => {
  const seed = cloneSeed();
  const now = nowIso();
  return {
    draft: cloneContent(seed),
    published: cloneContent(seed),
    updatedAt: now,
    publishedAt: now,
  };
};

const normalizeState = (state: CareersCmsState): CareersCmsState => ({
  draft: cloneContent(ensureContentShape(state.draft)),
  published: cloneContent(ensureContentShape(state.published)),
  updatedAt: state.updatedAt || nowIso(),
  publishedAt: state.publishedAt || nowIso(),
});

const notify = () => {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
  }
};

const readApiState = async (): Promise<CareersCmsState> => {
  try {
    const response = await axios.get(`/api/site-content/${encodeURIComponent(CAREERS_STATE_KEY)}`);
    const payload = (response.data as { data?: { payload?: CareersCmsState } } | undefined)?.data?.payload;
    if (!payload || !payload.draft || !payload.published) return createInitialState();
    return normalizeState(payload);
  } catch {
    return createInitialState();
  }
};

const ensureLoaded = async (): Promise<CareersCmsState> => {
  if (cachedState) return cachedState;
  if (!loadPromise) {
    loadPromise = readApiState()
      .then((state) => {
        cachedState = state;
        return state;
      })
      .finally(() => {
        loadPromise = null;
      });
  }
  return loadPromise;
};

const persistState = async (state: CareersCmsState) => {
  cachedState = normalizeState(state);
  notify();
  try {
    await axios.put(`/api/site-content/${encodeURIComponent(CAREERS_STATE_KEY)}`, { payload: cachedState });
  } catch (error) {
    console.error("Failed to persist careers content to backend.", error);
  }
};

export const careersService = {
  async getPublishedContent(): Promise<CareersContent> {
    const state = await ensureLoaded();
    return cloneContent(state.published);
  },

  async getDraftContent(): Promise<CareersContent> {
    const state = await ensureLoaded();
    return cloneContent(state.draft);
  },

  async saveDraft(next: CareersContent): Promise<void> {
    const state = await ensureLoaded();
    await persistState({
      ...state,
      draft: cloneContent(ensureContentShape(next)),
      updatedAt: nowIso(),
    });
  },

  async publishDraft(): Promise<void> {
    const state = await ensureLoaded();
    const now = nowIso();
    await persistState({
      ...state,
      published: cloneContent(state.draft),
      updatedAt: now,
      publishedAt: now,
    });
  },

  async resetDraftToPublished(): Promise<void> {
    const state = await ensureLoaded();
    await persistState({
      ...state,
      draft: cloneContent(state.published),
      updatedAt: nowIso(),
    });
  },

  async getMeta(): Promise<{ updatedAt: string; publishedAt: string }> {
    const state = await ensureLoaded();
    return { updatedAt: state.updatedAt, publishedAt: state.publishedAt };
  },

  async getContent(): Promise<CareersContent> {
    return this.getPublishedContent();
  },

  async updateContent(next: CareersContent): Promise<void> {
    await this.saveDraft(next);
    await this.publishDraft();
  },

  subscribe(onChange: () => void): () => void {
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  },
};
