-- restore-heading-ids.lua
--
-- Team/people.qmd includes all five language versions and lets Quarto drop
-- the inactive ones (`.content-visible when-profile`). Pandoc assigns heading
-- IDs before that happens, so on the German, French, Czech and Norwegian
-- pages every person heading gets a numbered duplicate ID
-- ("dr.-tobias-schneider-1") and links to "#dr.-tobias-schneider" miss.
--
-- Once only one language is left, give each heading its plain ID back. The
-- "-N" suffix is removed only when the plain ID is not used anywhere else on
-- the page, so headings that genuinely repeat keep their numbered IDs.
--
-- Enabled per page in the front matter (see Team/people.qmd); it must run
-- after Quarto's own filters (`at: post-render`).

local function collect_ids(doc)
  local ids = {}
  local function add(el)
    if el.identifier and el.identifier ~= '' then
      ids[el.identifier] = true
    end
  end
  doc:walk({ Header = add, Div = add, Span = add, Figure = add })
  return ids
end

function Pandoc(doc)
  local ids = collect_ids(doc)
  return doc:walk({
    Header = function(h)
      local base = h.identifier:match('^(.+)%-%d+$')
      if base and not ids[base] then
        ids[h.identifier] = nil
        ids[base] = true
        h.identifier = base
        return h
      end
    end,
  })
end
