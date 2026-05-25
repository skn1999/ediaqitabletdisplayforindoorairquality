Extend the existing wall-mounted IAQ tablet prototype for classrooms and office spaces. Keep the same visual style, component system, avatar logic, traffic-light language, and public-display context from the previous chunks.

This tablet already has:
1. Ambient Status
2. Action Needed
3. Recovery Check
4. Escalate / Report Issue

Now create the next layer of the experience:
5. Idle Information Layer
6. Ambient Status with Persistent Ticket Status

This chunk is not about urgent action. It is about passive awareness, trust, and keeping the system visible without becoming noisy.

Important design principle:
This layer must remain secondary to alerts and action. It should only appear when the room is stable or when the system wants to provide light, glanceable context. It should not interrupt the core flow.

Design goals:
- Reinforce that the room is being monitored
- Build awareness without requiring interaction
- Lightly support environmental learning
- Make status of previously reported issues visible
- Keep the interface calm and public-facing
- Avoid information overload
- Avoid turning the screen into a slideshow or data dashboard

Screen 5: Idle Information Layer
Purpose:
When the room is in a good or stable condition, the wall-mounted tablet can occasionally rotate to a passive informational version of the ambient state. This should create awareness without becoming educational content in a heavy or classroom-teaching sense.

This is not a new main operational state. It is a low-priority ambient variation shown only during stable periods.

Design requirements:
- Use the same base layout as Ambient Status.
- Keep the room name and time visible.
- Keep the visual tone calm and reassuring.
- The main room status should still be visible and should remain primary.
- Add one small informational card, rotating tip, or context module.
- The information module must be short, simple, and understandable from a quick glance.
- It should feel like passive public information, not a lesson page.
- It should not compete visually with the room status.

Content themes for the idle information layer:
- Why fresh air matters
- Why temperature and humidity matter for comfort
- A simple explanation of what CO2 means in a room
- A short behavioral reminder such as airing the room early
- A lightweight “did you know?” style fact
- Optional “this room is monitored in real time” reassurance

Visual design:
- Calm neutral or green ambient palette
- Relaxed avatar or smiling face/icon
- Small illustrated card or compact information tile
- Keep typography large enough to be readable, but subordinate to the main room status
- No complex charts
- No long paragraphs
- No more than one informational message at a time

Example Italian copy options for the Idle Information Layer:
Option A:
- Aria buona
- La qualità dell’aria in questa stanza è stabile
- Lo sapevi?
- Una buona ventilazione aiuta attenzione e comfort

Option B:
- Aria buona
- La stanza è nei valori corretti
- CO2 indica quanta aria già respirata è presente nell’ambiente

Option C:
- Aria buona
- Tutto regolare in questa stanza
- Temperatura e umidità influenzano anche il comfort, non solo la qualità dell’aria

Optional microcopy:
- Questa stanza è monitorata in tempo reale
- Informazioni ambientali in tempo reale
- Stato della stanza aggiornato automaticamente

Important:
- This screen should not feel childish, even if it uses a friendly avatar.
- It must work in both classrooms and office spaces.
- It should support awareness, not formal teaching.

Screen 6: Ambient Status with Persistent Ticket Status
Purpose:
If a report has already been submitted, the user should still see that the issue is known and being handled. This creates the missing feedback loop without forcing them to ask again or guess what happened.

This screen is essentially the normal Ambient Status screen plus a calm, persistent issue-status component.

Design requirements:
- Start from the Ambient Status screen structure.
- Keep the room status primary.
- Add a compact but visible ticket status area near the bottom or lower-middle part of the screen.
- The ticket status component should feel informative, not alarming.
- Use simple progress language.
- It must be understandable from a glance.

The ticket status component should support these states:
- Ricevuta
- In lavorazione
- Risolta

Component content:
- Segnalazione attiva
- ID segnalazione #AQ-203
- Stato: In lavorazione

Alternative resolved version:
- Segnalazione chiusa
- ID segnalazione #AQ-203
- Stato: Risolta

Visual style:
- Compact card or pill-style status component
- Neutral or soft blue/teal treatment for “In lavorazione”
- Soft green for “Risolta”
- Avoid red unless the room is still actively in alert
- Include a very small icon such as check, clock, or tool symbol if useful
- Do not make it feel like a maintenance dashboard

Example Italian copy for Ambient with active ticket:
- Ufficio 3.12
- 14:24
- Aria buona
- La qualità dell’aria in questa stanza è stabile
- CO2 720 ppm
- Temperatura 22°C
- Umidità 45%
- Segnalazione attiva
- ID segnalazione #AQ-203
- Stato: In lavorazione

Example Italian copy for Ambient with resolved ticket:
- Ufficio 3.12
- 16:05
- Aria buona
- La qualità dell’aria in questa stanza è stabile
- Segnalazione chiusa
- ID segnalazione #AQ-203
- Stato: Risolta

Interaction logic for prototype:
- The Idle Information Layer can be shown as a variation of Ambient Status.
- The Persistent Ticket Status screen can be shown as another Ambient variation after a report has been submitted.
- If possible, simulate a simple loop:
  Ambient Status → Idle Information Layer → Ambient with Ticket Status
- These should all still feel like one family of calm room-state screens.

Important constraints:
- Do not make this a carousel-heavy concept.
- Do not create too many cards.
- Do not let secondary information overpower the main status.
- Keep the display useful from across the room.

Please generate:
- One screen for Idle Information Layer
- One screen for Ambient Status with active ticket status
- Optionally one variation for Ambient Status with resolved ticket status
- Italian UI copy
- Consistent avatar/state design
- Minimal, public-display styling
- Secondary information clearly subordinate to the main room status
