import Link from "next/link";
import { PHOTO_SIZES } from "@/content/photos";
import journeyCrops from "@/content/journey-crops.json";
import { about, brand, difference, eventTypes, founders, hero, includes, journey, journeyAlt, steps } from "@/content/site";
import { coverSizes, Faces, Pic, srcSetFor, Todo, WaButton } from "./ui";

const PHONE = "(max-aspect-ratio: 3/4)";
const crops: Record<string, number[]> = journeyCrops;

/** One stage of the journey: a full-screen photo, with a lighter crop for portrait phones. Loaded by the Engine. */
function JourneyPhoto({ name, first }: { name: string; first: boolean }) {
  const crop = crops[name];
  const [w, h] = PHOTO_SIZES[name] ?? [1600, 1067];
  const phone = crop && [640, 960].map((x) => `/images/${name}-m-${x}.webp ${x}w`).join(", ");
  const phoneSizes = crop && `calc(100svh * ${((w * (crop[1] - crop[0])) / h).toFixed(3)})`;
  const { srcSet } = srcSetFor(name);
  const lazy = !first;
  return (
    <picture>
      {/* the first stage paints from the light 640 crop and is upgraded after the page has loaded */}
      {crop && <source media={PHONE} srcSet={lazy ? undefined : `/images/${name}-m-640.webp`} data-srcset={phone} data-sizes={phoneSizes} />}
      <img
        src={lazy ? undefined : `/images/${name}-1080.webp`}
        srcSet={lazy ? undefined : srcSet}
        sizes={lazy ? undefined : coverSizes(name)}
        data-srcset={lazy ? srcSet : undefined}
        data-sizes={lazy ? coverSizes(name) : undefined}
        width={w}
        height={h}
        alt=""
        loading="eager"
        fetchPriority={first ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

/** The files the first stage paints with, for the preload in the page head (it must match what the browser picks). */
export function journeyPreload() {
  const name = journey[0].photo, crop = crops[name];
  return {
    phone: crop ? `/images/${name}-m-640.webp` : null,
    wide: { srcSet: srcSetFor(name).srcSet, sizes: coverSizes(name) },
    href: `/images/${name}-1080.webp`,
  };
}

/**
 * 1. The opening: the night as a journey. The first photo sits in a window between REVER and "הפקות" and
 * opens to full screen; then every photo holds a window with the next stage of the night, and the scroll
 * zooms into it (Engine: heroUpdate / journeyUpdate). It ends on the lotus video and the copy.
 */
export function Hero() {
  const n = journey.length;
  return (
    <section className="hero" id="top" data-tone="hero" data-wa="" style={{ ["--stages" as string]: n }}>
      <div className="hero-stage">
        <div className="hero-inner" id="heroInner">
          <div className="hero-media" id="heroMedia">
            {journey.map((s, i) => {
              const crop = crops[s.photo];
              const [w, h] = PHOTO_SIZES[s.photo] ?? [1600, 1067];
              return (
                <div className="jl" key={s.id} data-i={i} data-w={w} data-h={h} data-crop={crop?.join(",")} data-at={s.at.join(",")} data-pos={s.pos.join(",")} data-pan={s.pan?.join(",")} data-desk={(s.desk ?? [0.5, 0.5]).join(",")} data-s={s.S}>
                  <JourneyPhoto name={s.photo} first={i === 0} />
                </div>
              );
            })}
            <div className="jl jl-video" data-i={n} data-w={720} data-h={1280} data-desk="0.5,0.5" data-pos="0.6,0.5">
              {/* the sources are attached after the page loads (see Engine) */}
              <video id="heroVideo" muted loop playsInline preload="none" data-poster="/images/hero-poster-640.webp" data-webm="/video/hero-m.webm" data-mp4="/video/hero-m.mp4" data-webm-wide="/video/hero.webm" data-mp4-wide="/video/hero.mp4" aria-label="עמדת ה־DJ בצורת לוטוס עם תותחי עשן, בחתונת גן" />
            </div>
            <div className="hero-shade" id="heroShade" />
          </div>
          <div className="masthead" aria-hidden="true">
            <span className="mw mw1" lang="en"><span>REVER</span></span>
            <span className="slot" id="slot" />
            <span className="mw mw2"><span>הפקות</span></span>
          </div>
          <div className="jcap" id="jcap" aria-hidden="true">
            <span className="jbrand">ריבר הפקות · ליווי מלא עד סוף הערב</span>
            <p className="jstage">
              <span className="jnum en" lang="en"><span id="jnum">01</span></span>
              <span className="jof en" lang="en">/ {String(n).padStart(2, "0")}</span>
              <b id="jname">{journey[0].label}</b>
            </p>
            <p className="jline" id="jline">{journey[0].line}</p>
            <div className="jbar">{journey.map((s) => <i key={s.id}><b /></i>)}</div>
          </div>
          <a className="jskip" id="jskip" href="#difference">דלגו על המסע</a>
          <div className="hero-rest" id="heroRest">
            <h1>{hero.h1}</h1>
            <div className="cue" aria-hidden="true">גללו<i /></div>
          </div>
          <div className="hero-copy" id="heroCopy">
            <span className="small en" lang="en">REVER PRODUCTIONS</span>
            <p className="display">{hero.displayTop}<span>{hero.displayBottom}</span></p>
            <p className="tagline">{hero.tagline}</p>
            <div className="row">
              <WaButton where="hero" />
              <a className="link-quiet" href="#events">לרגעים שהפקנו</a>
            </div>
            <Faces href="#founders" />
          </div>
        </div>
        <button className="pause" id="pause" type="button" aria-pressed="false" aria-label="עצירת הסרטון">
          <svg className="bars" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" /></svg>
          <svg className="play" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" /></svg>
        </button>
        <div className="hero-dim" id="heroDim" />
      </div>
      {/* The same journey as a plain list: read by screen readers, and shown instead of the zoom when motion is off */}
      <ol className="jstatic" aria-label="הערב שלכם, שלב אחר שלב">
        {journey.map((s, i) => (
          <li key={s.id}>
            <figure>
              <Pic name={s.photo} alt={journeyAlt[s.photo] ?? ""} sizes="(min-width: 1024px) 60vw, 100vw" />
              <figcaption><span className="en" lang="en">{String(i + 1).padStart(2, "0")}</span> <b>{s.label}.</b> {s.line}</figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 2–4. The paper chapter: the difference, the wipe, the founders and the event types. */
export function PaperChapter() {
  const words = difference.tasks.split(/\s+/);
  return (
    <div className="chapter-paper" data-tone="paper">
      <section className="manifesto wrap" id="difference" data-wa="קראתי באתר על ההבדל" aria-label="ההבדל">
        <div className="kicker">ההבדל</div>
        <p className="says" id="says">
          {words.map((w, i) => (
            <span key={i}><span className="w">{w}</span>{i < words.length - 1 ? " " : ""}</span>
          ))}
        </p>
        <p className="says-after">{difference.after}</p>
      </section>

      <section className="wipe" id="wipe" data-wa="ראיתי באתר איך זה עובד ביום עצמו" aria-label="אצלנו ואצלכם">
        <div className="wipe-stage">
          <Pic id="wipeUnder" className="under" name="team-day" alt="ארד מצוות REVER, עם תג צוות, ליד הזוג ביום החתונה בגן" />
          <div className="wipe-cap one" id="capOne"><b>{difference.ours.title}</b><span>{difference.ours.text}</span></div>
          <Pic id="wipeOver" className="over" name="ev-nye-5" alt="הזוג רוקד בין ניצוצות על הרחבה" />
          <div className="wipe-cap two" id="capTwo"><b>{difference.yours.title}</b><span>{difference.yours.text}</span></div>
          <div className="wipe-shade" />
        </div>
      </section>

      <section className="nope wrap" aria-label="מה לא צריך">
        <ul>{difference.noNeed.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>

      <Founders />

      <div className="marquee" aria-hidden="true">
        <div className="track" id="marquee">
          {[0, 1].map((k) => (
            <div className="item" key={k}>
              {eventTypes.map((t, i) => (
                <span key={t} style={{ display: "contents" }}>
                  <span className={i % 2 ? "g" : undefined}>{t}</span><i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Gal in black on the night half, Liel in white on the paper half. */
export function Founders({ intro = true }: { intro?: boolean }) {
  return (
    <section id="founders" data-wa="קראתי עליכם באתר" aria-labelledby="foundersTitle">
      {intro && (
        <div className="founders-intro wrap">
          <div className="kicker">המייסדים</div>
          <h2 id="foundersTitle">האנשים שעונים לכם.</h2>
          <p className="lead">גל וליאל הקימו את REVER, והם אלה שעונים לכם בוואטסאפ.</p>
        </div>
      )}
      <div className="founders">
        {founders.map((f) => (
          <article key={f.id} className={`f-half ${f.id === "gal" ? "f-gal" : "f-liel"}`} data-tone={f.id === "gal" ? "dark" : "paper"}>
            <div className="f-photo" data-reveal>
              <Pic name={f.photo} alt={f.alt} sizes="(min-width: 1024px) 28vw, 78vw" />
            </div>
            <p className="f-name" data-rise id={intro ? undefined : f.id}>{f.name}</p>
            <span className="f-role">{f.role}</span>
            <p className="f-line"><Todo>משפט אישי של {f.name}: למה הוא עושה את זה</Todo></p>
          </article>
        ))}
      </div>
      {intro && (
        <div className="founders-cta wrap">
          <WaButton where="founders" />
          <Link className="link-quiet" href="/about/">עוד על גל וליאל</Link>
        </div>
      )}
    </section>
  );
}

/** 6. How it works: REVER's four steps, with the photo changing beside them on desktop. */
export function How() {
  return (
    <section className="how wrap" id="how" data-tone="paper" data-wa="קראתי באתר איך זה עובד" aria-labelledby="howTitle">
      <div className="kicker">איך זה עובד</div>
      <h2 id="howTitle">מהפגישה הראשונה ועד השיר האחרון.</h2>
      <p className="lead">אנחנו מנהלים עבורכם את כל התהליך, כדי שתוכלו להיות רגועים ופנויים ליהנות מהדרך ומהאירוע עצמו.</p>
      <div className="how-grid">
        <div className="steps">
          {steps.map((s) => (
            <article className="step" key={s.id}>
              <figure className="reveal" data-reveal><Pic name={s.photo} alt={s.alt} sizes="90vw" /></figure>
              <span className="label">{s.label}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <dl className="rows">
                <div><dt>על השולחן שלכם</dt><dd>{s.yours}</dd></div>
                <div><dt>אצלנו</dt><dd>{s.ours}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <div className="how-frame" id="howFrame" aria-hidden="true">
          {steps.map((s, i) => <Pic key={s.id} name={s.photo} alt="" className={i === 0 ? "on" : undefined} sizes="50vw" />)}
          <span className="how-cap" id="howCap">{steps[0].label}</span>
        </div>
      </div>
      <div className="includes">
        <div className="kicker">מה כולל הליווי</div>
        <ul>{includes.map((i) => <li key={i}>{i}</li>)}</ul>
        <p><Todo>לאשר: אנחנו לא האולם ולא הקייטרינג. אנחנו מחברים את כל הספקים ומנהלים אותם בשבילכם.</Todo></p>
        <WaButton className="link-quiet" where="how">רוצים לשמוע איך זה ייראה אצלכם?</WaButton>
      </div>
    </section>
  );
}

/** 7. The team: who REVER is, the one verified number, and the team with the couple at the end of the night. */
export function Team() {
  return (
    <section className="team" id="team" data-tone="paper" data-wa="ראיתי באתר את הצוות" aria-labelledby="teamTitle">
      <div className="wrap">
        <div className="kicker">הצוות</div>
        <h2 id="teamTitle">האנשים שמאחורי הערב.</h2>
        {about.map((p) => <p className="lead" key={p}>{p}</p>)}
        <p className="lead">גל וליאל מובילים, ואיתם צוות שעובד בשטח ביום האירוע, כמו ארד שראיתם למעלה.</p>
        <div className="stats">
          <div className="stat"><b className="en">{brand.years}</b><span>שנים של הפקות</span></div>
          <Todo><span className="stat"><b>?</b><span>אירועים שהפקנו</span></span></Todo>
          <Todo><span className="stat"><b>?</b><span>מי בשטח ביום האירוע</span></span></Todo>
        </div>
      </div>
      <div className="band" data-par>
        <Pic name="team-group" alt="צוות REVER עם הזוג בסוף הערב" />
        <span className="band-cap">בסוף הערב, עם הזוג</span>
      </div>
    </section>
  );
}

/** 8. From the field: a couple's words and one real day. Only in the preview until REVER sends them. */
export function FromField() {
  return (
    <section className="field" data-tone="paper" aria-label="מהשטח">
      <div className="wrap">
        <div className="kicker">מהשטח</div>
        <div className="quote-mark" aria-hidden="true">”</div>
        <p className="quote"><Todo>ציטוט אמיתי של זוג, באישורו</Todo></p>
        <p style={{ marginTop: 14, color: "var(--ink-2)" }}><Todo>שם, מקום וחודש</Todo></p>
        <dl className="beats">
          <div><dt>מה השתנה</dt><dd><Todo>ברגע האחרון: הושבה, ספק שמאחר</Todo></dd></div>
          <div><dt>מה הצוות עשה</dt><dd><Todo>בזמן אמת, בלי שהזוג ידע</Todo></dd></div>
          <div><dt>איך זה נגמר</dt><dd><Todo>מה הזוג ראה בסוף</Todo></dd></div>
        </dl>
      </div>
    </section>
  );
}
