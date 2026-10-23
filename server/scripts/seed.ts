// Development seed: categories, sample giveaways with day plans, settings, and a few sample
// winners so every screen has something to show. Refuses to run against a non-local database,
// because the sample winners are not real people and must never reach production.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { sql } from "drizzle-orm";
import sharp from "sharp";

import { db, schema } from "../src/db";
import { addDays, istDate } from "../src/lib/dates";
import { saveSettings, SECTION_KEYS } from "../src/lib/settings";
import { uploadDir } from "../src/lib/uploads";

const url = process.env.DATABASE_URL ?? "";
if (!/@(127\.0\.0\.1|localhost)[:/]/.test(url)) {
  console.error("Refusing to seed: DATABASE_URL is not a local database.");
  process.exit(1);
}

async function seedImage(name: string) {
  const svg = await readFile(path.join(__dirname, "seed-images", `${name}.svg`));
  const out = await sharp(svg, { density: 600 })
    .resize(600, 600, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82 })
    .toBuffer();
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), `seed-${name}.webp`), out);
  return `/uploads/seed-${name}.webp`;
}

async function main() {
  const today = istDate();

  // Start clean (dev only).
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  for (const t of ["winners", "draws", "haazri_attempts", "progress", "sessions", "giveaway_days", "giveaways", "categories", "settings"]) {
    await db.execute(sql.raw(`TRUNCATE TABLE ${t}`));
  }
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

  const categoryNames = ["Recharge", "Cash", "Data", "Products", "Festival"];
  await db.insert(schema.categories).values(categoryNames.map((name, i) => ({ name, sortOrder: i })));
  const cats = Object.fromEntries((await db.select().from(schema.categories)).map((c) => [c.name, c.id]));

  const base = { status: "live" as const, startDate: addDays(today, -2), rulesText: "One haazri per day. Entry is free: we never ask for money. Winners are picked by a random draw." };
  const samples = [
    { title: "iPhone 16", subtitle: "Complete 10 days of haazri to enter the draw", image: "iphone", from: "#13246B", to: "#2B4DE0", cat: "Products", tag: "MEGA DRAW", style: "festival", winners: 1, value: 79900, days: 10, last: 20, featured: true },
    { title: "₹20 recharge", subtitle: "Any mobile number, any operator", image: "recharge", from: "#FFE7A3", to: "#FFB938", cat: "Recharge", tag: "DAILY", style: "daily", winners: 50, value: 20, days: 1, last: 0 },
    { title: "₹10 UPI cash", subtitle: "Sent straight to your UPI ID", image: "cash", from: "#CFF7E2", to: "#5ED69A", cat: "Cash", tag: "DAILY", style: "daily", winners: 100, value: 10, days: 1, last: 0 },
    { title: "1.5 GB data", subtitle: "Data pack on any operator", image: "data", from: "#E1E7FF", to: "#93A9FF", cat: "Data", tag: "DAILY", style: "daily", winners: 30, value: 19, days: 1, last: 0 },
    { title: "₹501 cash", subtitle: "Diwali special", image: "diya", from: "#7A1F2B", to: "#C2410C", cat: "Festival", tag: "DIWALI SPECIAL", style: "festival", winners: 21, value: 501, days: 3, last: 15 },
    { title: "₹100 recharge", subtitle: "Any mobile number, any operator", image: "recharge100", from: "#F3E1FF", to: "#C084FC", cat: "Recharge", tag: "WEEKLY", style: "weekly", winners: 10, value: 100, days: 5, last: 8 },
    { title: "Bluetooth earbuds", subtitle: "Delivered free to your home", image: "earbuds", from: "#D5FBF6", to: "#4FD1C5", cat: "Products", tag: "WEEKLY", style: "weekly", winners: 5, value: 1499, days: 8, last: 12 },
    { title: "Smart watch", subtitle: "Delivered free to your home", image: "watch", from: "#FFE4EC", to: "#FB7299", cat: "Products", tag: "WEEKLY", style: "weekly", winners: 3, value: 1999, days: 7, last: 12 },
  ] as const;

  const taskCycle = [
    { taskType: "share" as const, shareCount: 5, shareMessage: "Win free prizes daily on Gift Wala. Entry is always free!" },
    { taskType: "website" as const, websiteUrl: "https://example.com", minSeconds: 20 },
    { taskType: "ad" as const },
  ];

  for (const [i, s] of samples.entries()) {
    const [res] = await db.insert(schema.giveaways).values({
      ...base,
      title: s.title,
      subtitle: s.subtitle,
      imageUrl: await seedImage(s.image),
      tileColorFrom: s.from,
      tileColorTo: s.to,
      categoryId: cats[s.cat],
      tagText: s.tag,
      tagStyle: s.style,
      winnersCount: s.winners,
      prizeValue: s.value,
      haazriDays: s.days,
      lastDate: addDays(today, s.last),
      resultAt: new Date(`${addDays(today, s.last + 1)}T10:00:00+05:30`),
      isFeatured: "featured" in s && s.featured,
      sortOrder: i,
    });
    await db.insert(schema.giveawayDays).values(
      Array.from({ length: s.days }, (_, d) => ({ giveawayId: res.insertId, dayNumber: d + 1, ...taskCycle[(d + i) % 2] })),
    );
  }

  await saveSettings({
    whatsappChannelUrl: "https://whatsapp.com/channel/REPLACE_WITH_CHANNEL_ID",
    minAppVersion: "1.0.0",
    sections: Object.fromEntries(SECTION_KEYS.map((k) => [k, true])) as never,
  });

  // Sample winners (development only — not real people).
  const g = Object.fromEntries((await db.select().from(schema.giveaways)).map((x) => [x.title, x.id]));
  const yesterday = new Date(`${addDays(today, -1)}T21:00:00+05:30`);
  await db.insert(schema.winners).values([
    { giveawayId: g["iPhone 16"], displayName: "Sunita Devi", town: "Bareilly", prizeLabel: "iPhone 15", prizeValue: 69900, wonAt: new Date("2026-09-30T18:00:00+05:30"), videoUrl: "https://example.com/winner-video", isPublished: true, isSpotlight: true, isPinnedHome: true, sortOrder: 0 },
    { giveawayId: g["₹20 recharge"], displayName: "Pooja Yadav", town: "Azamgarh", prizeLabel: "₹20 recharge", prizeValue: 20, wonAt: yesterday, isPublished: true, isPinnedHome: true, sortOrder: 1 },
    { giveawayId: g["₹10 UPI cash"], displayName: "Mohd. Arif", town: "Rampur", prizeLabel: "₹10 UPI cash", prizeValue: 10, wonAt: yesterday, isPublished: true },
    { giveawayId: g["1.5 GB data"], displayName: "Deepak Verma", town: "Sitapur", prizeLabel: "1.5 GB data", prizeValue: 19, wonAt: yesterday, isPublished: true },
  ]);

  console.log(`Seeded ${samples.length} giveaways, ${categoryNames.length} categories, 4 sample winners.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
