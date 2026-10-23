import {
  boolean,
  date,
  datetime,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// Calendar dates (start / last date, haazri day) are India dates stored as "YYYY-MM-DD" strings.
// Moments in time are stored in UTC.

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 60 }).notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const TAG_STYLES = ["daily", "weekly", "festival"] as const;
export const GIVEAWAY_STATUSES = ["draft", "live", "ended", "results_out"] as const;
export const TASK_TYPES = ["website", "share", "ad"] as const;

export const giveaways = mysqlTable(
  "giveaways",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 120 }).notNull(),
    subtitle: varchar("subtitle", { length: 200 }).notNull().default(""),
    imageUrl: varchar("image_url", { length: 500 }),
    tileColorFrom: varchar("tile_color_from", { length: 9 }).notNull().default("#FFE7A3"),
    tileColorTo: varchar("tile_color_to", { length: 9 }).notNull().default("#FFB938"),
    categoryId: int("category_id").references(() => categories.id, { onDelete: "restrict" }),
    tagText: varchar("tag_text", { length: 30 }).notNull().default("DAILY"),
    tagStyle: mysqlEnum("tag_style", TAG_STYLES).notNull().default("daily"),
    winnersCount: int("winners_count").notNull().default(1),
    prizeValue: int("prize_value").notNull().default(0),
    haazriDays: int("haazri_days").notNull().default(1),
    startDate: date("start_date", { mode: "string" }).notNull(),
    lastDate: date("last_date", { mode: "string" }).notNull(),
    resultAt: datetime("result_at"),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: int("sort_order").notNull().default(0),
    status: mysqlEnum("status", GIVEAWAY_STATUSES).notNull().default("draft"),
    rulesText: text("rules_text"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => [index("giveaways_live_idx").on(t.status, t.startDate, t.lastDate)],
);

export const giveawayDays = mysqlTable(
  "giveaway_days",
  {
    id: int("id").autoincrement().primaryKey(),
    giveawayId: int("giveaway_id")
      .notNull()
      .references(() => giveaways.id, { onDelete: "cascade" }),
    dayNumber: int("day_number").notNull(),
    taskType: mysqlEnum("task_type", TASK_TYPES).notNull(),
    websiteUrl: varchar("website_url", { length: 500 }),
    minSeconds: int("min_seconds").notNull().default(30),
    shareCount: int("share_count").notNull().default(5),
    shareMessage: varchar("share_message", { length: 500 }),
  },
  (t) => [uniqueIndex("giveaway_day_unique").on(t.giveawayId, t.dayNumber)],
);

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 15 }).notNull().unique(),
  name: varchar("name", { length: 80 }),
  city: varchar("city", { length: 80 }),
  state: varchar("state", { length: 80 }),
  pincode: varchar("pincode", { length: 10 }),
  reminderEnabled: boolean("reminder_enabled").notNull().default(true),
  reminderTime: varchar("reminder_time", { length: 5 }).notNull().default("09:00"),
  isBlocked: boolean("is_blocked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
});

export const sessions = mysqlTable("sessions", {
  token: varchar("token", { length: 64 }).primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at").notNull().defaultNow(),
});

export const progress = mysqlTable(
  "progress",
  {
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    giveawayId: int("giveaway_id")
      .notNull()
      .references(() => giveaways.id, { onDelete: "cascade" }),
    daysCompleted: int("days_completed").notNull().default(0),
    lastDoneOn: date("last_done_on", { mode: "string" }),
    completedAt: timestamp("completed_at"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.giveawayId] }), index("progress_giveaway_idx").on(t.giveawayId, t.daysCompleted)],
);

export const haazriAttempts = mysqlTable(
  "haazri_attempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    giveawayId: int("giveaway_id")
      .notNull()
      .references(() => giveaways.id, { onDelete: "cascade" }),
    dayNumber: int("day_number").notNull(),
    taskType: mysqlEnum("task_type", TASK_TYPES).notNull(),
    dayDate: date("day_date", { mode: "string" }).notNull(),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    verifiedAt: timestamp("verified_at"),
    completedAt: timestamp("completed_at"),
    sharesOpened: int("shares_opened"),
    secondsSpent: int("seconds_spent"),
  },
  (t) => [index("attempt_user_day_idx").on(t.userId, t.giveawayId, t.dayDate)],
);

export const draws = mysqlTable("draws", {
  id: int("id").autoincrement().primaryKey(),
  giveawayId: int("giveaway_id")
    .notNull()
    .references(() => giveaways.id, { onDelete: "restrict" }),
  runAt: timestamp("run_at").notNull().defaultNow(),
  eligibleCount: int("eligible_count").notNull(),
  pickedUserIds: json("picked_user_ids").$type<number[]>().notNull(),
});

export const winners = mysqlTable(
  "winners",
  {
    id: int("id").autoincrement().primaryKey(),
    giveawayId: int("giveaway_id")
      .notNull()
      .references(() => giveaways.id, { onDelete: "restrict" }),
    userId: int("user_id").references(() => users.id, { onDelete: "set null" }),
    drawId: int("draw_id").references(() => draws.id, { onDelete: "set null" }),
    displayName: varchar("display_name", { length: 80 }).notNull(),
    town: varchar("town", { length: 80 }).notNull().default(""),
    photoUrl: varchar("photo_url", { length: 500 }),
    videoUrl: varchar("video_url", { length: 500 }),
    prizeLabel: varchar("prize_label", { length: 120 }).notNull(),
    prizeValue: int("prize_value").notNull().default(0),
    wonAt: timestamp("won_at").notNull().defaultNow(),
    isPublished: boolean("is_published").notNull().default(false),
    isSpotlight: boolean("is_spotlight").notNull().default(false),
    isPinnedHome: boolean("is_pinned_home").notNull().default(false),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("winners_published_idx").on(t.isPublished, t.wonAt), index("winners_user_idx").on(t.userId)],
);

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 60 }).primaryKey(),
  value: text("value").notNull(),
});
