import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, Plus, Save, Upload } from "lucide-react";
import { careersService } from "../../services/careers";
import type { CareersCard, CareersContent } from "../../types/careers";

const createEmptyCard = (): CareersCard => ({
  title: "",
  desc: "",
  img: "",
  link: "/",
});

const createEmptyTestimonial = () => ({
  name: "",
  role: "",
  quote: "",
  image: "",
});

const cloneContent = (value: CareersContent): CareersContent => JSON.parse(JSON.stringify(value)) as CareersContent;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const isDataImage = (value: string) => value.trim().startsWith("data:image");

const CareersContentManager = () => {
  const [content, setContent] = useState<CareersContent | null>(null);
  const [publishedContent, setPublishedContent] = useState<CareersContent | null>(null);
  const [lastSavedDraft, setLastSavedDraft] = useState<CareersContent | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [meta, setMeta] = useState<{ updatedAt: string; publishedAt: string } | null>(null);

  const load = async () => {
    const [draft, published, details] = await Promise.all([
      careersService.getDraftContent(),
      careersService.getPublishedContent(),
      careersService.getMeta(),
    ]);
    setContent(draft);
    setPublishedContent(cloneContent(published));
    setLastSavedDraft(cloneContent(draft));
    setMeta(details);
  };

  useEffect(() => {
    load();
    return careersService.subscribe(load);
  }, []);

  const saveDraft = async () => {
    if (!content) return;
    setMessage(null);
    try {
      setSavingDraft(true);
      await careersService.saveDraft(content);
      setLastSavedDraft(cloneContent(content));
      setMessage({ type: "success", text: "Draft saved successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to save draft. Please try again." });
    } finally {
      setSavingDraft(false);
    }
  };

  const publish = async () => {
    if (!content) return;
    setMessage(null);
    try {
      setPublishing(true);
      await careersService.saveDraft(content);
      await careersService.publishDraft();
      setLastSavedDraft(cloneContent(content));
      setPublishedContent(cloneContent(content));
      setMessage({ type: "success", text: "Changes published to website." });
    } catch {
      setMessage({ type: "error", text: "Failed to publish changes. Please try again." });
    } finally {
      setPublishing(false);
    }
  };

  const preview = async () => {
    if (!content) return;
    setMessage(null);
    try {
      setPreviewing(true);
      if (isDirty) {
        await careersService.saveDraft(content);
        setLastSavedDraft(cloneContent(content));
      }
      window.open("/careers?preview=draft", "_blank", "noopener,noreferrer");
    } catch {
      setMessage({ type: "error", text: "Failed to prepare preview. Please try again." });
    } finally {
      setPreviewing(false);
    }
  };

  const resetDraft = async () => {
    const ok = window.confirm("Reset draft to the currently published version?");
    if (!ok) return;
    setMessage(null);
    try {
      await careersService.resetDraftToPublished();
      setMessage({ type: "success", text: "Draft reset to published content." });
    } catch {
      setMessage({ type: "error", text: "Failed to reset draft. Please try again." });
    }
  };

  const updateImageValue = async (file: File | null | undefined, apply: (nextValue: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload a valid image file." });
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      apply(dataUrl);
      setMessage({ type: "success", text: "Image selected. Click Publish to push this image live." });
    } catch {
      setMessage({ type: "error", text: "Failed to read image file. Please try again." });
    }
  };

  const isDirty =
    !!content && !!lastSavedDraft && JSON.stringify(content) !== JSON.stringify(lastSavedDraft);

  const restoreHeroFromPublished = () => {
    if (!content || !publishedContent) return;
    setContent({ ...content, hero: { ...publishedContent.hero } });
    setMessage({ type: "success", text: "Hero block restored from published content." });
  };

  const restoreCultureCardFromPublished = (index: number) => {
    if (!content || !publishedContent) return;
    const publishedCard = publishedContent.cultureCards[index];
    if (!publishedCard) return;
    const next = [...content.cultureCards];
    next[index] = { ...publishedCard };
    setContent({ ...content, cultureCards: next });
    setMessage({ type: "success", text: `Culture card ${index + 1} restored from published content.` });
  };

  const restoreTestimonialsFromPublished = (index: number) => {
    if (!content || !publishedContent) return;
    const publishedItem = publishedContent.testimonials[index];
    if (!publishedItem) return;
    const next = [...content.testimonials];
    next[index] = { ...publishedItem };
    setContent({ ...content, testimonials: next });
    setMessage({ type: "success", text: `Testimonial ${index + 1} restored from published content.` });
  };

  const restoreCultureSpotlightFromPublished = () => {
    if (!content || !publishedContent) return;
    setContent({ ...content, cultureSpotlight: { ...publishedContent.cultureSpotlight } });
    setMessage({ type: "success", text: "Culture spotlight restored from published content." });
  };

  if (!content) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500">Loading careers content...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h4 className="text-xl font-black text-[#0f172a]">Publishing Workflow</h4>
          {meta && (
            <p className="text-xs text-gray-500">
              Draft updated: {new Date(meta.updatedAt).toLocaleString()} | Published: {new Date(meta.publishedAt).toLocaleString()} {isDirty ? "| Unsaved changes in editor" : ""}
            </p>
          )}
        </div>
        {message && (
          <div
            className={`mb-4 rounded-xl border px-3 py-2 text-sm font-medium ${message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={saveDraft}
            disabled={!isDirty || savingDraft || publishing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700"
          >
            <Save className="w-4 h-4" />
            {savingDraft ? "Saving Draft..." : "Save Draft"}
          </button>
          <button
            onClick={publish}
            disabled={savingDraft || publishing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white text-sm font-semibold hover:bg-[#19b850]"
          >
            <Upload className="w-4 h-4" />
            {publishing ? "Publishing..." : "Publish to Website"}
          </button>
          <button
            onClick={preview}
            disabled={savingDraft || publishing || previewing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700"
          >
            <Eye className="w-4 h-4" />
            {previewing ? "Preparing Preview..." : "Preview Careers Page"}
          </button>
          <button
            onClick={resetDraft}
            disabled={savingDraft || publishing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700"
          >
            Reset Draft
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h4 className="text-xl font-black text-[#0f172a]">Hero Block</h4>
          <button
            onClick={restoreHeroFromPublished}
            disabled={!publishedContent || savingDraft || publishing}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-60"
          >
            Restore Published
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border border-gray-200 rounded-xl px-3 py-2.5" value={content.hero.badge}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
            placeholder="Badge" />
          <input className="border border-gray-200 rounded-xl px-3 py-2.5" value={content.hero.titlePrefix}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, titlePrefix: e.target.value } })}
            placeholder="Title prefix" />
          <input className="border border-gray-200 rounded-xl px-3 py-2.5" value={content.hero.titleHighlight}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
            placeholder="Title highlight" />
          <div className="md:col-span-2 rounded-xl border border-gray-200 p-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hero Image</p>
            <div className="h-44 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              {content.hero.backgroundImage ? (
                <img src={content.hero.backgroundImage} alt="Hero preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image selected</div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    void updateImageValue(e.target.files?.[0], (nextValue) =>
                      setContent({ ...content, hero: { ...content.hero, backgroundImage: nextValue } })
                    );
                    e.currentTarget.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                onClick={() => setContent({ ...content, hero: { ...content.hero, backgroundImage: "" } })}
              >
                Clear
              </button>
            </div>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              value={isDataImage(content.hero.backgroundImage) ? "" : content.hero.backgroundImage}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, backgroundImage: e.target.value } })}
              placeholder="Or paste image URL"
            />
            {isDataImage(content.hero.backgroundImage) && (
              <p className="text-xs text-gray-500">Using uploaded image data.</p>
            )}
          </div>
          <input className="border border-gray-200 rounded-xl px-3 py-2.5" value={content.hero.ctaLabel}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaLabel: e.target.value } })}
            placeholder="CTA label" />
          <input className="border border-gray-200 rounded-xl px-3 py-2.5" value={content.hero.ctaPath}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaPath: e.target.value } })}
            placeholder="CTA path" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-black text-[#0f172a]">Culture Cards</h4>
          <button
            onClick={() => setContent({ ...content, cultureCards: [...content.cultureCards, createEmptyCard()] })}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>
        <div className="space-y-4">
          {content.cultureCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="rounded-xl border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border border-gray-200 rounded-lg px-3 py-2" value={card.title}
                onChange={(e) => {
                  const next = [...content.cultureCards];
                  next[index] = { ...card, title: e.target.value };
                  setContent({ ...content, cultureCards: next });
                }}
                placeholder="Card title" />
              <input className="border border-gray-200 rounded-lg px-3 py-2" value={card.link}
                onChange={(e) => {
                  const next = [...content.cultureCards];
                  next[index] = { ...card, link: e.target.value };
                  setContent({ ...content, cultureCards: next });
                }}
                placeholder="Card link" />
              <div className="md:col-span-2 rounded-lg border border-gray-200 p-3 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Card Image</p>
                <div className="h-44 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  {card.img ? (
                    <img src={card.img} alt={card.title || `Culture card ${index + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image selected</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        void updateImageValue(e.target.files?.[0], (nextValue) => {
                          const next = [...content.cultureCards];
                          next[index] = { ...card, img: nextValue };
                          setContent({ ...content, cultureCards: next });
                        });
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                    onClick={() => {
                      const next = [...content.cultureCards];
                      next[index] = { ...card, img: "" };
                      setContent({ ...content, cultureCards: next });
                    }}
                  >
                    Clear
                  </button>
                </div>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  value={isDataImage(card.img) ? "" : card.img}
                  onChange={(e) => {
                    const next = [...content.cultureCards];
                    next[index] = { ...card, img: e.target.value };
                    setContent({ ...content, cultureCards: next });
                  }}
                  placeholder="Or paste image URL"
                />
                {isDataImage(card.img) && <p className="text-xs text-gray-500">Using uploaded image data.</p>}
              </div>
              <textarea className="border border-gray-200 rounded-lg px-3 py-2 md:col-span-2 min-h-[72px]" value={card.desc}
                onChange={(e) => {
                  const next = [...content.cultureCards];
                  next[index] = { ...card, desc: e.target.value };
                  setContent({ ...content, cultureCards: next });
                }}
                placeholder="Card description" />
              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => restoreCultureCardFromPublished(index)}
                  disabled={!publishedContent?.cultureCards[index] || savingDraft || publishing}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-60"
                >
                  Restore Published
                </button>
                <button onClick={() => {
                  if (index === 0) return;
                  const next = [...content.cultureCards];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  setContent({ ...content, cultureCards: next });
                }} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" title="Move up"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => {
                  if (index === content.cultureCards.length - 1) return;
                  const next = [...content.cultureCards];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  setContent({ ...content, cultureCards: next });
                }} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" title="Move down"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => {
                  const next = content.cultureCards.filter((_, i) => i !== index);
                  setContent({ ...content, cultureCards: next.length ? next : [createEmptyCard()] });
                }} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-black text-[#0f172a]">Benefits Section</h4>
          <button
            onClick={() => setContent({ ...content, benefits: [...content.benefits, ""] })}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Benefit
          </button>
        </div>
        <div className="space-y-3">
          {content.benefits.map((benefit, index) => (
            <div key={`${benefit}-${index}`} className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                value={benefit}
                onChange={(e) => {
                  const next = [...content.benefits];
                  next[index] = e.target.value;
                  setContent({ ...content, benefits: next });
                }}
                placeholder={`Benefit ${index + 1}`}
              />
              <button onClick={() => {
                const next = content.benefits.filter((_, i) => i !== index);
                setContent({ ...content, benefits: next.length ? next : [""] });
              }} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-black text-[#0f172a]">Testimonials</h4>
          <button
            onClick={() => setContent({ ...content, testimonials: [...content.testimonials, createEmptyTestimonial()] })}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
        <div className="space-y-4">
          {content.testimonials.map((item, index) => (
            <div key={`${item.name}-${index}`} className="rounded-xl border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border border-gray-200 rounded-lg px-3 py-2" value={item.name}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[index] = { ...item, name: e.target.value };
                  setContent({ ...content, testimonials: next });
                }}
                placeholder="Name" />
              <input className="border border-gray-200 rounded-lg px-3 py-2" value={item.role}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[index] = { ...item, role: e.target.value };
                  setContent({ ...content, testimonials: next });
                }}
                placeholder="Role" />
              <div className="md:col-span-2 rounded-lg border border-gray-200 p-3 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Profile Image</p>
                <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name || `Testimonial ${index + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image selected</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        void updateImageValue(e.target.files?.[0], (nextValue) => {
                          const next = [...content.testimonials];
                          next[index] = { ...item, image: nextValue };
                          setContent({ ...content, testimonials: next });
                        });
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                    onClick={() => {
                      const next = [...content.testimonials];
                      next[index] = { ...item, image: "" };
                      setContent({ ...content, testimonials: next });
                    }}
                  >
                    Clear
                  </button>
                </div>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  value={isDataImage(item.image) ? "" : item.image}
                  onChange={(e) => {
                    const next = [...content.testimonials];
                    next[index] = { ...item, image: e.target.value };
                    setContent({ ...content, testimonials: next });
                  }}
                  placeholder="Or paste image URL"
                />
                {isDataImage(item.image) && <p className="text-xs text-gray-500">Using uploaded image data.</p>}
              </div>
              <textarea className="border border-gray-200 rounded-lg px-3 py-2 md:col-span-2 min-h-[72px]" value={item.quote}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[index] = { ...item, quote: e.target.value };
                  setContent({ ...content, testimonials: next });
                }}
                placeholder="Quote" />
              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => restoreTestimonialsFromPublished(index)}
                  disabled={!publishedContent?.testimonials[index] || savingDraft || publishing}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-60"
                >
                  Restore Published
                </button>
                <button onClick={() => {
                  if (index === 0) return;
                  const next = [...content.testimonials];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  setContent({ ...content, testimonials: next });
                }} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" title="Move up"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => {
                  if (index === content.testimonials.length - 1) return;
                  const next = [...content.testimonials];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  setContent({ ...content, testimonials: next });
                }} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" title="Move down"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => {
                  const next = content.testimonials.filter((_, i) => i !== index);
                  setContent({ ...content, testimonials: next.length ? next : [createEmptyTestimonial()] });
                }} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h4 className="text-xl font-black text-[#0f172a]">Culture Spotlight</h4>
          <button
            onClick={restoreCultureSpotlightFromPublished}
            disabled={!publishedContent || savingDraft || publishing}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-60"
          >
            Restore Published
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border border-gray-200 rounded-lg px-3 py-2" value={content.cultureSpotlight.title}
            onChange={(e) => setContent({ ...content, cultureSpotlight: { ...content.cultureSpotlight, title: e.target.value } })}
            placeholder="Title" />
          <div className="md:col-span-2 rounded-lg border border-gray-200 p-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Spotlight Image</p>
            <div className="h-44 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              {content.cultureSpotlight.image ? (
                <img src={content.cultureSpotlight.image} alt={content.cultureSpotlight.title || "Culture spotlight"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image selected</div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    void updateImageValue(e.target.files?.[0], (nextValue) =>
                      setContent({ ...content, cultureSpotlight: { ...content.cultureSpotlight, image: nextValue } })
                    );
                    e.currentTarget.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                onClick={() => setContent({ ...content, cultureSpotlight: { ...content.cultureSpotlight, image: "" } })}
              >
                Clear
              </button>
            </div>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
              value={isDataImage(content.cultureSpotlight.image) ? "" : content.cultureSpotlight.image}
              onChange={(e) => setContent({ ...content, cultureSpotlight: { ...content.cultureSpotlight, image: e.target.value } })}
              placeholder="Or paste image URL"
            />
            {isDataImage(content.cultureSpotlight.image) && <p className="text-xs text-gray-500">Using uploaded image data.</p>}
          </div>
          <textarea className="border border-gray-200 rounded-lg px-3 py-2 md:col-span-2 min-h-[90px]" value={content.cultureSpotlight.description}
            onChange={(e) => setContent({ ...content, cultureSpotlight: { ...content.cultureSpotlight, description: e.target.value } })}
            placeholder="Description" />
        </div>
      </div>
    </div>
  );
};

export default CareersContentManager;
