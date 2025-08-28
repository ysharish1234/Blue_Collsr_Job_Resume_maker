# AI Resume Maker - Setup Instructions

## Supabase Database Setup

1. **Create Supabase Project**: Go to [Supabase](https://supabase.com) and create a new project.

2. **Run Database Setup**: In your Supabase project's SQL Editor, run the SQL commands from `sql/setup_database.sql`.

3. **Environment Variables**: Create a `.env.local` file in your project root with:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Authentication Setup**: In Supabase Dashboard:
   - Go to Authentication > Settings
   - Enable email authentication
   - Configure your site URL and redirect URLs

## Database Schema

### Tables Created:

1. **resumes**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `title` (TEXT)
   - `personal_info` (JSONB) - Contains name, phone, email, address, languages
   - `experience` (JSONB) - Array of work experience objects
   - `skills` (JSONB) - Array of skills
   - `education` (JSONB) - Array of education entries
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### Security:
- Row Level Security (RLS) enabled
- Users can only access their own resumes
- Authenticated users have full CRUD permissions on their data

## Features Implemented:

✅ **Authentication**
- Email/password signup and signin
- JWT token-based authentication
- Secure user sessions

✅ **Resume Management**
- Create and save resumes to database
- View all saved resumes
- Download resumes as PDF
- Delete unwanted resumes

✅ **User Interface**
- Responsive design with Tailwind CSS
- Glass morphism effects
- Voice recognition and text-to-speech
- Progress tracking
- Real-time resume preview

✅ **Security**
- Row Level Security policies
- User data isolation
- Secure API endpoints

## Usage Flow:

1. User signs up/signs in
2. Creates resume through AI chat interface
3. Resume is automatically saved to database
4. User can view all saved resumes in "My Resumes" page
5. User can download any saved resume as PDF
6. User can delete unwanted resumes

## API Integration:

All database operations are handled through the `resumeService` which provides:
- `saveResume()` - Save new resume
- `getUserResumes()` - Get all user's resumes
- `getResume()` - Get specific resume
- `updateResume()` - Update existing resume
- `deleteResume()` - Delete resume