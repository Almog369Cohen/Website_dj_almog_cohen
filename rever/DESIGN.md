# REVER design rules

A light paper magazine with dark chapters. Only REVER's own photos and video: no drawn decorations, no orange, no muddy fades.

## Palette and type

- **Night:** `--night #0b0a0c`. Used for the opening, Gal's half, and the closing.
- **Paper:** `--paper` with ink text.
- **Gold:** one precise gold (`--gold-soft`, `--gold-metal`), for numbers, hairlines and the main button only.
- **Type:** Bellefair for display and numbers, Heebo for text.

## The opening: the night as a journey

- **Stages:** reception → walk to the chuppah → chuppah → entrance to the dancing → after party → the lotus video.
- **The zoom:** each stage holds a window with the next one.
  - The window sits on something real in the photo: the end of the lit avenue, the aisle, the canopy, a guest's phone, the light core.
  - The camera scales into it (`S` = 3, or 4 for the phone).
  - On a phone, the dancing stage first pans from the bride to the phone.
- **Mechanics:** every layer is a full-screen box that is only transformed.
  - The window is the next layer scaled 1/S around the anchor. Its crop is therefore its full-screen crop, and it lands with no jump.
  - Only three layers are visible at a time.
  - The current one darkens to 0.35. The window has a 1px gold hairline that fades as it fills the screen.
- **Caption:** "01 / 05" plus the stage name and one line on what REVER does at that moment.
  - The number rolls like an odometer and the text rises 8px.
  - A five-part gold progress bar.
  - The caption sits above the WhatsApp button, within `100svh`.
- **Conversion:**
  - The floating WhatsApp button appears from the second stage.
  - The message names the stage the couple was looking at.
  - "דלגו על המסע" jumps to the next section.
- **Length:** 70svh per stage on a phone, 85vh on desktop.
- **Desktop:** the portrait lotus clip ends as a tall panel opposite the copy.

## Rules

1. **Contrast (WCAG AA):** text on photos sits on a dark scrim with a text shadow. Unlit text never drops below 3:1.
2. **Smooth on phones:**
   - Animate transforms only; clip-path is used only by the opening window.
   - Phone crops keep image weight low.
   - Later stages load and decode after the page has loaded.
3. **Static fallback:** reduced motion, no script or a short screen turn every scene into a plain layout (`html[data-scenes="off"]`).
4. **Nothing invented:** numbers, quotes, venues and prices come from REVER, or they stay green in the preview.
