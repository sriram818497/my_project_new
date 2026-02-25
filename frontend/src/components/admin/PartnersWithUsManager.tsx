import { useEffect, useState } from "react";
import { contentManagerService } from "../../services/contentManager";
import type { PartnerIconKey, PartnersPageContent } from "../../types/content";
import { trackAdminActivity } from "../../utils/adminActivityTracker";

const iconOptions: Array<{ value: PartnerIconKey; label: string }> = [
  { value: "target", label: "Target" },
  { value: "shield", label: "Shield" },
  { value: "rocket", label: "Rocket" },
  { value: "globe", label: "Globe" },
  { value: "zap", label: "Zap" },
  { value: "heart", label: "Heart" },
];

const reorderByIndex = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return items;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const PartnersWithUsManager = () => {
  const [content, setContent] = useState<PartnersPageContent>(() => contentManagerService.getPartnersPageContent());
  const [logoUploadNames, setLogoUploadNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const refresh = () => setContent(contentManagerService.getPartnersPageContent());
    refresh();
    return contentManagerService.subscribe(refresh);
  }, []);

  const savePartnersContent = () => {
    contentManagerService.savePartnersPageContent(content);
    trackAdminActivity({
      title: "Partners page content updated",
      detail: "Partners With Us page sections were updated.",
      tone: "success",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const resetPartnersContent = () => {
    setContent(contentManagerService.getPartnersPageContent());
    setLogoUploadNames({});
  };

  const handleLogoUpload = (tierIndex: number, logoIndex: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setContent((prev) => ({
        ...prev,
        partnerTiers: prev.partnerTiers.map((row, i) =>
          i === tierIndex
            ? {
                ...row,
                logos: row.logos.map((logoRow, lIndex) =>
                  lIndex === logoIndex ? { ...logoRow, url: dataUrl } : logoRow
                ),
              }
            : row
        ),
      }));
      const logoId = content.partnerTiers[tierIndex]?.logos[logoIndex]?.id;
      if (!logoId) return;
      setLogoUploadNames((prev) => ({ ...prev, [logoId]: file.name }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h4 className="text-xl font-black text-[#0f172a]">Partners With Us Content Manager</h4>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-sm font-semibold text-[#0f172a]">Hero Section</p>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Hero badge"
            value={content.heroBadge}
            onChange={(e) => setContent((prev) => ({ ...prev, heroBadge: e.target.value }))}
          />
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Hero title"
            value={content.heroTitle}
            onChange={(e) => setContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Primary button"
              value={content.heroPrimaryButton}
              onChange={(e) => setContent((prev) => ({ ...prev, heroPrimaryButton: e.target.value }))}
            />
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Secondary button"
              value={content.heroSecondaryButton}
              onChange={(e) => setContent((prev) => ({ ...prev, heroSecondaryButton: e.target.value }))}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#0f172a]">Why Partner Cards</p>
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  whyPartnerItems: [
                    ...prev.whyPartnerItems,
                    { id: newId("why-partner"), title: "", desc: "", icon: "target" },
                  ],
                }))
              }
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
            >
              Add Card
            </button>
          </div>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Section title"
            value={content.whyPartnerTitle}
            onChange={(e) => setContent((prev) => ({ ...prev, whyPartnerTitle: e.target.value }))}
          />
          {content.whyPartnerItems.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      whyPartnerItems: prev.whyPartnerItems.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row
                      ),
                    }))
                  }
                />
                <select
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  value={item.icon}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      whyPartnerItems: prev.whyPartnerItems.map((row, i) =>
                        i === index ? { ...row, icon: e.target.value as PartnerIconKey } : row
                      ),
                    }))
                  }
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whyPartnerItems: reorderByIndex(prev.whyPartnerItems, index, index - 1),
                      }))
                    }
                    className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 disabled:opacity-40"
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whyPartnerItems: reorderByIndex(prev.whyPartnerItems, index, index + 1),
                      }))
                    }
                    className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 disabled:opacity-40"
                    disabled={index === content.whyPartnerItems.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whyPartnerItems: prev.whyPartnerItems.filter((_, i) => i !== index),
                      }))
                    }
                    className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-[64px]"
                placeholder="Description"
                value={item.desc}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    whyPartnerItems: prev.whyPartnerItems.map((row, i) =>
                      i === index ? { ...row, desc: e.target.value } : row
                    ),
                  }))
                }
              />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#0f172a]">Why Proteccio Cards</p>
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  whyProteccioItems: [
                    ...prev.whyProteccioItems,
                    { id: newId("why-proteccio"), title: "", desc: "", icon: "globe" },
                  ],
                }))
              }
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
            >
              Add Card
            </button>
          </div>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Section title"
            value={content.whyProteccioTitle}
            onChange={(e) => setContent((prev) => ({ ...prev, whyProteccioTitle: e.target.value }))}
          />
          {content.whyProteccioItems.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      whyProteccioItems: prev.whyProteccioItems.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row
                      ),
                    }))
                  }
                />
                <select
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  value={item.icon}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      whyProteccioItems: prev.whyProteccioItems.map((row, i) =>
                        i === index ? { ...row, icon: e.target.value as PartnerIconKey } : row
                      ),
                    }))
                  }
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whyProteccioItems: reorderByIndex(prev.whyProteccioItems, index, index - 1),
                      }))
                    }
                    className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 disabled:opacity-40"
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whyProteccioItems: reorderByIndex(prev.whyProteccioItems, index, index + 1),
                      }))
                    }
                    className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 disabled:opacity-40"
                    disabled={index === content.whyProteccioItems.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whyProteccioItems: prev.whyProteccioItems.filter((_, i) => i !== index),
                      }))
                    }
                    className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-[64px]"
                placeholder="Description"
                value={item.desc}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    whyProteccioItems: prev.whyProteccioItems.map((row, i) =>
                      i === index ? { ...row, desc: e.target.value } : row
                    ),
                  }))
                }
              />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-sm font-semibold text-[#0f172a]">Ways To Partner</p>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Section title"
            value={content.waysToPartnerTitle}
            onChange={(e) => setContent((prev) => ({ ...prev, waysToPartnerTitle: e.target.value }))}
          />
          {content.partnerTiers.map((tier, tierIndex) => (
            <div key={tier.id} className="rounded-xl border border-gray-200 p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Tier title"
                  value={tier.title}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      partnerTiers: prev.partnerTiers.map((row, i) =>
                        i === tierIndex ? { ...row, title: e.target.value } : row
                      ),
                    }))
                  }
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Tier id"
                  value={tier.id}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      partnerTiers: prev.partnerTiers.map((row, i) =>
                        i === tierIndex ? { ...row, id: e.target.value } : row
                      ),
                    }))
                  }
                />
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-[64px]"
                placeholder="Tier description"
                value={tier.desc}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    partnerTiers: prev.partnerTiers.map((row, i) =>
                      i === tierIndex ? { ...row, desc: e.target.value } : row
                    ),
                  }))
                }
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-700">Logos</p>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        partnerTiers: prev.partnerTiers.map((row, i) =>
                          i === tierIndex
                            ? {
                                ...row,
                                logos: [...row.logos, { id: newId("logo"), name: "", url: "" }],
                              }
                            : row
                        ),
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
                  >
                    Add Logo
                  </button>
                </div>
                {tier.logos.map((logo, logoIndex) => (
                  <div key={logo.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-500">Use URL or upload logo image</p>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2"
                      placeholder="Logo name"
                      value={logo.name}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          partnerTiers: prev.partnerTiers.map((row, i) =>
                            i === tierIndex
                              ? {
                                  ...row,
                                  logos: row.logos.map((logoRow, lIndex) =>
                                    lIndex === logoIndex ? { ...logoRow, name: e.target.value } : logoRow
                                  ),
                                }
                              : row
                          ),
                        }))
                      }
                    />
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2"
                      placeholder="Logo URL (e.g. /logos/brand.png)"
                      value={logo.url}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          partnerTiers: prev.partnerTiers.map((row, i) =>
                            i === tierIndex
                              ? {
                                  ...row,
                                  logos: row.logos.map((logoRow, lIndex) =>
                                    lIndex === logoIndex ? { ...logoRow, url: e.target.value } : logoRow
                                  ),
                                }
                              : row
                          ),
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          partnerTiers: prev.partnerTiers.map((row, i) =>
                            i === tierIndex
                              ? { ...row, logos: row.logos.filter((_, lIndex) => lIndex !== logoIndex) }
                              : row
                          ),
                        }))
                      }
                      className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
                    >
                      Remove
                    </button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      onChange={(e) => handleLogoUpload(tierIndex, logoIndex, e.target.files?.[0] ?? null)}
                    />
                    {logoUploadNames[logo.id] && (
                      <p className="text-xs text-gray-500">
                        Uploaded file: <span className="font-semibold text-gray-700">{logoUploadNames[logo.id]}</span>
                      </p>
                    )}
                    {logo.url && (
                      <div className="rounded-lg border border-gray-200 p-2 w-fit">
                        <p className="text-[11px] font-semibold text-gray-600 mb-1">Logo preview</p>
                        <img
                          src={logo.url}
                          alt={logo.name || "Partner logo preview"}
                          className="h-12 w-auto max-w-[160px] object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#0f172a]">Become A Partner Steps</p>
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  becomePartnerSteps: [
                    ...prev.becomePartnerSteps,
                    { id: newId("step"), num: `${prev.becomePartnerSteps.length + 1}.`, title: "", desc: "" },
                  ],
                }))
              }
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
            >
              Add Step
            </button>
          </div>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Section title"
            value={content.becomePartnerTitle}
            onChange={(e) => setContent((prev) => ({ ...prev, becomePartnerTitle: e.target.value }))}
          />
          {content.becomePartnerSteps.map((step, index) => (
            <div key={step.id} className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_auto] gap-2">
              <input
                className="border border-gray-200 rounded-lg px-3 py-2"
                placeholder="No."
                value={step.num}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    becomePartnerSteps: prev.becomePartnerSteps.map((row, i) =>
                      i === index ? { ...row, num: e.target.value } : row
                    ),
                  }))
                }
              />
              <input
                className="border border-gray-200 rounded-lg px-3 py-2"
                placeholder="Title"
                value={step.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    becomePartnerSteps: prev.becomePartnerSteps.map((row, i) =>
                      i === index ? { ...row, title: e.target.value } : row
                    ),
                  }))
                }
              />
              <input
                className="border border-gray-200 rounded-lg px-3 py-2"
                placeholder="Description"
                value={step.desc}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    becomePartnerSteps: prev.becomePartnerSteps.map((row, i) =>
                      i === index ? { ...row, desc: e.target.value } : row
                    ),
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    becomePartnerSteps: prev.becomePartnerSteps.filter((_, i) => i !== index),
                  }))
                }
                className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-sm font-semibold text-[#0f172a]">Form & Support Settings</p>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-[64px]"
            placeholder="Company size options (one per line)"
            value={content.formCompanySizeOptions.join("\n")}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                formCompanySizeOptions: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
              }))
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Default country"
              value={content.formDefaultCountry}
              onChange={(e) => setContent((prev) => ({ ...prev, formDefaultCountry: e.target.value }))}
            />
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Submit button label"
              value={content.formSubmitButton}
              onChange={(e) => setContent((prev) => ({ ...prev, formSubmitButton: e.target.value }))}
            />
          </div>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
            placeholder="Success message"
            value={content.formSuccessMessage}
            onChange={(e) => setContent((prev) => ({ ...prev, formSuccessMessage: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Support heading"
              value={content.supportTitle}
              onChange={(e) => setContent((prev) => ({ ...prev, supportTitle: e.target.value }))}
            />
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Support email"
              value={content.supportEmail}
              onChange={(e) => setContent((prev) => ({ ...prev, supportEmail: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={savePartnersContent} className="px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold">
            Save Partners Content
          </button>
          <button
            onClick={() => window.open("/partners", "_blank", "noopener,noreferrer")}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold"
          >
            Preview Partners Page
          </button>
          <button onClick={resetPartnersContent} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">
            Reset Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnersWithUsManager;
