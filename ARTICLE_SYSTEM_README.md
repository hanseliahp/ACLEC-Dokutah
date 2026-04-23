# Article System Setup Guide

## Overview
The article system allows you to:
1. Create and edit articles through `/article-editor.html`
2. Save articles to Supabase database
3. Display articles on the homepage dynamically

## Setup Steps

### 1. Create the Articles Table in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the SQL from `SUPABASE_SETUP.sql`
5. Run the query

This will create the `articles` table with the following columns:
- `id` - Primary key (auto-generated)
- `title` - Article title
- `content` - Article content
- `category` - Article category (e.g., "Pola Hidup", "Gizi", etc.)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `created_by` - Author (optional)
- `is_published` - Publishing status

### 2. Verify API Connection

The server already has these endpoints:
- `GET /api/articles` - Get all articles (sorted by newest first)
- `GET /api/articles/:id` - Get a specific article
- `POST /api/articles` - Create a new article
- `PUT /api/articles/:id` - Update an article
- `DELETE /api/articles/:id` - Delete an article

### 3. Access the Article Editor

1. Start the server: `npm start`
2. Visit `http://localhost:3000/article-editor.html`
3. Write your article and click "Simpan Artikel"
4. Your article will be saved to Supabase and appear in the list

### 4. View Articles on Homepage

- Articles are automatically fetched and displayed on the homepage
- The 3 most recent articles are shown on `/index.html`
- Each article shows title, category, date, and preview

## API Usage Examples

### Create Article
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Health Tips",
    "content": "This is the article content...",
    "category": "Tips Kesehatan"
  }'
```

### Get All Articles
```bash
curl http://localhost:3000/api/articles
```

### Get Specific Article
```bash
curl http://localhost:3000/api/articles/1
```

### Update Article
```bash
curl -X PUT http://localhost:3000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content...",
    "category": "Gizi"
  }'
```

### Delete Article
```bash
curl -X DELETE http://localhost:3000/api/articles/1
```

## Troubleshooting

### Articles not showing on homepage
- Check browser console (F12) for errors
- Verify Supabase is connected: visit `http://localhost:3000/api/status`
- Make sure articles table exists in Supabase

### Can't save articles
- Check `.env` file has correct Supabase credentials
- Verify the articles table RLS policies are set correctly
- Check server logs for error messages

### Database connection issues
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Restart the server after updating `.env`
- Check Supabase project is active

## Future Features

- [ ] Article edit functionality in editor
- [ ] Search and filter articles
- [ ] Article comments/discussions
- [ ] Author profiles
- [ ] Article views counter
- [ ] Draft/publish workflow
