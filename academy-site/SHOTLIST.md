# Shot list: the opening motion ("מאפס לעמדה")

The opening is told from the student's eyes. **Hands and POV only, no faces, no logos.**
The motion lab (three prototypes, picks and reference images):
https://claude.ai/artifact/NGKJeiZCkebMDcwMvDyiMR

## How many
- 8 shots, each in portrait (9:16) and landscape (16:9), plus 2 texture close-ups (cables, LEDs) = **18 frames**.
- About two hours in the lesson studio; shot 8 at a real event.
- One helper holds the camera; the student/teacher is only the hands.

## The rule
The hand always enters from the bottom and the fingertip touches the same spot in every frame:
the middle of the width, a little below the centre. This is what lets motion A swap the world
under a hand that stays put.

## The 8 stations

| # | Station | What we see | Hand | Camera | Light |
|---|---------|-------------|------|--------|-------|
| 1 | Shoes | Looking straight down at sneakers on the studio floor, cables, desk edge at the top | none | chest height, looking down, wide | a round floor light in front of the shoes (the circle) |
| 2 | Desk | The gear on the desk, still off: controller, headphones, closed laptop | none | standing at the desk, angled from above | soft side window light |
| 3 | Power | A finger presses POWER and the LEDs come on | from below, fingertip on the fixed spot | close, at gear height | dark, only the gear LEDs |
| 4 | Headphones | A hand lifts headphones, one big ear cup facing the camera | from below, holding the cup | 50mm, blurred background | warm side light |
| 5 | Jog | Palm on the jog wheel, the centre display lit | on the jog, fingertips on the fixed spot | straight down | gear LEDs |
| 6 | Fader | A finger pushes a fader mid-transition, level meters lit | on the fader, on the fixed spot | close, shallow depth | coloured side light |
| 7 | EQ | Thumb and finger turn an EQ knob | on the knob, on the fixed spot | macro | meters glowing behind |
| 8 | Crowd | A hand raised to the crowd from behind the booth | raised, centre of the frame | DJ eye level behind the booth, wide | stage lights and haze, real event |

## Day-of kit
Camera or a good phone (RAW if possible) · chest harness or a tripod with an arm over the desk ·
dark sleeve with no logo, same outfit all day · one round LED for the floor (station 1) ·
controller, headphones and laptop free of stickers and logos.

## Swapping photos into the site
When the motion is picked, the matching engine takes the photos:
- Option C (dive into circles): add each photo and its circle to `tools/zoom-scenes.json`, run
  `python3 tools/zoom-crops.py`, fine-tune with `#portal`. The engine caps zoom at ×3.
- Options A and B use the same crops; the fixed fingertip spot replaces the circle.
