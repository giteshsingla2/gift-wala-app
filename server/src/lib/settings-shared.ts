// App-wide settings managed from the admin panel. Shared with client components, so no server imports here.
export const SECTION_KEYS = ["megaPoster", "ticker", "today", "luckyWinners", "whatsapp"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  megaPoster: "Mega Draw poster on Home",
  ticker: "Live winner ticker on Home",
  today: "Today's giveaways on Home",
  luckyWinners: "Lucky winners on Home",
  whatsapp: "WhatsApp channel card on Home",
};

export type AppSettings = {
  whatsappChannelUrl: string;
  minAppVersion: string;
  sections: Record<SectionKey, boolean>;
};
