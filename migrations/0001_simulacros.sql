CREATE TABLE simulacros (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL CHECK (ends_at > starts_at),
  problem_ids TEXT NOT NULL CHECK (json_valid(problem_ids) AND json_array_length(problem_ids) BETWEEN 1 AND 26)
);

CREATE TABLE simulacro_entries (
  event_id TEXT NOT NULL REFERENCES simulacros(id),
  handle TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  registered_at INTEGER NOT NULL,
  PRIMARY KEY (event_id, handle)
);
