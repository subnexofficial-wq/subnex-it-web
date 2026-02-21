#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  return {
    apply: flags.has("--apply"),
    force: flags.has("--force"),
  };
}

async function main() {
  const { apply, force } = parseArgs(process.argv);
  const root = process.cwd();

  loadEnvFile(path.join(root, ".env.local"));
  loadEnvFile(path.join(root, ".env"));

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Set it in .env.local or environment.");
  }

  const client = new MongoClient(uri, { maxPoolSize: 10 });
  await client.connect();
  const db = client.db("sub_nex_web");
  const products = db.collection("products");

  try {
    const docs = await products
      .find({}, { projection: { title: 1, slug: 1, createdAt: 1 } })
      .sort({ createdAt: 1, _id: 1 })
      .toArray();

    const used = new Set();
    const planned = [];

    for (const doc of docs) {
      const titleSlug = slugify(doc.title || "");
      const currentSlug = typeof doc.slug === "string" ? doc.slug.trim() : "";
      const currentNormalized = slugify(currentSlug);

      let base =
        force || !currentNormalized
          ? titleSlug || `product-${doc._id.toString().slice(-6)}`
          : currentNormalized;

      if (!base) {
        base = `product-${doc._id.toString().slice(-6)}`;
      }

      let nextSlug = base;
      let i = 2;
      while (used.has(nextSlug)) {
        nextSlug = `${base}-${i}`;
        i += 1;
      }
      used.add(nextSlug);

      if (nextSlug !== currentSlug) {
        planned.push({
          _id: doc._id,
          title: doc.title || "",
          from: currentSlug || "(empty)",
          to: nextSlug,
        });
      }
    }

    console.log(`Products scanned: ${docs.length}`);
    console.log(`Slug updates planned: ${planned.length}`);
    if (planned.length) {
      for (const row of planned.slice(0, 20)) {
        console.log(`- ${row._id}: "${row.from}" -> "${row.to}" [${row.title}]`);
      }
      if (planned.length > 20) {
        console.log(`... and ${planned.length - 20} more`);
      }
    }

    if (!apply) {
      console.log("\nDry run only. Re-run with --apply to write changes.");
      return;
    }

    if (!planned.length) {
      console.log("No changes needed.");
      return;
    }

    const ops = planned.map((row) => ({
      updateOne: {
        filter: { _id: row._id },
        update: { $set: { slug: row.to, updatedAt: new Date() } },
      },
    }));

    const result = await products.bulkWrite(ops, { ordered: false });
    console.log(`Updated documents: ${result.modifiedCount}`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Backfill failed:", err.message);
  process.exit(1);
});
