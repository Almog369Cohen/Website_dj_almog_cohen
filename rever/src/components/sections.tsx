import Link from "next/link";
import { faq } from "@/content/faq";
import { brand, contactCopy, nav, SHOW_TODO } from "@/content/site";
import type { Block, Source } from "@/content/guides";
import type { Crumb } from "@/lib/seo";
import { ContactForm } from "./ContactForm";
import { Faces, InstagramIcon, PhoneIcon, Pic, Todo, WaButton } from "./ui";

/** Questions with a verified answer always; the rest only in the preview, in green. */
export function FaqList({ title = "מה זוגות שואלים אותנו.", headingLevel = 2 }: { title?: string; headingLevel?: 1 | 2 }) {
  const Title = headingLevel === 1 ? "h1" : "h2";
  return (
    <section className="faq wrap" id="faq" data-tone="paper" data-wa="קראתי באתר את השאלות הנפוצות" aria-labelledby="faqTitle">
      <div className="side">
        <div className="kicker">שאלות נפוצות</div>
        <Title id="faqTitle" style={{ margin: 0 }}>{title}</Title>
      </div>
      <div className="list">
        {faq
          .filter((f) => f.answer || SHOW_TODO)
          .map((f, i) => (
            <details name="faq" key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p className="a">
                {f.answer} {f.todo && <Todo>{f.todo}</Todo>}
              </p>
            </details>
          ))}
      </div>
    </section>
  );
}

export function ContactSection({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const Title = headingLevel === 1 ? "h1" : "h2";
  return (
    <section className="contact wrap" id="contact" data-tone="paper" data-hide-fab data-wa="הגעתי לטופס באתר" aria-labelledby="contactTitle">
      <div>
        <div className="kicker">דברו איתנו</div>
        <Title id="contactTitle" style={{ margin: 0 }}>{contactCopy.title}</Title>
        <p className="lead">{contactCopy.lead}</p>
        <div style={{ marginTop: 28 }}>
          <Faces label={<>גל וליאל חוזרים אליכם <Todo>תוך ___</Todo></>} />
        </div>
        <div className="direct" style={{ marginTop: 16 }}>
          <WaButton className="" where="contact">שלחו הודעה לגל וליאל בוואטסאפ</WaButton>
          <div><PhoneIcon /><Todo dir="ltr">{brand.phoneDisplay}</Todo></div>
          <a href={brand.instagram} target="_blank" rel="noopener"><InstagramIcon /><span dir="ltr">{brand.instagramHandle}</span></a>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}

/** The dark closing chapter and footer, on every page. The photo band only opens the home page's closing. */
export function Closing({ photo = false }: { photo?: boolean }) {
  return (
    <footer className="closing" data-tone="dark" data-hide-fab>
      {photo && (
        <div className="photo" data-zoom>
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/contact-bg-1600.webp 1600w, /images/contact-bg-2400.webp 2048w" sizes="100vw" />
            <Pic name="ev-lotus-6" alt="עמדת הלוטוס מבעד לצמחייה" sizes="100vw" />
          </picture>
        </div>
      )}
      <div className="cta wrap">
        <h2>הערב שלכם מתחיל בהודעה אחת.</h2>
        <Faces />
        <WaButton where="closing" />
      </div>
      <div className="foot wrap">
        <nav aria-label="עמודים">
          {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/contact/">צור קשר</Link>
        </nav>
        {SHOW_TODO && <p className="preview-note">תצוגה מקדימה. כל מה שמסומן <Todo>בירוק</Todo> מחכה לפרטים או לאישור מ-REVER.</p>}
        <div>
          {brand.nameHe} | <span lang="en">{brand.fullName}</span> · גל וליאל, המייסדים · <a href={brand.instagram} target="_blank" rel="noopener" dir="ltr">{brand.instagramHandle}</a> <Todo>· אזור שירות</Todo> · <Link href="/privacy/">פרטיות</Link> · <Link href="/accessibility/">הצהרת נגישות</Link>
        </div>
      </div>
      <div className="bigmark" aria-hidden="true"><span lang="en" id="bigmark">REVER</span></div>
    </footer>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="פירורי לחם">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.path}>{i < crumbs.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

/** Inner pages open on a dark chapter: the photo, the breadcrumbs, the question as H1 and the answer first. */
export function PageHero({ title, answer, crumbs, photo, cta = true }: { title: string; answer?: React.ReactNode; crumbs: Crumb[]; photo?: string; cta?: boolean }) {
  return (
    <header className="page-hero" data-tone="dark">
      {photo && <div className="bg"><Pic name={photo} alt="" sizes="100vw" priority /></div>}
      <div className="in wrap">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{title}</h1>
        {answer && <p className="answer">{answer}</p>}
        {cta && <WaButton where="page-hero" />}
      </div>
    </header>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}>{b.text}</p>;
        if (b.type === "todo") return <p key={i}><Todo>{b.text}</Todo></p>;
        if (b.type === "list") {
          const L = b.ordered ? "ol" : "ul";
          return <L key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</L>;
        }
        return (
          <div className="tbl" key={i}>
            <table>
              {b.caption && <caption>{b.caption}</caption>}
              <thead><tr>{b.head.map((h, k) => <th key={k} scope="col">{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

export function Sources({ sources }: { sources: Source[] }) {
  return (
    <section className="sources" aria-labelledby="sourcesTitle">
      <h2 id="sourcesTitle">מקורות</h2>
      <ol>
        {sources.map((s) => (
          <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.title}</a>, {s.publisher}</li>
        ))}
      </ol>
    </section>
  );
}

export function CtaBand({ title = "רוצים לשמוע איך זה ייראה אצלכם?" }: { title?: string }) {
  return (
    <div className="cta-band">
      <h2>{title}</h2>
      <Faces />
      <WaButton where="cta-band" />
    </div>
  );
}
