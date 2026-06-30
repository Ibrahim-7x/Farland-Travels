-- Adds the admin-editable "What's Included" structure to deals.
--
-- A JSON array of tabs (legs/cities); each tab has sections (Flights, Hotel,
-- Excursions…); each section has bullet lines (label / primary / pills) and an
-- optional photo slideshow. Replaces the content that used to be hard-coded
-- per deal slug in the frontend, so the section is now fully editable.
--
-- Existing rows are backfilled by the seed step (seedDestinationWhatsIncluded),
-- which only fills rows where this column is still NULL — admin edits are safe.
ALTER TABLE destinations
  ADD COLUMN whats_included JSON NULL AFTER components;
