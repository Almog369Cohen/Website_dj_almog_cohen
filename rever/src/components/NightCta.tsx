"use client";

import { track } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

/** A call to action at the emotional peak of the page. */
export function NightCta() {
  return (
    <div className="relative mt-12 text-center md:mt-16">
      <a
        href={waLink("היי REVER, ראיתי את הרחבה באתר ואשמח לשמוע על הפקת האירוע שלנו.")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("click_whatsapp", { location: "night" })}
        className="btn-gold inline-flex min-h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 text-[16px] font-medium"
      >
        <WhatsAppIcon className="h-4 w-4" /> רוצים רחבה כזאת? דברו איתנו
      </a>
    </div>
  );
}
