/**
 * Copy and run the following SQL in your Supabase SQL Editor:
 * 
 * -- Create the profiles table
 * CREATE TABLE public.profiles (
 *   id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
 *   username TEXT UNIQUE,
 *   full_name TEXT,
 *   bio TEXT,
 *   avatar_url TEXT,
 *   skills TEXT[],
 *   github_url TEXT,
 *   role TEXT DEFAULT 'builder',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Enable Row Level Security (RLS)
 * ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies
 * CREATE POLICY "Public profiles are viewable by everyone."
 *   ON public.profiles FOR SELECT
 *   USING ( true );
 * 
 * CREATE POLICY "Users can insert their own profile."
 *   ON public.profiles FOR INSERT
 *   WITH CHECK ( auth.uid() = id );
 * 
 * CREATE POLICY "Users can update their own profile."
 *   ON public.profiles FOR UPDATE
 *   USING ( auth.uid() = id );
 * 
 * -- Optional: Trigger to automatically create profile on signup
 * -- CREATE OR REPLACE FUNCTION public.handle_new_user()
 * -- RETURNS trigger AS $$
 * -- BEGIN
 * --   INSERT INTO public.profiles (id, full_name, username)
 * --   VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username');
 * --   RETURN new;
 * -- END;
 * -- $$ LANGUAGE plpgsql SECURITY DEFINER;
 * -- 
 * -- CREATE TRIGGER on_auth_user_created
 * --   AFTER INSERT ON auth.users
 * --   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
 */

export const SETUP_INSTRUCTIONS = "Check the comment in this file for the SQL to set up the profiles table.";
