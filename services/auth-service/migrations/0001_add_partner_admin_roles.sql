-- Миграция для добавления ролей 'partner' и 'admin' в enum user_role

-- Сначала удаляем старый enum и создаём новый с расширенным списком ролей
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Создаём новый enum с расширенным списком ролей
DO $$ BEGIN
    CREATE TYPE user_role_new AS ENUM ('spacer', 'vip', 'pro', 'partner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Преобразуем существующие данные
ALTER TABLE users ALTER COLUMN role TYPE user_role_new USING role::text::user_role_new;

-- Удаляем старый enum
DROP TYPE IF EXISTS user_role;

-- Переименовываем новый enum
ALTER TYPE user_role_new RENAME TO user_role;

-- Восстанавливаем ограничение
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'spacer'::user_role;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;


