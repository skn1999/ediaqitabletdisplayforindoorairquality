Extend the existing wall-mounted IAQ tablet prototype for classrooms and office spaces. This is the same public-facing ambient device from the first chunk, not a browser dashboard or maintenance console.

Keep the same visual system, layout language, and device context already established:
- Portrait wall-mounted tablet
- Italian UI copy
- Large readable typography
- Traffic-light status logic
- Friendly avatar or expressive face/icon that changes by state
- Public ambient device, not an analytics tool
- Minimal clutter, no sidebars, no dense tables, no charts unless extremely simplified
- Support both teachers and office workers with one shared occupant-facing flow

Now add the next two screens in the unified flow:
3. Recovery Check
4. Escalate / Report Issue

Important design principles for these screens:
- The system should close the loop after action.
- Users must know if what they did is working.
- Escalation must be fast, pre-filled, and low-bureaucracy.
- Ticket feedback must remain visible after submission.
- Keep the interaction reactive and short.
- The device should feel helpful, not administrative.

Screen 3: Recovery Check
Purpose:
The user has already taken action after an alert, for example opening the windows. The display now tracks whether the room is improving, stable, or still worsening. This helps the occupant avoid guessing and avoids over-ventilation or repeated checking.

Design requirements:
- Keep the same header structure with room name and time.
- Visually shift from warning into a “monitoring recovery” state.
- The status should feel active but calmer than the main alert screen.
- Use a softer amber-to-neutral transition feeling.
- The avatar or expressive icon should change from concerned to “watching / waiting / hopeful”.
- Large headline should reassure and explain what is happening.
- Show whether air quality is improving, stable, or not improving.
- Include a very simple visual recovery indicator:
  - progress bar
  - directional arrow
  - or mini trend line
- Do not create a complex chart.
- Keep metrics secondary.
- Include one primary message about whether the action is working.
- Include one next-step action if recovery is too slow.

Key behavior:
- If the room is improving, the interface should say so clearly.
- If the room is not improving after a reasonable interval, prompt escalation.
- The state should imply time passing, for example “tra pochi minuti” or “stiamo monitorando”.
- The prototype should show one optimistic recovery case.

Example Italian copy for Recovery Check:
- Aula 2B
- 12:03
- Stiamo monitorando il recupero
- La qualità dell’aria sta migliorando
- CO2 in diminuzione
- Continua così per qualche minuto
- Small recovery indicator: freccia verso il basso or progress bar
- CO2 1380 ppm
- Temperatura 20°C
- Umidità 47%
- Primary button: Va meglio
- Secondary button: Non migliora

Alternative supportive lines:
- “L’aria sta tornando nei valori corretti”
- “Controllo in corso”
- “La stanza sta recuperando”

Important:
- This screen should communicate progress, not certainty.
- The interface should avoid overpromising.
- It should feel like a simple, legible room-status update after action.

Prototype interaction logic:
- Tapping “Ho aperto le finestre” from the previous Action Needed screen should transition here.
- Tapping “Va meglio” can return to Ambient Status.
- Tapping “Non migliora” should lead to the Escalate / Report Issue screen.

Screen 4: Escalate / Report Issue
Purpose:
The room condition is not recovering, or the user wants to report a problem directly. This screen creates a low-friction reporting path with automatic contextual information and visible status after submission.

Design requirements:
- Same overall layout and device style.
- Keep the interface simple, large, and fast.
- This should feel like a public-device reporting moment, not a long form.
- Use a more neutral service/reporting tone, not a scary alarm tone.
- Keep room context always visible.
- The user should not have to type much.

Form behavior:
- The form is pre-filled automatically with:
  - room ID
  - time
  - active issue context if an alert is active
  - key parameter causing the issue
- Show this as already captured system information.
- The user should only:
  - confirm the report
  - optionally add a short note
- No login.
- No authentication.
- No long questionnaire.
- No navigation away from the screen.

Suggested form fields:
- Stanza: Aula 2B
- Ora: 12:07
- Problema rilevato: CO2 alta
- Stato attuale: Non migliora dopo ventilazione
- Nota opzionale: text field with placeholder “Aggiungi una nota”

Primary button:
- “Invia segnalazione”

Secondary button:
- “Annulla”

After submission:
Create a confirmation version of the same screen or a sub-state on the same screen that shows:
- a large success confirmation
- ticket created
- visible issue status

Example Italian copy after submission:
- Segnalazione inviata
- Il problema è stato registrato per questa stanza
- ID segnalazione #AQ-203
- Stato: Ricevuta

Add a simple ticket status component that can later show:
- Ricevuta
- In lavorazione
- Risolta

Important design requirement:
Ticket status should stay visible in a calm, compact way on later ambient screens until the issue is resolved. This supports the need for a visible feedback loop.

Optional note on wording:
Because some school contexts may not have a formal technical team, the language should be broad enough to work in both classrooms and offices. Prefer neutral terms such as:
- “Segnala un problema”
- “Richiedi supporto”
Instead of forcing only:
- “Segnala al tecnico”

Use this screen wording:
- Segnala un problema
- I dati della stanza sono già inclusi
- Ti basta confermare la segnalazione

Example Italian copy for the reporting form:
- Aula 2B
- 12:07
- Segnala un problema
- I dati della stanza sono già inclusi
- Stanza: Aula 2B
- Ora: 12:07
- Problema rilevato: CO2 alta
- Stato attuale: Non migliora dopo ventilazione
- Nota opzionale
- Placeholder: Aggiungi una nota
- Button 1: Invia segnalazione
- Button 2: Annulla

Example confirmation sub-state:
- Segnalazione inviata
- Il problema è stato registrato
- ID segnalazione #AQ-203
- Stato: Ricevuta

Visual guidance:
- Recovery Check should feel lighter than the alert state.
- Report Issue should feel structured and calm, not bureaucratic.
- Keep icon/avatar behavior consistent:
  - monitoring / hopeful in recovery
  - neutral support / service icon in reporting
- Use simple step clarity, not complex forms.

Interaction logic for prototype:
- From Action Needed, tapping “Ho aperto le finestre” goes to Recovery Check.
- From Recovery Check, tapping “Non migliora” goes to Report Issue.
- From Action Needed, tapping “Segnala un problema” can also go directly to Report Issue.
- From Report Issue, tapping “Invia segnalazione” goes to a submitted confirmation state with visible ticket status.

Please generate:
- Screen 3: Recovery Check
- Screen 4: Escalate / Report Issue
- A submitted confirmation version of Screen 4 if possible
- Consistent Italian UI copy
- Large touch targets
- Simple recovery indicator
- Pre-filled low-friction reporting flow
- Visible ticket status component
- No admin-dashboard aesthetics
