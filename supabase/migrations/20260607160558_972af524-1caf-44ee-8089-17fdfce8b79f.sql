
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  req_role public.app_role;
  ced TEXT;
  is_owner BOOLEAN;
BEGIN
  req_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role_requested','')::public.app_role, 'student'::public.app_role);
  ced := COALESCE(NEW.raw_user_meta_data->>'cedula', NEW.id::text);
  is_owner := regexp_replace(ced, '\D', '', 'g') = '31801863';

  INSERT INTO public.profiles (
    user_id, cedula, first_name, last_name, email, semester, career,
    role_requested, verification_status, credentials, rank, institution
  ) VALUES (
    NEW.id, ced,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'email_real',
    NEW.raw_user_meta_data->>'semester',
    NEW.raw_user_meta_data->>'career',
    CASE WHEN is_owner THEN 'admin'::public.app_role ELSE req_role END,
    CASE WHEN is_owner OR req_role = 'student' THEN 'approved' ELSE 'pending' END,
    NEW.raw_user_meta_data->>'credentials',
    NEW.raw_user_meta_data->>'rank',
    NEW.raw_user_meta_data->>'institution'
  ) ON CONFLICT (user_id) DO NOTHING;

  IF is_owner THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  ELSIF req_role = 'student' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;
