"use client";

import { useActionState } from "react";

import { buttonClass, Card, Field, FormMessage, inputClass } from "@/components/admin/ui";
import { SECTION_KEYS, SECTION_LABELS, type AppSettings } from "@/lib/settings-shared";
import { updateSettings } from "@/server-actions/users-settings";

export function SettingsForm({ initial }: { initial: AppSettings }) {
  const [state, action, pending] = useActionState(updateSettings, {});
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card title="Links and versions">
        <div className="space-y-4">
          <Field label="WhatsApp channel link" hint="Opened by “Join channel” on Home. Leave empty to hide the button.">
            <input name="whatsappChannelUrl" type="url" defaultValue={initial.whatsappChannelUrl} placeholder="https://whatsapp.com/channel/…" className={inputClass} />
          </Field>
          <Field label="Minimum app version" hint="Users on an older version are asked to update from the Play Store. Raise it only when old versions stop working.">
            <input name="minAppVersion" defaultValue={initial.minAppVersion} pattern="\d+\.\d+\.\d+" className={`${inputClass} max-w-[160px]`} />
          </Field>
        </div>
      </Card>
      <Card title="Home sections">
        <div className="space-y-3">
          {SECTION_KEYS.map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={`section_${k}`} defaultChecked={initial.sections[k]} className="h-4 w-4" />
              {SECTION_LABELS[k]}
            </label>
          ))}
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass()}>
          {pending ? "Saving…" : "Save settings"}
        </button>
        <FormMessage error={state.error} success={state.success} />
      </div>
    </form>
  );
}
