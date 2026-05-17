ALTER TABLE categories
  ADD COLUMN description TEXT NULL AFTER name,
  ADD COLUMN display_order INT NOT NULL DEFAULT 999 AFTER description;

UPDATE categories
SET
  description = CASE name
    WHEN 'Programming' THEN 'Build strong coding foundations with modern development skills.'
    WHEN 'Databases' THEN 'Learn to design, query and manage structured data efficiently.'
    WHEN 'Cloud' THEN 'Explore cloud platforms, deployment basics and scalable services.'
    WHEN 'Data Science' THEN 'Work with data, discover patterns and create useful analytical insights.'
    WHEN 'DevOps' THEN 'Understand automation, delivery workflows and infrastructure practices.'
    ELSE description
  END,
  display_order = CASE name
    WHEN 'Programming' THEN 1
    WHEN 'Databases' THEN 2
    WHEN 'Cloud' THEN 3
    WHEN 'Data Science' THEN 4
    WHEN 'DevOps' THEN 5
    ELSE display_order
  END
WHERE name IN ('Programming', 'Databases', 'Cloud', 'Data Science', 'DevOps');
