import Link from "next/link";
import { Closing, PageHero } from "@/components/sections";

export default function NotFound() {
  return (
    <>
      <main id="main" data-wa="">
        <PageHero title="העמוד הזה לא נמצא" answer="אולי הקישור השתנה. אפשר לחזור לעמוד הבית, או לכתוב לגל וליאל ישירות." crumbs={[{ name: "בית", path: "/" }]} />
        <div className="page-body wrap"><Link className="link-quiet" href="/">לעמוד הבית</Link></div>
      </main>
      <Closing />
    </>
  );
}
