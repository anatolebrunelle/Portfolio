# Portfolio site

A single-page portfolio site — plain HTML/CSS/JS, no build step, ready for GitHub Pages.

## Files
- `index.html` — page content
- `style.css` — styles
- `script.js` — small nav highlight script

## Before you publish
Everything in here is placeholder — swap in your own:
- Name, bio, and "Now" section in `index.html`
- The four sample projects (titles, descriptions, tech tags, and the `#` links — point them at your real live demos and GitHub repos)
- Email address and GitHub/LinkedIn URLs in the Contact section
- The `<title>` and `meta description` tags in the `<head>`

## Deploying to GitHub Pages
1. Create a new repository on GitHub (e.g. `yourusername.github.io` for a root URL, or any name for a project page).
2. Push these three files to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Source**, select the `main` branch and `/ (root)` folder, then save.
5. Your site will be live at `https://yourusername.github.io/your-repo/` (or `https://yourusername.github.io/` if you used the special repo name) within a minute or two.

## Customizing
- Colors and fonts are set as CSS variables at the top of `style.css` (`:root { ... }`) — change those to retheme the whole site.
- The layout is a single scrolling page with anchor navigation (`#about`, `#projects`, etc.) — add a new `<section id="...">` and a matching nav link to add more sections.
