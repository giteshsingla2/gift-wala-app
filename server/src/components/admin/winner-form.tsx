"use client";

import { useActionState, useState } from "react";

import { saveWinner } from "@/server-actions/winners";
import { buttonClass, Card, Field, FormMessage, inputClass } from "./ui";

export type WinnerFormValues = {
  id?: number;
  giveawayId: number | null;
  phone: string;
  displayName: string;
  town: string;
  prizeLabel: string;
  prizeValue: number;
  wonAt: string;
  photoUrl: string | null;
  videoUrl: string;
  isPublished: boolean;
  isSpotlight: boolean;
  isPinnedHome: boolean;
  sortOrder: number;
};

type GiveawayOption = { id: number; title: string; prizeValue: number };

export function WinnerForm({ initial, giveaways }: { initial: WinnerFormValues; giveaways: GiveawayOption[] }) {
  const [state, action, pending] = useActionState(saveWinner, {});
  const [preview, setPreview] = useState(initial.photoUrl);
  const [prize, setPrize] = useState({ label: initial.prizeLabel, value: initial.prizeValue });

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <div className="space-y-6">
        <Card title="Winner">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Giveaway" className="sm:col-span-2">
              <select
                name="giveawayId"
                defaultValue={initial.giveawayId ?? ""}
                required
                className={inputClass}
                onChange={(e) => {
                  const g = giveaways.find((x) => x.id === Number(e.target.value));
                  if (g && !initial.id) setPrize({ label: g.title, value: g.prizeValue });
                }}>
                <option value="" disabled>
                  Choose a giveaway
                </option>
                {giveaways.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name shown in the app" hint="First name and surname is fine. Never put a phone number here.">
              <input name="displayName" defaultValue={initial.displayName} required maxLength={80} className={inputClass} />
            </Field>
            <Field label="Town or city">
              <input name="town" defaultValue={initial.town} maxLength={80} className={inputClass} />
            </Field>
            <Field label="Prize as shown" hint="e.g. iPhone 15, ₹20 recharge">
              <input name="prizeLabel" value={prize.label} onChange={(e) => setPrize((p) => ({ ...p, label: e.target.value }))} required maxLength={120} className={inputClass} />
            </Field>
            <Field label="Prize value (₹)" hint="Counts towards the user’s total winnings">
              <input name="prizeValue" type="number" min={0} value={prize.value} onChange={(e) => setPrize((p) => ({ ...p, value: Number(e.target.value) }))} className={inputClass} />
            </Field>
            <Field label="Won on (India time)">
              <input name="wonAt" type="datetime-local" defaultValue={initial.wonAt} required className={inputClass} />
            </Field>
            <Field label="User’s phone (private)" hint="Links the win to their account. Never shown in the app.">
              <input name="phone" defaultValue={initial.phone} inputMode="tel" placeholder="10-digit mobile" className={inputClass} />
            </Field>
            <Field label="Video link" hint="Video of them receiving the prize (YouTube, Instagram…)" className="sm:col-span-2">
              <input name="videoUrl" type="url" defaultValue={initial.videoUrl} placeholder="https://" className={inputClass} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Where it shows">
          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-2">
              <input type="checkbox" name="isPublished" defaultChecked={initial.isPublished} className="mt-0.5 h-4 w-4" />
              <span>
                <span className="font-medium">Published</span>
                <span className="block text-xs text-muted">Shows in the app (ticker, winners lists). Untick to hide but keep the record.</span>
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" name="isPinnedHome" defaultChecked={initial.isPinnedHome} className="mt-0.5 h-4 w-4" />
              <span>
                <span className="font-medium">Pin on Home</span>
                <span className="block text-xs text-muted">Appears in Home’s “Lucky winners” panel.</span>
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" name="isSpotlight" defaultChecked={initial.isSpotlight} className="mt-0.5 h-4 w-4" />
              <span>
                <span className="font-medium">Mega winner spotlight</span>
                <span className="block text-xs text-muted">Big crown at the top of the Winners screen and listed under “Mega draw”.</span>
              </span>
            </label>
            <Field label="Sort order" hint="Lower shows first">
              <input name="sortOrder" type="number" defaultValue={initial.sortOrder} className={inputClass} />
            </Field>
          </div>
        </Card>
        <Card title="Photo">
          <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-canvas">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm text-muted">No photo (initials are shown)</span>
            )}
          </div>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          <p className="mt-2 text-xs text-muted">Only with the winner’s permission. Cropped to a square.</p>
          {initial.photoUrl ? (
            <label className="mt-2 flex items-center gap-2 text-xs">
              <input type="checkbox" name="removePhoto" /> Remove current photo
            </label>
          ) : null}
        </Card>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8 lg:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass()}>
          {pending ? "Saving…" : initial.id ? "Save changes" : "Add winner"}
        </button>
        <FormMessage error={state.error} success={state.success} />
      </div>
    </form>
  );
}
