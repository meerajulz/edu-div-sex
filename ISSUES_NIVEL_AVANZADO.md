# Nivel Avanzado: client feedback, analysed

Working plan for the client's feedback list (all reported on the **Nivel Avanzado**).
Every point was checked against the code on `main` (2026-11-04).
The feedback itself is from **around July 2026**. Work done after that (videos for A2 scene 5, A3 final scene, A4 scene 3, círculo game) means **some points may already be fixed**. Those are marked "re-test".

## Status (2026-11-04, on `main`, builds OK, **not yet committed**)

**✅ Done**
- 0.1 Next.js 15.1.12 upgrade
- G1 advanced aventuras unlock in order (Aventura N opens when N-1 is completed)
- G3/G4 congratulation messages (no "sección completada" mid-chain in A1/A4; "¡Muy bien! Vuelve al mapa…" for non-last items; "¡Has completado la aventura!" → home at the end of every aventura)
- G5 wrong answer → "Intentar de nuevo ↺" repeats the same situation (A5 J1 [must pick INDIFERENCIA], A5 J2, A6 J3, A6 J4, A7 asertividad)
- G6 full-screen game windows (A6 J1/J2 with bigger pictures; A7 J2/J3 window only; A7 J4 with bigger pictures)
- A1.3/A1.4/A1.6/A1.7 Aventura 1 order: intro → boys' changes → erección + game → **girls' changes explanation** → Clara game → higiene + game → menstruation → compresa game → map. Repeated Clara and erección games removed
- A1.9 compresa steps must go in order (basic + advanced)
- A1.10 concurso images (folder names fixed; all 21 images load)
- A2.1 Aventura 2 videos in the right order (scene1 ← ESCENA-2, scene2 ← ESCENA-3, scene3 ← ESCENA-1, verified from frames; basic fixed too)
- A2.7 círculo game shows Noa's drawing instead of 🧒
- A2.8 círculo drag & drop fixed (coordinate bug: drops never registered on scrolled pages)
- A3.1/A3.2/A3.3 extra Aventura 3 cartel removed; "El orgasmo femenino" cartel plays its own audio; after the male game → back to map
- A3.4 masturbación game in Aventura 3 plays both versions (Cris, then Dani); basic still picks by sex
- A4.1/A4.2 "¿Qué cara pondrá…?" added to Aventura 4 after the tone-of-voice game (no congrats in between)
- A6.1/A6.3 Aventura 6 answer keys: feedback audios un-crossed in J1 and J2; J1 situation 4 (each with their own friends, both happy) is now "yes"
- A8.2/A8.3 old title words ("Victimización", "Abusador") cut from the start of the game intro audio (trimmed copies `t-sin-titulo.mp3`; originals kept), basic + advanced

**🚫 Dropped (no material coming from the client)**
- G2 new icon A5/A6 · G7/A5.2/A5.3 re-recorded voices · G8/A1.8/A2.3 new vulva images · A2.4 duplicate image · A2.5/A6.6/A7.6/A8.4 new videos · A1.1 boys' changes game (needs a teen-boy body drawing + parts; only a child body exists) · A7.4/A7.5/A7.7 audio parts · A8.6 closing voice

**⏳ Still open**
- 0.2 video "faststart" re-save (waiting for OK)
- A1.5 Clara circles misplaced + too strict (shared game, waiting for OK)
- A1.11 concurso hint, A6.2 "CORRECTO/INCORRECTO" said inside the audio (can't change without new audio), A6.4 SÍ/NO buttons, A7.1 titles (need details), A7.8 game 4 rebuild, A8.6 closing text (text-only possible)

### Legend

| Tag | Meaning |
|---|---|
| 🟢 **AV** | Fix touches only advanced (`aventura-*`) code, safe to do |
| 🟠 **SHARED** | Fix changes a basic `actividad-*` scene, game, video or audio that the basic level also uses. **Needs your OK first** |
| 🔵 **ASSET** | Needs new material from the client (video, audio/voice, image) |
| ❓ **QUESTION** | I need an answer before fixing |

Effort: **S** < 1 h · **M** 1–3 h · **L** > 3 h

---

## 0. Read this first: two things block everything else

### 0.1 The feedback is older than the current code (re-test) ✅ upgrade done
The list was written around July; these reports no longer match the code:
- Aventura 2 scene 5 *"NO ESTÁ EL VÍDEO"*: the code plays `/video/avanzado/Actividad_2_scene_5.mp4`, and the file exists.
- Aventura 4 scene 3 *"pone que estará próximamente"*: there is no "Próximamente" text anywhere in the code. The video `Actividad_4_scene_3.mp4` has been wired since 24 Aug.

**Likely reason:** Vercel now blocks deploys of Next.js 15.1.4 (same block we hit on the demo). If `main` hasn't been deployed since that block, production is stuck on an older build.
→ ✅ **Done:** Next.js upgraded to 15.1.12 on `main` (same as the demo). After pushing, confirm in Vercel that production shows the latest `main` commit, then ask the client to re-test.

### 0.2 "Se queda colgada / parada": the videos are not web-optimised 🟠 (M)
Reported in A1 scenes 1, 5, 6, 7; A6 scenes 3, 4; A7 scenes 1, 4; A8 scenes 1, 2; and "va muy lento" in A5.
**Cause found:** **44 of 46 videos** store their index (the "moov atom") at the **end** of the file. A tablet must download the whole video (2–13 MB) before it can start or seek, so on school Wi-Fi it looks frozen.
**Fix:** re-pack every video with `ffmpeg -movflags +faststart`. This is **lossless**: same image, same sound, only the internal order changes. ffmpeg is already installed on this Mac.
**Why SHARED:** basic scenes use the same files, so they will start faster too. No visible change otherwise.

---

## 1. General (whole Nivel Avanzado)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| G1 | You can open any aventura without finishing the previous one | `OrbitalCarousel/utils.ts` unlocks all 8 aventuras for supervision level ≥ 2. Fix: sequential unlock like basic, using the existing completion rules for ids 11–18 | 🟢 AV | M |
| G2 | Aventura 5 and 6 have the same icon | Both use `activity6.svg` (`menuLevelConfig.ts`). You decided earlier this was OK; the client now disagrees | 🔵 ASSET (new icon for A5 or A6) | S |
| G3 | No clear "you finished the aventura, go to the main menu" message (A3, A4, A5) | ✅ **Done.** The last item of every aventura (A1 juego4, A3 scene5, A4 scene3, A5 scene2, A6 scene4, A7 scene4, A8 scene6) now says "¡Felicidades! ¡Has completado la aventura! Vuelve al inicio para elegir la siguiente." → button "Volver al inicio" → home | 🟢 AV | done |
| G4 | "¡Felicidades! Has completado esta sección" appears when there are still games left (A1, A5) | ✅ **Done.** (a) A1: after the erección game, the chain now continues directly (no overlay) when more content follows (`actividad-1/scene6`, basic unchanged). (b) A5–A8 items that aren't the last now say "¡Muy bien! Vuelve al mapa para seguir con la siguiente parte de la aventura" → "Volver al mapa". Still basic wording: the reused basic scenes in A2/A3/A4 ("Has completado esta sección de la actividad") | 🟢 AV + 🟠 (A1 scene6) | done |
| G5 | Games let you move on after a wrong answer (A5 J1/J2, A6 J3/J4, A7 asertividad; A8 J6 optional) | Each game just goes to the next situation. Fix: on a wrong answer, play feedback and stay on the same situation | 🟢 AV (all are advanced-only games) | M |
| G6 | Game boxes look too small, should be full screen (A6 J1/J2, A7 preservativo, A7 J4) | Modal size in each game | 🟢 AV | S–M |
| G7 | Computer/AI voice: hard to understand, words cut off (A2 J4, A5 J1, A8 titles) | Recorded audio files | 🔵 ASSET (re-record) | n/a |
| G8 | New vulva image by Sara needed (A1 scenes 1 and 4, A1 games, A2 J2) | Image files | 🔵 ASSET + 🟠 SHARED (the images are in basic games) | S once received |

---

## 2. Aventura 1: Descubriendo mi sexualidad (reuses basic actividad-1 and actividad-4)

**How it runs today** (one automatic chain of basic scenes):

```
Cartel 1  → actividad-1/scene2 (video ¿Qué ha cambiado?) → actividad-1/scene5 (video)
          → actividad-1/scene6 (video erección + game "señala el pene en erección")
          → actividad-1/scene4 (video skipped) + game "cambios de las niñas" (Clara)
Cartel 3  → actividad-4/scene1 (higiene video + game) → Clara game AGAIN ✗
          → actividad-4/scene2 (menstruación video + compresa game) → erección game AGAIN ✗ → menu
Cartel 4  → actividad-1/scene7 (video) → juego4 (concurso)
```

This explains most of the client's notes. The order fixes live in the **aventura-1 wrapper pages** (🟢 AV); the basic scenes themselves don't change.

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A1.1 | Missing "boys' changes" game before the erección game. Client: *"aparece el juego de 'señala el pene en erección', pero antes debería estar el juego de los cambios de los chicos"* | **This game does not exist** in the app (only a girls' one, Clara) | ❓ + 🔵 ASSET (new game: images and audio) | L |
| A1.2 | "Has completado esta sección" + "volver al mapa" between a scene and its game | ✅ Done, see G4 | 🟠 SHARED | done |
| A1.3 | Girls' changes explanation must come **before** the Clara game | The chain skips that video (`aventura-1-skip-video`). Fix: play it | 🟢 AV | S |
| A1.4 | Clara game shown again after higiene: remove | Remove from the chain | 🟢 AV | S |
| A1.5 | Clara game: circles misplaced (armpit on chin, vulva on leg); too strict | Positions and hit areas in `actividad-1/scene4/JuegoDos/config.ts` | 🟠 SHARED (same game in basic: basic is probably wrong too) | M |
| A1.6 | Erección game shown again after compresa game: remove | Remove from the chain | 🟢 AV | S |
| A1.7 | Should continue automatically, except before "El cuerpo de los mayores" | Adjust the chain so it returns to the map only before cartel 4 | 🟢 AV | M |
| A1.8 | Higiene game: show clean vulva after washing, drying, clean clothes | Needs new step images | 🔵 ASSET + 🟠 SHARED (`actividad-4/scene1` game) | M |
| A1.9 | **Basic bug:** compresa steps game lets you place step 5 before steps 1–4 | ✅ **Done.** Only the next empty slot accepts a picture; dropping a later step counts as incorrect (plays "incorrect" feedback). `JuegoDosActividad4/DragDropArea.tsx`, so it applies to basic and advanced | 🟠 SHARED (approved) | done |
| A1.10 | Concurso (juego4): **no images** | **Cause found:** image folders are named `pregunta1 3`, `pregunta4 2`… (Mac copy suffixes), so 16 of 21 images aren't found. Fix: rename the folders | 🟢 AV | S |
| A1.11 | Concurso: not clear you tap "Respuesta 1/2" to hear it, then press the green button | Add a speaker icon + text hint. A voice instruction needs new audio | 🟢 AV (+ 🔵 optional audio) | S |
| A1.12 | Scenes freeze | See 0.2 | 🟠 | (0.2) |

---

## 3. Aventura 2: Intimidad (reuses basic actividad-2)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A2.1 | Scenes 1–3 play the wrong videos. Client says: scene 1 shows scene 3's video, scene 2 shows scene 1's, scene 3 shows scene 2's | Video files `ACTIVIDAD-2-ESCENA-1/2/3.mp4` (uploaded 11 Nov 2025, "new voice"). Fix: swap which file each scene plays | 🟠 SHARED (**basic Aventura 2 plays the same videos, so it's wrong there too**) + ❓ please confirm by watching | S |
| A2.2 | Scene 1 doesn't send you back to the map | Check after A2.1 | 🟢 AV | S |
| A2.3 | Game 2: new vulva image | See G8 | 🔵 + 🟠 | S |
| A2.4 | Game 3: two identical images (saludar a amigos / abrazarse) | One image must be replaced | 🔵 ASSET + 🟠 SHARED | S |
| A2.5 | Scene 4: María's explanation is missing | Content of the video `ACTIVIDAD-2-ESCENA-4.mp4` | 🔵 ASSET (new video) + 🟠 SHARED | n/a |
| A2.6 | Scene 5 círculo: "no video" | Video exists in code, see 0.1 | ❓ | n/a |
| A2.7 | Círculo game: Noa is a placeholder, not the character | Code shows a placeholder box labelled "Noa". Needs a Noa image | 🔵 ASSET (or I reuse an existing Noa image) + 🟢 AV | S |
| A2.8 | **Círculo game: dragging Cris to a circle does nothing, so you can't finish the aventura** | Bug in the drag & drop of `JuegoSeisActividad2` (advanced-only game) | 🟢 AV, **high priority** | M |

---

## 4. Aventura 3: Placer sexual (reuses basic actividad-3)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A3.1 | Map has an extra cartel "Juego: ¿Qué pasa cuando me excito?" | Extra item in `AVENTURA_3_CONFIG` + `aventura-3/juego1`. Remove it | 🟢 AV | S |
| A3.2 | After the male orgasm game, the "¿Qué pasa cuando te excitas?" + female game appear: remove | Comes from the same `juego1` step (A3.1) | 🟢 AV | S |
| A3.3 | Cartel "El orgasmo femenino" says "la masturbación" | Cartel 4 uses audio `mAct3/a4.mp3` (masturbación). Should use `a3.mp3` | 🟢 AV | S |
| A3.4 | Masturbación game: client says *"solo me aparece el juego de Cris… falta el de la masturbación masculina"* | **By design:** the game shows Dani (male) to boys and Cris (female) to girls, based on the student's sex in their profile. Accounts with no sex set get Cris. The client tested with a female (or unset) account, so the male game never appeared | ❓ Keep by sex (then just explain it to the client), or show both in advanced? | 0 / M |
| A3.5 | Missing scene 3 (fantasías sexuales in the bus) | ✅ **Already in the app (re-test).** The A3 final video `Actividad_3_scene_5.mp4` (49 s, added in June after the feedback) shows Cris and Noa talking on the bus. That's this scene | re-test | n/a |
| A3.6 | At the end: "Jugar" button but no more games; should say aventura completed → home | Final page `aventura-3/scene5` + G3 | 🟢 AV | S |

---

## 5. Aventura 4: Nos entendemos y nos respetamos (reuses basic actividad-5)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A4.1 | Game 2 "¿Qué cara pondrá…?" missing (goes straight to the tone-of-voice game) | The chain never visits `actividad-5/scene1-2`. Add it (that scene already supports returning to aventura-4) | 🟢 AV | S |
| A4.2 | After that game the aventura looks finished | Same chain + G3 | 🟢 AV | S |
| A4.3 | Scene 3 "próximamente" | Already a real video in code, see 0.1 | ❓ | n/a |
| A4.4 | End of section not clear ("Jugar" → map again) | G3 | 🟢 AV | (G3) |

---

## 6. Aventura 5: Diversidad sexual (advanced-only)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A5.1 | Slow | 0.2 (videos) | 🟠 | (0.2) |
| A5.2 | Says "DIFERENCIA" instead of "INDIFERENCIA" | Audio file `advance-aventura5/juego1/Indiferencia.mp3` | 🔵 ASSET (re-record) | n/a |
| A5.3 | AI voice too fast / cut words | G7 | 🔵 | n/a |
| A5.4 | Must answer INDIFERENCIA to advance; Game 2 also only advances on the correct option | G5 | 🟢 AV | M |
| A5.5 | "Felicidades, sección completada" too early; no "aventura terminada" | G3/G4 | 🟢 AV | (G3) |

---

## 7. Aventura 6: Relaciones de pareja (advanced-only)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A6.1 | Game 1 situations 1 and 3: thumbs-up says correct (it's wrong) | In `JuegoUnoAventura6/config.ts` the feedback audios look **crossed** (correct answer → `…-incorrecto.mp3`). Fix: swap them | 🟢 AV, ❓ I can't listen; we check together | S |
| A6.2 | Don't say CORRECTO/INCORRECTO, only the explanation | If the words are inside the recordings → 🔵 re-record; if on screen → I remove them | 🟢/🔵 | S |
| A6.3 | Game 2 (celos): correct answers inverted in all 3 situations | Same config issue in `JuegoDosAventura6` | 🟢 AV | S |
| A6.4 | Game 2: use "SÍ"/"NO" buttons instead of thumbs | UI change | 🟢 AV | S |
| A6.5 | Game boxes too small | G6 | 🟢 AV | S |
| A6.6 | Scene 3: freezes + repeats "Ah sí, es Pablo, mi otro novio" | Freeze = 0.2. The repeated line is inside the video | 🔵 ASSET (fixed video) | n/a |
| A6.7 | Scene 4 freezes | 0.2 | 🟢 | (0.2) |
| A6.8 | Games 3 and 4: must stay on the situation after a wrong answer | G5 | 🟢 AV | S |

---

## 8. Aventura 7: Prácticas sexuales, asertividad y pornografía (advanced-only)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A7.1 | Different titles on the map vs. inside the scenes | Map and buttons match in code | ❓ Where exactly? (maybe titles inside the videos, or 0.1) | ? |
| A7.2 | Scenes 1 and 4 freeze | 0.2 | 🟢 | (0.2) |
| A7.3 | Asertividad: wrong answer jumps to next situation | G5 | 🟢 AV | S |
| A7.4 | Preservativo games: full screen; describe each image on hover/tap | Full screen 🟢. Descriptions need audio per image | 🔵 ASSET (audio) or text-only first | M |
| A7.5 | "Arrastra el dedo…" → "…o la flecha del ratón" | Audio + text | 🔵 ASSET (audio); text 🟢 S | S |
| A7.6 | Scene 4: Dani's behaviour scene unclear | Video content | 🔵 ASSET (new video) | n/a |
| A7.7 | Game 4: "pelis" → "películas" | Text 🟢; audio 🔵 | S |
| A7.8 | Game 4 doesn't follow the developer notes (describe each image, click → circles, drag green tick); situation 2 marks the right answer as wrong; final conclusion scene missing | Game needs a **rebuild** to the spec + new images for the conclusion | 🟢 AV + 🔵 ASSET (conclusion images, audios) | L |

---

## 9. Aventura 8: Abuso sexual (own pages, but reuses basic actividad-6 videos and games)

| # | Issue | Cause / fix | Tag | Effort |
|---|---|---|---|---|
| A8.1 | Scenes 1 and 2 freeze | 0.2 (they use the basic `ACTIVIDA_6-ESCENA_*` videos) | 🟠 | (0.2) |
| A8.2 | Game 2 voice says "VICTIMIZACIÓN", should be "¿Me hace sentir bien o no?" | Title audio `audio/actividad-6/juego2/t.mp3` | 🔵 ASSET + 🟠 SHARED (basic plays the same audio). Alternative: give advanced its own audio → 🟢 | S |
| A8.3 | Game 4 voice says "ABUSADOR", should be "Aprendo a preguntar y a no insistir" | `audio/actividad-6/juego4/t.mp3` | 🔵 + 🟠 (same as above) | S |
| A8.4 | Scene 5 starts wrong (touches belly directly; missing Dani/Nuria dialogue) | Video `avanzado/actividad_8-scene_5.mp4` content | 🔵 ASSET (new video) | n/a |
| A8.5 | Game 6: no retry on wrong (client says maybe not needed) | G5, optional | 🟢 AV | S |
| A8.6 | Game 7: final message + written sentence missing | Add a closing screen with the text. Voice needs audio | 🟢 AV + 🔵 (audio) | S |

---

## 10. Questions for you / the client

1. ~~Which link did they test?~~ Answered: the feedback is from July → ask them to re-test after deploy.
2. **A1.1:** the boys' changes game doesn't exist. Build it new? Who provides the images and audio?
3. **A2.1:** please watch `ACTIVIDAD-2-ESCENA-1/2/3.mp4` and confirm the swap. It affects **basic** too. OK to fix basic as well?
4. **A3.4:** masturbación game shows the version matching the student's sex. Keep it, or show both in advanced?
5. ~~A3.5~~ Answered: the fantasías scene is already there (final video).
6. **A7.1:** where do the titles differ?
7. **Shared fixes (🟠) still to approve:** 0.2 (videos faststart), A1.5 (Clara circles), A8.2/3 (titles: same new audio for both levels, or separate?). ✅ Approved and done: A1.9, G4.
8. **Assets list** to request from the client: new vulva image; A5/A6 icon; Noa image for círculo; images for A1.1, A1.8, A2.4, A7.8; videos A2.5, A6.6, A7.6, A8.4; audios G7, A5.2, A7.4, A7.5, A7.7, A8.2/3/6.

---

## 11. Suggested order of work

1. **Unblock:** Next.js upgrade on `main` + confirm production deploys (0.1).
2. **Quick wins, advanced only (🟢 S):** A1.10 concurso images, A3.1–A3.3, A4.1, A6.1/A6.3, A1.3/A1.4/A1.6.
3. **Blockers:** A2.8 círculo drag & drop; video faststart (0.2, after your OK).
4. **Flow and UX:** G1 unlock order, G3 end-of-aventura screen, G5 retry on wrong, G6 full screen, A1.7 auto-continue.
5. **Shared fixes** once approved.
6. **Asset-dependent items** as the client delivers material.
7. **Larger builds:** A7.8 rebuild, A1.1 new game.
