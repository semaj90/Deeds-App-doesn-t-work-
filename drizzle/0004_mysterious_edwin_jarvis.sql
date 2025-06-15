-- Migration to make evidence.id an auto-incrementing identity column
ALTER TABLE evidence ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;