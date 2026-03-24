-- Add supervision_level column to students table
-- Run this script once against the Neon database.
-- Safe to re-run: uses IF NOT EXISTS / DO NOTHING patterns.

-- Add supervision_level to students table
-- 1 = Nivel Básico (needs 100% supervision)
-- 2 = Nivel Avanzado (needs 50% supervision)
-- 3 = Independiente
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS supervision_level INTEGER DEFAULT 1
    CHECK (supervision_level >= 1 AND supervision_level <= 3);
