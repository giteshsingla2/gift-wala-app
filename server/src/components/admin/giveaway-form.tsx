"use client";

import { useActionState, useState } from "react";

import { saveGiveaway } from "@/server-actions/giveaways";
import { buttonClass, Card, Field, FormMessage, inputClass } from "./ui";

export type DayTask = {
  taskType: "website" | "share" | "ad";
  websiteUrl: string;
  minSeconds: number;
  shareCount: number;
  shareMessage: string;
};

export type GiveawayFormValues = {
  id?: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  tileColorFrom: string;
  tileColorTo: string;
  categoryId: number | null;
  tagText: string;
  tagStyle: "daily" | "weekly" | "festival";
  winnersCount: number;
  prizeValue: number;
  haazriDays: number;
  startDate: string;
  lastDate: string;
  resultAt: string;
  isFeatured: boolean;
  sortOrder: number;
  status: "draft" | "live" | "ended" | "results_out";
  rulesText: string;
  days: DayTask[];
};

const TILE_PRESETS = [
  { name: "Recharge", from: "#FFE7A3", to: "#FFB938" },
  { name: "Cash", from: "#CFF7E2", to: "#5ED69A" },
  { name: "Data", from: "#E1E7FF", to: "#93A9FF" },
  { name: "Purple", from: "#F3E1FF", to: "#C084FC" },
  { name: "Teal", from: "#D5FBF6", to: "#4FD1C5" },
  { name: "Pink", from: "#FFE4EC", to: "#FB7299" },
  { name: "Festival", from: "#7A1F2B", to: "#C2410C" },
  { name: "Mega blue", from: "#13246B", to: "#2B4DE0" },
];

const TASK_LABELS = { share: "Share with friends", website: "Open website link", ad: "Watch reward ad" } as const;

export const blankDay = (): DayTask => ({ taskType: "share", websiteUrl: "", minSeconds: 30, shareCount: 5, shareMessage: "" });

// Trims or extends the day plan to n days, repeating the last day's task.
function fit(list: DayTask[], n: number) {
  const out = list.slice(0, n);
  while (out.length < n) out.push({ ...(out[out.length - 1] ?? blankDay()) });
  return out;
}

export function GiveawayForm({ initial, categories }: { initial: GiveawayFormValues; categories: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState(saveGiveaway, {});
  const [haazriDays, setHaazriDays] = useState(initial.haazriDays);
  const [days, setDays] = useState<DayTask[]>(() => fit(initial.days, initial.haazriDays));
  const [colors, setColors] = useState({ from: initial.tileColorFrom, to: initial.tileColorTo });
  const [preview, setPreview] = useState<string | null>(initial.imageUrl);

  function changeDays(n: number) {
    const safe = Math.max(1, Math.min(60, n || 1));
    setHaazriDays(safe);
    setDays((d) => fit(d, safe));
  }

  function updateDay(i: number, patch: Partial<DayTask>) {
    setDays((d) => d.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }

  return (
    <form action={action} className="space-y-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="days" value={JSON.stringify(days)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card title="Prize">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" hint="Shown on cards and the detail page, e.g. ₹20 recharge" className="sm:col-span-2">
                <input name="title" defaultValue={initial.title} required maxLength={120} className={inputClass} />
              </Field>
              <Field label="Subtitle" hint="One short line, e.g. Any mobile number, any operator" className="sm:col-span-2">
                <input name="subtitle" defaultValue={initial.subtitle} maxLength={200} className={inputClass} />
              </Field>
              <Field label="Number of winners">
                <input name="winnersCount" type="number" min={1} defaultValue={initial.winnersCount} className={inputClass} />
              </Field>
              <Field label="Prize value (₹)" hint="Added to each winner's total winnings">
                <input name="prizeValue" type="number" min={0} defaultValue={initial.prizeValue} className={inputClass} />
              </Field>
            </div>
          </Card>

          <Card title="Dates and haazri">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date" hint="First day it shows in the app">
                <input name="startDate" type="date" defaultValue={initial.startDate} required className={inputClass} />
              </Field>
              <Field label="Last date" hint="Shown in the app as “Last date”. Last day to do haazri">
                <input name="lastDate" type="date" defaultValue={initial.lastDate} required className={inputClass} />
              </Field>
              <Field label="Haazri days needed" hint="1 for a daily giveaway, 8, 10…">
                <input
                  name="haazriDays"
                  type="number"
                  min={1}
                  max={60}
                  value={haazriDays}
                  onChange={(e) => changeDays(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Result date and time (India)" hint="Used for “Result in” countdowns">
                <input name="resultAt" type="datetime-local" defaultValue={initial.resultAt} className={inputClass} />
              </Field>
            </div>
          </Card>

          <Card title="Day plan">
            <p className="mb-4 text-sm text-muted">
              One task per day. “Day 4” is the user’s 4th completed day, so late starters still begin at Day 1.
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              <button type="button" className={buttonClass("secondary")} onClick={() => setDays((d) => d.map(() => ({ ...d[0] })))}>
                Copy day 1 to every day
              </button>
              <button
                type="button"
                className={buttonClass("secondary")}
                onClick={() =>
                  setDays((d) => d.map((x, i) => ({ ...x, taskType: (["share", "website", "ad"] as const)[i % 3] })))
                }>
                Rotate share / website / ad
              </button>
            </div>
            <ol className="space-y-3">
              {days.map((d, i) => (
                <li key={i} className="rounded-lg border border-line p-3">
                  <div className="grid items-start gap-3 sm:grid-cols-[70px_200px_1fr]">
                    <span className="pt-2 text-sm font-semibold">Day {i + 1}</span>
                    <select value={d.taskType} onChange={(e) => updateDay(i, { taskType: e.target.value as DayTask["taskType"] })} className={inputClass} aria-label={`Day ${i + 1} task`}>
                      {Object.entries(TASK_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    {d.taskType === "website" ? (
                      <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                        <input placeholder="https://your-website.com/page" value={d.websiteUrl} onChange={(e) => updateDay(i, { websiteUrl: e.target.value })} className={inputClass} aria-label={`Day ${i + 1} website link`} />
                        <input type="number" min={5} value={d.minSeconds} onChange={(e) => updateDay(i, { minSeconds: Number(e.target.value) })} className={inputClass} aria-label={`Day ${i + 1} minimum seconds`} title="Minimum seconds on the website" />
                      </div>
                    ) : d.taskType === "share" ? (
                      <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
                        <input type="number" min={1} value={d.shareCount} onChange={(e) => updateDay(i, { shareCount: Number(e.target.value) })} className={inputClass} aria-label={`Day ${i + 1} number of friends`} title="Number of friends" />
                        <input placeholder="Share message (optional)" value={d.shareMessage} onChange={(e) => updateDay(i, { shareMessage: e.target.value })} className={inputClass} aria-label={`Day ${i + 1} share message`} />
                      </div>
                    ) : (
                      <p className="pt-2 text-xs text-amber-700">Needs the AdMob version of the app. Until then users can’t complete this day.</p>
                    )}
                  </div>
                  {d.taskType === "website" ? <p className="mt-1 text-xs text-muted sm:ml-[290px]">Link, then minimum seconds on the website</p> : null}
                  {d.taskType === "share" ? <p className="mt-1 text-xs text-muted sm:ml-[290px]">Number of friends, then the message</p> : null}
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Rules">
            <textarea name="rulesText" defaultValue={initial.rulesText} rows={5} className={inputClass} placeholder="Rules shown on the giveaway’s Rules page" />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publish">
            <div className="space-y-4">
              <Field label="Status" hint="Only “Live” giveaways show in the app, between start and last date">
                <select name="status" defaultValue={initial.status} className={inputClass}>
                  <option value="draft">Draft (hidden)</option>
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                  <option value="results_out">Results out</option>
                </select>
              </Field>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="isFeatured" defaultChecked={initial.isFeatured} className="mt-0.5 h-4 w-4" />
                <span>
                  <span className="font-medium">Mega Draw on Home</span>
                  <span className="block text-xs text-muted">Takes the big Home poster. Turns off any other Mega Draw.</span>
                </span>
              </label>
              <Field label="Sort order" hint="Lower numbers show first">
                <input name="sortOrder" type="number" defaultValue={initial.sortOrder} className={inputClass} />
              </Field>
            </div>
          </Card>

          <Card title="Prize photo">
            <div
              className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl"
              style={{ background: `linear-gradient(160deg, ${colors.from}, ${colors.to})` }}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-4/5 w-4/5 object-contain" />
              ) : (
                <span className="text-sm text-muted">No photo yet</span>
              )}
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="block w-full text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
            <p className="mt-2 text-xs text-muted">Square product photo on a transparent background, no text. Saved as 600×600 WebP.</p>
            {initial.imageUrl ? (
              <label className="mt-2 flex items-center gap-2 text-xs">
                <input type="checkbox" name="removeImage" /> Remove current photo
              </label>
            ) : null}
          </Card>

          <Card title="Look">
            <div className="space-y-4">
              <Field label="Tile colours">
                <div className="flex gap-2">
                  <input type="color" name="tileColorFrom" value={colors.from} onChange={(e) => setColors((c) => ({ ...c, from: e.target.value.toUpperCase() }))} className="h-10 w-full rounded" aria-label="Tile colour top" />
                  <input type="color" name="tileColorTo" value={colors.to} onChange={(e) => setColors((c) => ({ ...c, to: e.target.value.toUpperCase() }))} className="h-10 w-full rounded" aria-label="Tile colour bottom" />
                </div>
              </Field>
              <div className="flex flex-wrap gap-1.5">
                {TILE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    title={p.name}
                    aria-label={`Use ${p.name} colours`}
                    onClick={() => setColors({ from: p.from, to: p.to })}
                    className="h-7 w-7 rounded-md ring-1 ring-line"
                    style={{ background: `linear-gradient(160deg, ${p.from}, ${p.to})` }}
                  />
                ))}
              </div>
              <Field label="Category" hint="Which filter chip it appears under">
                <select name="categoryId" defaultValue={initial.categoryId ?? ""} className={inputClass}>
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tag text">
                  <input name="tagText" defaultValue={initial.tagText} maxLength={30} className={inputClass} />
                </Field>
                <Field label="Tag style">
                  <select name="tagStyle" defaultValue={initial.tagStyle} className={inputClass}>
                    <option value="daily">Blue (daily)</option>
                    <option value="weekly">Purple (weekly)</option>
                    <option value="festival">Orange (festival card)</option>
                  </select>
                </Field>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <button type="submit" disabled={pending} className={buttonClass()}>
          {pending ? "Saving…" : initial.id ? "Save changes" : "Create giveaway"}
        </button>
        <FormMessage error={state.error} success={state.success} />
      </div>
    </form>
  );
}
