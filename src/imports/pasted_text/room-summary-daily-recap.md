Extend the existing wall-mounted IAQ tablet prototype for classrooms and office spaces. Keep the same visual language, traffic-light logic, avatar system, and public-display simplicity from the earlier chunks.

This tablet already includes:
1. Ambient Status
2. Action Needed
3. Recovery Check
4. Escalate / Report Issue
5. Idle Information Layer
6. Ambient Status with Persistent Ticket Status

Now create one optional extension layer:
7. Room Summary / Daily Recap

Important:
This is not a dashboard and not a facility-management analytics page.
This is a lightweight, room-based summary view that can appear at selected times or on demand in a very simple format.

Purpose:
The summary view helps users understand what happened in this room over the day without asking them to log into a system. It supports awareness, trust, and reflection. It can also help teachers or office workers quickly see whether there were alerts, actions, or unresolved issues earlier.

This is especially useful because:
- users should not have to log in every day with no clear action,
- a summary of incidents was identified as valuable,
- some participants suggested periodic reporting could help awareness,
- users may want to understand if the room had recurring problems earlier in the day.

Design goals:
- Show only the most useful summary information
- Keep it extremely simple and public-display friendly
- Make it readable at a glance
- Avoid charts that look analytical or technical
- Focus on “what happened” rather than deep metrics
- Keep the room context visible at all times

When this screen appears:
- At midday
- At end of day
- As an optional “today’s summary” view from the ambient screen
- Potentially as a timed passive rotation, but not too often

Visual style:
- Same portrait tablet format
- Same header with room name and time
- Same clean, calm public-display design
- Neutral or soft blue/teal summary tone
- Friendly neutral avatar or icon
- No alarm styling unless there is still an unresolved issue

Screen 7: Room Summary / Daily Recap
Purpose:
Give a quick overview of the room’s day in plain language.

Content structure:
- Room name and current time
- Title such as “Riepilogo di oggi” or “Sintesi della giornata”
- One short summary sentence in plain language
- 3 to 4 compact recap items
- Optional unresolved issue status if relevant

Suggested recap information:
- Number of alerts today
- Most recent alert time
- Whether the room recovered after action
- Whether a report was sent
- Whether a ticket is still open
- A simple comfort/environment note such as temperature trend

Do not include:
- Dense graphs
- Long timelines
- Technical pollutant tables
- Advanced analytics
- More than 4 recap cards/items

Design pattern:
Use compact cards, check rows, or simple timeline snippets.
The screen should feel like a calm digest, not a monitoring dashboard.

Example layout:
- Header: Aula 2B | 16:20
- Title: Riepilogo di oggi
- Summary sentence: Oggi la stanza ha richiesto 2 interventi brevi di ventilazione
- Recap card 1: 2 avvisi qualità aria
- Recap card 2: Ultimo avviso alle 12:05
- Recap card 3: Recupero completato dopo apertura finestre
- Recap card 4: Nessuna segnalazione aperta

Alternative office example:
- Ufficio 3.12
- 17:10
- Riepilogo di oggi
- Oggi è stata inviata 1 segnalazione per questa stanza
- 1 avviso qualità aria
- Ultimo avviso alle 14:18
- Segnalazione inviata
- Stato attuale: In lavorazione

Example Italian copy for school version:
- Aula 2B
- 16:20
- Riepilogo di oggi
- Oggi la stanza ha richiesto 2 interventi brevi di ventilazione
- 2 avvisi qualità aria
- Ultimo avviso alle 12:05
- Recupero completato
- Nessuna segnalazione aperta

Example Italian copy for office version:
- Ufficio 3.12
- 17:10
- Riepilogo di oggi
- Oggi è stata inviata 1 segnalazione per questa stanza
- 1 avviso qualità aria
- Ultimo avviso alle 14:18
- Segnalazione inviata
- Stato: In lavorazione

Optional extension:
Add a small, secondary “best practice” or recommendation line at the bottom, such as:
- “Ventilare presto ha aiutato a riportare la stanza nei valori corretti”
- “Monitorare temperatura e aria aiuta comfort e concentrazione”

Important:
This recommendation must remain secondary and should not feel prescriptive or repetitive.

Interaction logic:
- This screen can be reached from Ambient Status through a subtle action such as “Vedi riepilogo”.
- It can also appear automatically at low-frequency moments like midday or end of day.
- It should always allow return to Ambient Status.

Constraints:
- Keep it simple enough for non-technical users.
- Make it useful for both classrooms and offices.
- Avoid making it look like an operations dashboard.
- Prioritize plain language summaries over data density.

Please generate:
- One Room Summary / Daily Recap screen
- Optionally create two content variations:
  - one classroom version
  - one office version
- Use Italian copy
- Keep it minimal, calm, and readable from a distance
- Use compact recap cards or rows
- Keep the room status context visible
