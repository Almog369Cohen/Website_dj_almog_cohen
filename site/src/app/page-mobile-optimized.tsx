"use client";

import Link from "next/link";
import { MediaPlaceholder, MediaCarousel } from "@/components/ui/MediaPlaceholder";

export default function Home() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://www.compaktt.com/#person",
                name: "Almog Cohen",
                alternateName: "DJ Almog Cohen",
                description: "DJ מקצועי לחתונות ואירועים בישראל, מנטור ב-Compakt Academy",
                url: "https://www.compaktt.com",
                sameAs: [
                  "https://www.instagram.com/dj_almog_cohen",
                  "https://www.facebook.com/djalmogcohen",
                ],
              },
              {
                "@type": "ProfessionalService",
                "@id": "https://www.compaktt.com/#service",
                name: "DJ Almog Cohen - DJ לחתונות בישראל",
                description: "DJ מקצועי לחתונות, בר/בת מצווה ואירועים פרטיים. התמחות בחתונות בוטיק ואפטר פארטי טכנו",
                provider: { "@id": "https://www.compaktt.com/#person" },
                areaServed: "Israel",
                priceRange: "$$-$$$",
              },
              {
                "@type": "EducationalOrganization",
                "@id": "https://www.compaktt.com/academy#organization",
                name: "Compakt Academy",
                description: "בית ספר ל-DJ והפקה מוזיקלית",
                url: "https://www.compaktt.com/academy",
                founder: { "@id": "https://www.compaktt.com/#person" },
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-[#1f1f21]">
        {/* ===== HERO SECTION ===== */}
        <section className="section-mobile-loose text-center">
          <h1 className="mobile-h1 mb-4">
            DJ Almog Cohen
          </h1>
          <p className="mobile-body-large mb-2 text-white/90">
            Energy Architect
          </p>
          <p className="mobile-body mb-8 text-white/70">
            DJ לחתונות • אירועים • Compakt Academy
          </p>
          
          {/* Primary CTA */}
          <a
            href={wa("היי אלמוג, רוצים לשמוע עוד על השירותים")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-mobile-primary inline-flex items-center gap-2"
          >
            <span>בואו נדבר</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </section>

        {/* ===== FEATURED IMAGES ===== */}
        <section className="section-mobile">
          <MediaCarousel>
            <MediaPlaceholder 
              type="image"
              aspectRatio="16:9"
              alt="DJ Almog Cohen performing at wedding"
              caption="חתונה באולם אירועים"
            />
            <MediaPlaceholder 
              type="image"
              aspectRatio="16:9"
              alt="Crowd at party"
              caption="מסיבת רחוב"
            />
            <MediaPlaceholder 
              type="image"
              aspectRatio="16:9"
              alt="DJ equipment Pioneer CDJ"
              caption="ציוד מקצועי Pioneer"
            />
          </MediaCarousel>
        </section>

        {/* ===== SERVICES GRID ===== */}
        <section className="section-mobile">
          <h2 className="mobile-h2 section-title text-center">
            מה אני עושה
          </h2>
          
          <div className="section-content">
            {/* Service 1: Weddings */}
            <div className="card-mobile">
              <MediaPlaceholder 
                type="image"
                aspectRatio="16:9"
                alt="Wedding DJ service"
              />
              <h3 className="mobile-h3 mt-4 mb-2">DJ לחתונות</h3>
              <p className="mobile-body mb-4 text-white/80">
                חתונות בוטיק, אפטר פארטי טכנו והאוס. אני בוחר את האירועים בפינצטה כדי לוודא שכל ערב הוא הצגה.
              </p>
              <Link 
                href="/events/weddings-dj"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue"
              >
                <span>קרא עוד</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Service 2: Academy */}
            <div className="card-mobile">
              <MediaPlaceholder 
                type="image"
                aspectRatio="16:9"
                alt="Compakt Academy DJ course"
              />
              <h3 className="mobile-h3 mt-4 mb-2">Compakt Academy</h3>
              <p className="mobile-body mb-4 text-white/80">
                קורס DJ למתחילים, תכנית מנטורינג פרמיום, וחתן מתקלט - אטרקציה מיוחדת לחתונה.
              </p>
              <Link 
                href="/academy"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue"
              >
                <span>גלו את האקדמיה</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Service 3: Chogeg Menagen */}
            <div className="card-mobile">
              <MediaPlaceholder 
                type="image"
                aspectRatio="16:9"
                alt="Chogeg Menagen service"
              />
              <h3 className="mobile-h3 mt-4 mb-2">חוגג מנגן</h3>
              <p className="mobile-body mb-4 text-white/80">
                DJ + מנחה באירוע אחד. לא צריך שני אנשים - אני מטפל בכל האווירה.
              </p>
              <Link 
                href="/chogeg-menagen"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-green"
              >
                <span>פרטים נוספים</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ABOUT / STORY ===== */}
        <section className="section-mobile bg-white/5">
          <h2 className="mobile-h2 section-title text-center">
            הסיפור שלי
          </h2>
          <p className="mobile-body text-white/85 leading-relaxed">
            12 שנים בתחום לימדו אותי דבר אחד: <strong className="text-white">מוזיקה טובה זה הבסיס, אבל חיבור אנושי זה הקסם</strong>. 
            התחלתי כסטודנט למולטימדיה שאהב מוזיקה והפכתי ל-Energy Architect - מישהו שמבין איך לקרוא קהל ולבנות אווירה שמרימה אירועים.
          </p>
          <p className="mobile-body text-white/85 mt-4 leading-relaxed">
            היום אני לא רק DJ. אני גם מנטור ב-<strong className="text-brand-blue">Compakt Academy</strong>, שם אני מעביר את מה שלמדתי 
            למי שרוצה להפוך את האהבה למוזיקה למקצוע אמיתי.
          </p>
        </section>

        {/* ===== TESTIMONIALS (Optional - can be removed if too long) ===== */}
        <section className="section-mobile">
          <h2 className="mobile-h2 section-title text-center">
            מה אומרים עליי
          </h2>
          
          <MediaCarousel>
            {/* Testimonial 1 */}
            <div className="card-mobile">
              <p className="mobile-body text-white/85 mb-4">
                "אלמוג הפך את החתונה שלנו לחוויה בלתי נשכחת. הוא קרא את הקהל בצורה מדויקת ודאג שכולם יהיו על הרגליים כל הערב."
              </p>
              <p className="mobile-caption">
                <strong className="text-white">שרה ויונתן</strong> • חתונה 2024
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="card-mobile">
              <p className="mobile-body text-white/85 mb-4">
                "הקורס של אלמוג שינה לי את החיים. מתחלן מוחלט לדיג'יי שמתקלט באירועים אמיתיים תוך 3 חודשים!"
              </p>
              <p className="mobile-caption">
                <strong className="text-white">דניאל כהן</strong> • בוגר Compakt Academy
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="card-mobile">
              <p className="mobile-body text-white/85 mb-4">
                "חוגג מנגן זה הדבר הכי טוב שעשינו. אלמוג היה גם DJ מעולה וגם מנחה מקצועי. חסכנו כסף וקיבלנו שירות מושלם."
              </p>
              <p className="mobile-caption">
                <strong className="text-white">מיכל ואורי</strong> • בר מצווה 2024
              </p>
            </div>
          </MediaCarousel>
        </section>

        {/* ===== MUSIC / YOUTUBE ===== */}
        <section className="section-mobile">
          <h2 className="mobile-h2 section-title text-center">
            המוזיקה שלי
          </h2>
          
          <div className="section-content">
            <MediaPlaceholder 
              type="video"
              aspectRatio="16:9"
              caption="Set Mix - Wedding Highlights"
            />
            <MediaPlaceholder 
              type="video"
              aspectRatio="16:9"
              caption="After Party Techno Mix"
            />
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/music"
              className="btn-mobile-secondary"
            >
              עוד מוזיקה ביוטיוב
            </Link>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="section-mobile-loose bg-gradient-to-br from-brand-blue/10 to-brand-green/10 text-center">
          <h2 className="mobile-h2 mb-4">
            בואו נדבר על האירוע שלכם
          </h2>
          <p className="mobile-body mb-8 text-white/80">
            חתונה, בר/בת מצווה, אירוע עסקי או סתם מסיבה?<br />
            אני כאן כדי להפוך את זה למשהו מיוחד.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href={wa("היי אלמוג, רוצים לבדוק זמינות לאירוע")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mobile-primary"
            >
              WhatsApp
            </a>
            <a
              href={`tel:+${waNumber}`}
              className="btn-mobile-secondary"
            >
              התקשרו אליי
            </a>
          </div>
        </section>

        {/* ===== QUICK LINKS ===== */}
        <section className="section-mobile-tight border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <Link href="/events/weddings-dj" className="mobile-caption hover:text-brand-blue transition">
              חתונות
            </Link>
            <Link href="/academy" className="mobile-caption hover:text-brand-blue transition">
              Academy
            </Link>
            <Link href="/chogeg-menagen" className="mobile-caption hover:text-brand-green transition">
              חוגג מנגן
            </Link>
            <Link href="/about" className="mobile-caption hover:text-white transition">
              אודות
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
