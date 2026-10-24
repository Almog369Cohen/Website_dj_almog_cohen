# REVER design rules

The concept is **lights on**. The page opens in the dark with the lotus video. String lights switch on bulb by bulb, then light spreads across the page. On the dance floor the light dims again into stage beams. It comes back on in golden-hour light for the contact form.

## Light palette (taken from Rever's own photos)

| Scene | Section | Base | Light sources |
| --- | --- | --- | --- |
| night | Opening | `#0b0a0c` | lotus turquoise, gold |
| dawn | About | `#fbf5ec` | candle amber, blush |
| day | Services, gallery | `#f8f1e6` | olive-tree sage, amber, blush |
| party | Dance floor | `#0d0a17` | magenta, turquoise, amber (stage beams) |
| golden | Contact, footer | `#fbf0e3` | sunset orange, peach |

## Rules

1. **60/30/10.** 60% luminous background, 30% photography, 10% accents (gold, light).
2. **Light, not overlays.** Photos are never darkened. They get a soft glow in their own colour and one light sweep when they enter.
3. **Contrast (WCAG AA), checked against the brightest point of each light:**
   - body text: at least 10:1
   - secondary text: at least 5.3:1
   - small gold text: at least 4.5:1
   - large headings: at least 3:1
4. **Two typefaces only:** Frank Ruhl Libre for headings, Heebo for text.
5. **Smooth on phones:** the light layers animate only transform and clip-path. Orb drift is desktop only. With "reduce motion" enabled, everything stops.
6. **No scroll hijacking:** no sticky sections or horizontal carousels. The page scrolls normally and the light changes on its own.
