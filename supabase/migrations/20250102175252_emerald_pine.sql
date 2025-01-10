/*
  # Set up initial auth configuration
  
  1. Create custom claims function
  - Adds role information to JWT claims
  - Ensures proper role-based access control
  
  2. Security
  - Uses Supabase's built-in auth system
  - Sets up proper JWT claims
*/

-- Create function to handle user metadata and claims
CREATE OR REPLACE FUNCTION handle_user_metadata()
RETURNS trigger AS $$
BEGIN
  -- Set default role if not provided
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"user"'
    );
  END IF;

  -- Set raw_app_meta_data based on user_meta_data role
  NEW.raw_app_meta_data = jsonb_set(
    COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
    '{role}',
    NEW.raw_user_meta_data->'role'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to set metadata before insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_metadata();

-- Create trigger to maintain metadata on update
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data->>'role' IS DISTINCT FROM NEW.raw_user_meta_data->>'role')
  EXECUTE FUNCTION handle_user_metadata();

-- Create function to get user role
CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb->>'role',
    'anonymous'
  );
$$;