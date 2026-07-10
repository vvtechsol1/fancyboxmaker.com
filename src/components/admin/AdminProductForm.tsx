"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, X, Loader2 } from "lucide-react";
import { categories, type BoxCategory } from "@/data/taxonomy";
import { COLORWAYS, type Product, type Variant, type Spec, type Colorway } from "@/data/products";

const COLOR_KEYS = Object.keys(COLORWAYS);

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

type Props = {
  initial?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
};

export default function AdminProductForm({ initial, onSaved, onCancel }: Props) {
  const editing = !!initial;
  const [cats, setCats] = useState<BoxCategory[]>(categories);
  useEffect(() => {
    fetch("/api/admin/taxonomy")
      .then((r) => r.json() as Promise<{ ok: boolean; categories?: BoxCategory[] }>)
      .then((d) => { if (d.ok && d.categories?.length) setCats(d.categories); })
      .catch(() => {});
  }, []);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [type, setType] = useState(initial?.type ?? "Corrugated Mailer");
  const [category, setCategory] = useState(initial?.category ?? categories[0].slug);
  const [boxType, setBoxType] = useState(initial?.boxType ?? categories[0].types[0].slug);
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [oldPrice, setOldPrice] = useState(initial?.oldPrice ? String(initial.oldPrice) : "");
  const [taxPercent, setTaxPercent] = useState(initial?.taxPercent ? String(initial.taxPercent) : "");
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [isNew, setIsNew] = useState(initial?.isNew ?? true);
  const [isHot, setIsHot] = useState(initial?.isHot ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [rating, setRating] = useState(String(initial?.rating ?? 5));
  const [reviews, setReviews] = useState(String(initial?.reviews ?? 0));
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [descriptionHtml, setDescriptionHtml] = useState(initial?.descriptionHtml ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [video, setVideo] = useState(initial?.video ?? "");
  const [colorKeys, setColorKeys] = useState<string[]>(() => {
    if (initial?.colors?.length) {
      return COLOR_KEYS.filter((k) => initial.colors.some((c) => c.name === COLORWAYS[k].name));
    }
    return ["black"];
  });
  const [variants, setVariants] = useState<Variant[]>(initial?.variants ?? []);
  const [specs, setSpecs] = useState<Spec[]>(initial?.specifications ?? []);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const typeOptions = useMemo(() => cats.find((c) => c.slug === category)?.types ?? [], [category, cats]);
  const effSlug = slugTouched ? slug : slugify(name || "");

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) urls.push(data.url);
    }
    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const c = cats.find((x) => x.slug === category);
    const bt = typeOptions.find((x) => x.slug === boxType) ?? typeOptions[0];
    if (!name || !price || !c || !bt) {
      setError("Please fill name, price, category and box type.");
      return;
    }
    const colors: Colorway[] = (colorKeys.length ? colorKeys : ["kraft"]).map((k) => COLORWAYS[k]);
    const product: Product = {
      slug: effSlug || slugify(name),
      name,
      type,
      category: c.slug,
      categoryName: c.name,
      boxType: bt.slug,
      boxTypeName: bt.name,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      taxPercent: taxPercent ? Number(taxPercent) : undefined,
      colorway: colors[0],
      colors,
      images: images.length ? images : undefined,
      video: video || undefined,
      variants: variants.length ? variants : undefined,
      specifications: specs.length ? specs : undefined,
      rating: Number(rating) || 5,
      reviews: Number(reviews) || 0,
      inStock,
      isNew,
      isHot,
      featured,
      shortDescription,
      descriptionHtml,
    };

    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { slug: initial!.slug, product } : product),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) onSaved();
    else setError(data.error || "Failed to save");
  }

  const field = "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft";
  const card = "rounded-2xl border border-line bg-white p-5";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Basics</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={label}>Product title *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Custom Kraft Mailer Box" />
          </div>
          <div>
            <label className={label}>URL slug</label>
            <input value={effSlug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className={field} placeholder="auto-generated" />
          </div>
          <div>
            <label className={label}>Style / material label</label>
            <input value={type} onChange={(e) => setType(e.target.value)} className={field} placeholder="Corrugated Mailer" />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Category</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Category *</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value); const c = cats.find((x) => x.slug === e.target.value); if (c) setBoxType(c.types[0].slug); }} className={field}>
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Box type *</label>
            <select value={boxType} onChange={(e) => setBoxType(e.target.value)} className={field}>
              {typeOptions.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Pricing</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={label}>Price (USD) *</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={field} placeholder="89" />
          </div>
          <div>
            <label className={label}>Old / compare-at price</label>
            <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className={field} placeholder="1170" />
          </div>
          <div>
            <label className={label}>Tax %</label>
            <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className={field} placeholder="0" />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Media</h3>
        <label className={label}>Images</label>
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={src} className="relative h-24 w-24 overflow-hidden rounded-lg border border-line">
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              <button type="button" onClick={() => setImages(images.filter((_, x) => x !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white">
                <X size={13} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()} className="grid h-24 w-24 place-items-center rounded-lg border-2 border-dashed border-line text-ink-soft hover:border-brand hover:text-brand">
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
        </div>
        <div className="mt-4">
          <label className={label}>Video URL (mp4 or YouTube embed)</label>
          <input value={video} onChange={(e) => setVideo(e.target.value)} className={field} placeholder="/uploads/demo.mp4 or https://youtube.com/embed/..." />
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Colours</h3>
        <div className="flex flex-wrap gap-2">
          {COLOR_KEYS.map((k) => {
            const c = COLORWAYS[k];
            const on = colorKeys.includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => setColorKeys(on ? colorKeys.filter((x) => x !== k) : [...colorKeys, k])}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${on ? "border-brand bg-brand-soft text-brand" : "border-line text-ink hover:border-brand"}`}
              >
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }} />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className={card}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-ink">Variations</h3>
          <button type="button" onClick={() => setVariants([...variants, { label: "", inStock: true }])} className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
            <Plus size={15} /> Add variation
          </button>
        </div>
        {variants.length === 0 && <p className="text-sm text-ink-soft">No variations. (Optional — e.g. sizes or bundles with their own price.)</p>}
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_100px_auto_auto] items-center gap-2">
              <input value={v.label} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className={field} placeholder="Variation name" />
              <input type="number" value={v.price ?? ""} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, price: e.target.value ? Number(e.target.value) : undefined } : x))} className={field} placeholder="Price" />
              <input type="number" value={v.oldPrice ?? ""} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, oldPrice: e.target.value ? Number(e.target.value) : undefined } : x))} className={field} placeholder="Old" />
              <label className="flex items-center gap-1 text-xs text-ink-soft"><input type="checkbox" checked={v.inStock} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, inStock: e.target.checked } : x))} /> Stock</label>
              <button type="button" onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="text-ink-soft hover:text-brand"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-ink">Specifications</h3>
          <button type="button" onClick={() => setSpecs([...specs, { label: "", value: "" }])} className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
            <Plus size={15} /> Add spec
          </button>
        </div>
        {specs.length === 0 && <p className="text-sm text-ink-soft">No specifications yet.</p>}
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              <input value={s.label} onChange={(e) => setSpecs(specs.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className={field} placeholder="Material" />
              <input value={s.value} onChange={(e) => setSpecs(specs.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className={field} placeholder="Silicone + microfibre" />
              <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="text-ink-soft hover:text-brand"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Description</h3>
        <label className={label}>Short description</label>
        <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className={`${field} h-auto py-2`} placeholder="One-line summary shown on cards & top of page." />
        <label className={`${label} mt-4`}>Full description (HTML allowed)</label>
        <textarea value={descriptionHtml} onChange={(e) => setDescriptionHtml(e.target.value)} rows={6} className={`${field} h-auto py-2 font-mono text-xs`} placeholder="<p>...</p> <ul><li>...</li></ul>" />
      </div>

      <div className={card}>
        <h3 className="mb-4 font-bold text-ink">Status &amp; ratings</h3>
        <div className="flex flex-wrap gap-4">
          {[["In stock", inStock, setInStock], ["New", isNew, setIsNew], ["Hot", isHot, setIsHot], ["Featured", featured, setFeatured]].map(([lab, val, set]) => (
            <label key={lab as string} className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={val as boolean} onChange={(e) => (set as (b: boolean) => void)(e.target.checked)} /> {lab as string}
            </label>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><label className={label}>Rating (0–5)</label><input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} className={field} /></div>
          <div><label className={label}>Reviews count</label><input type="number" value={reviews} onChange={(e) => setReviews(e.target.value)} className={field} /></div>
        </div>
      </div>

      {error && <p className="rounded-lg bg-brand-soft px-4 py-2 text-sm font-medium text-brand">{error}</p>}

      <div className="sticky bottom-0 flex gap-3 border-t border-line bg-white/95 py-4 backdrop-blur">
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
          {saving && <Loader2 size={16} className="animate-spin" />}
          {editing ? "Save changes" : "Add product"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface">Cancel</button>
      </div>
    </form>
  );
}
