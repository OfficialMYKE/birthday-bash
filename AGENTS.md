<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Frontend architecture
- Keep the invitation at the index route, with reusable interactive controls in a dedicated invitation component module, so the event stays a single cohesive experience.
- Store imported repository media as Lovable asset pointers and generated artwork as ES module imports, so all invitation media is served by the project.
- Preserve the guestbook's session-only state for frontend redesigns; persistent shared messages require a separate backend request.
- Keep the envelope reveal as a session-only wrapper around the invitation, with timed stages and reduced-motion support, so opening does not affect event content or guestbook behavior.
- Keep guest tools in a dedicated invitation module and event validation/calendar data in a shared library, so calendar exports and attendance use consistent event rules.
- Store RSVP rows with insert-only guest permissions and no public reads; use submission UUIDs for retry deduplication so guest information stays private.
- Run one-question AI calls through public server functions with server-only Gateway helpers, a durable request gate and terminal-error pause, so secrets and private attendance never reach the model or browser.
