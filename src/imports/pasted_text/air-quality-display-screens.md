Design a quick interactive prototype for a wall-mounted indoor air quality tablet display for classrooms and office spaces. This is not a browser dashboard. It is a passive, ambient, room-specific public display mounted on the wall. The user is already inside the room, so there is no login, no navigation, no menu system, and no need to search for the room.

The prototype should combine lessons from existing IAQ systems:
- Use traffic-light communication and plain-language status instead of relying on raw numbers alone.
- Use a friendly, simple avatar or expressive face/icon that changes with the room condition to improve glanceability and engagement.
- Show named actions, not just alerts.
- Keep one single occupant-facing view on the tablet.
- Use a subtle sense of trend or improvement, but avoid complex charts.
- Make the interface cognitively light for non-technical users.

Create the prototype in portrait tablet format, similar to a wall-mounted iPad. Make it readable from across the room in under two seconds. Use large typography, large buttons, strong contrast, and minimal clutter.

This tablet is for both teachers and office workers. It must support a unified flow focused on:
1. Ambient Status
2. Action Needed
3. Recovery Check
4. Escalate / Report Issue

For this first chunk, create only:
- Screen 1: Ambient Status
- Screen 2: Action Needed

Overall visual style:
- Clean, calm, modern, public-facing.
- More like a room device than a dashboard.
- No sidebars, no admin layout, no dense charts, no tables.
- Traffic-light logic:
  - Calm green or soft neutral-green for good air
  - Amber/orange for action needed
  - Red only for urgent escalation
- Use Italian UI copy.
- Tone should be supportive, human, and directive, not technical.
- Include a simple avatar or expressive circular face/icon that changes by state:
  - relaxed / smiling in good state
  - concerned / alert in warning state
- The avatar should support the message, not dominate the screen.

Shared layout structure:
- Top bar: room name on the left, current time on the right.
- Center: large overall room status with avatar/icon.
- Below that: one short plain-language explanation sentence.
- Lower area: simplified parameter summary with CO2, temperature, humidity, and optionally TVOC shown in a very secondary way.
- Bottom area: one low-priority helper action or message.

Important design principles:
- Do not make raw ppm values the main thing.
- The main thing is “what is happening in this room” and “what should I do”.
- Keep metrics visible but secondary.
- Use public-display wording, not app/dashboard wording.
- The room status should be understandable even if someone only glances for 1–2 seconds.

Screen 1: Ambient Status
Purpose:
This is the default passive state shown most of the time. The room is within acceptable conditions. No action is needed.

Design requirements:
- Calm visual design.
- Traffic-light green or soft neutral status treatment.
- Friendly relaxed avatar or face/icon.
- Large room label, for example “Aula 2B” or “Ufficio 3.12”.
- Large central status such as “Aria buona”.
- Supporting sentence such as “La qualità dell’aria in questa stanza è stabile”.
- Show current time in the header.
- Show a small parameter summary:
  - CO2
  - Temperatura
  - Umidità
  - TVOC optional and visually secondary
- Include a subtle line reinforcing system awareness, such as “Questa stanza è monitorata in tempo reale”.
- Add one low-priority action at the bottom, for example “Segnala un problema”.
- Keep the screen passive and not interactive-looking by default.

Example Italian copy for Ambient Status:
- Aula 2B
- 11:42
- Aria buona
- La qualità dell’aria in questa stanza è stabile
- CO2 680 ppm
- Temperatura 21°C
- Umidità 46%
- TVOC basso
- Questa stanza è monitorata in tempo reale
- Segnala un problema

Screen 2: Action Needed
Purpose:
One or more parameters have moved beyond the desired range and the room now needs action. This is the key interaction moment. The display should make the problem obvious and immediately tell the user what to do.

Design requirements:
- Same base layout as ambient state, but visually shifts into an alert state.
- Traffic-light amber/orange warning treatment.
- Avatar or expressive icon changes from relaxed to concerned/alert.
- Large plain-language headline, for example “Serve cambiare aria”.
- Short explanation naming the problem clearly, such as “La CO2 è alta in questa stanza”.
- Show the triggering metric in secondary position.
- Show one or two very clear recommended actions that the occupant can do directly.
- Use large buttons.
- Keep the language directive and short.
- Avoid technical explanations or dense detail.
- The screen should work for both classrooms and offices.

Action guidance should reflect real ventilation behavior:
- First action can suggest a short ventilation action.
- Second action can suggest a brief pause if relevant.
- If helpful, mention duration in simple terms, like “per alcuni minuti”.
- This should feel more like a room instruction than a dashboard alert.

Recommended primary actions:
- “Apri le finestre”
- “Fai una breve pausa”

Secondary action:
- “Segnala un problema”

Example Italian copy for Action Needed:
- Aula 2B
- 11:58
- Serve cambiare aria
- La CO2 è alta in questa stanza
- CO2 1650 ppm
- Azione consigliata
- Apri le finestre per alcuni minuti
- Se possibile, fai una breve pausa
- Button 1: Ho aperto le finestre
- Button 2: Segnala un problema

Optional variation inside the same screen:
- Add a small subtext under the action recommendation like:
  “Se l’aria non migliora, puoi segnalare il problema”
- Keep this secondary.

Interaction logic for prototype:
- Tapping from Ambient Status can simulate transition into Action Needed.
- Tapping “Ho aperto le finestre” should suggest the existence of a next state called Recovery Check, but do not build it yet in this chunk.
- Keep component hierarchy strong and central.

Please generate:
- Portrait wall-mounted tablet prototype
- Screen 1: Ambient Status
- Screen 2: Action Needed
- Italian copy
- Friendly avatar/icon state change
- Traffic-light visual logic
- Large typography and accessible contrast
- Minimal public-display UI, not an analytics dashboard
