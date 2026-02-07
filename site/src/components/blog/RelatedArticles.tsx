import Link from "next/link";

interface RelatedArticle {
  slug: string;
  title: string;
  category: string;
}

const articleMap: Record<string, RelatedArticle[]> = {
  "how-to-choose-wedding-dj": [
    { slug: "wedding-dj-cost", title: "כמה עולה DJ לחתונה? מחירון 2025", category: "חתונות" },
    { slug: "dj-or-band-guide", title: "DJ או להקה? המדריך המאוזן", category: "החלטות" },
    { slug: "pro-gear-behind-the-scenes", title: "הציוד המקצועי שמשדרג כל אירוע", category: "ציוד" },
  ],
  "wedding-dj-cost": [
    { slug: "how-to-choose-wedding-dj", title: "איך לבחור DJ לחתונה: 5 שאלות חובה", category: "חתונות" },
    { slug: "dj-or-band-guide", title: "DJ או להקה? המדריך המאוזן", category: "החלטות" },
    { slug: "pro-gear-behind-the-scenes", title: "הציוד המקצועי שמשדרג כל אירוע", category: "ציוד" },
  ],
  "dj-or-band-guide": [
    { slug: "how-to-choose-wedding-dj", title: "איך לבחור DJ לחתונה: 5 שאלות חובה", category: "חתונות" },
    { slug: "wedding-dj-cost", title: "כמה עולה DJ לחתונה? מחירון 2025", category: "חתונות" },
    { slug: "pro-gear-behind-the-scenes", title: "הציוד המקצועי שמשדרג כל אירוע", category: "ציוד" },
  ],
  "dj-course-5-mistakes": [
    { slug: "pro-gear-behind-the-scenes", title: "הציוד המקצועי שמשדרג כל אירוע", category: "ציוד" },
    { slug: "how-to-choose-wedding-dj", title: "איך לבחור DJ לחתונה", category: "חתונות" },
    { slug: "dj-or-band-guide", title: "DJ או להקה? המדריך המאוזן", category: "החלטות" },
  ],
  "pro-gear-behind-the-scenes": [
    { slug: "dj-course-5-mistakes", title: "קורס DJ: 5 טעויות קריטיות", category: "קורס DJ" },
    { slug: "dj-or-band-guide", title: "DJ או להקה? המדריך המאוזן", category: "החלטות" },
    { slug: "wedding-dj-cost", title: "כמה עולה DJ לחתונה?", category: "חתונות" },
  ],
};

export default function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = articleMap[currentSlug];
  if (!related || related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="mb-4 text-lg font-bold text-foreground-heading">מאמרים קשורים</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group rounded-xl border border-border bg-background/50 p-4 transition hover:border-brand-blue/40 hover:bg-background/70"
          >
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-brand-blue">
              {article.category}
            </span>
            <span className="text-sm font-medium text-foreground-heading group-hover:text-brand-blue transition">
              {article.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
