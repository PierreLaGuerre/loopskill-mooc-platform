-- Adds broader recommendation interests and links them to existing courses.
-- The course mapping is intentionally based on the current catalog.

INSERT INTO tags (name)
VALUES
  ('AI'),
  ('Cloud'),
  ('Cybersecurity'),
  ('Deployment')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT IGNORE INTO course_tags (course_id, tag_id)
SELECT course_id, tag_id
FROM (
  SELECT 13 AS course_id, (SELECT id FROM tags WHERE name = 'AI') AS tag_id
  UNION ALL SELECT 15, (SELECT id FROM tags WHERE name = 'AI')
  UNION ALL SELECT 33, (SELECT id FROM tags WHERE name = 'AI')
  UNION ALL SELECT 35, (SELECT id FROM tags WHERE name = 'AI')

  UNION ALL SELECT 9, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 10, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 11, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 12, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 29, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 30, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 31, (SELECT id FROM tags WHERE name = 'Cloud')
  UNION ALL SELECT 32, (SELECT id FROM tags WHERE name = 'Cloud')

  UNION ALL SELECT 12, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 18, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 29, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 30, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 32, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 37, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 38, (SELECT id FROM tags WHERE name = 'Cybersecurity')
  UNION ALL SELECT 39, (SELECT id FROM tags WHERE name = 'Cybersecurity')

  UNION ALL SELECT 11, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 12, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 18, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 19, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 20, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 29, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 30, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 31, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 32, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 37, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 39, (SELECT id FROM tags WHERE name = 'Deployment')
  UNION ALL SELECT 40, (SELECT id FROM tags WHERE name = 'Deployment')
) AS interest_links
WHERE tag_id IS NOT NULL;
