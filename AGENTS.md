# AGENTS.md

This is a **Jekyll-based personal website** for a software developer named Vincent. It serves two purposes:

- **Resume** (`resume.md`) — displays career information from `_data/resume.yml`
- **Blog** (`blog.md`) — Jekyll posts in `_posts/` with `post` layout

Built with Jekyll 4.3, SASS (compressed), and deployed to GitHub Pages at `https://vincentp90.github.io`. Run with `bundle exec jekyll serve`.

Note:
SASS doesn't build automaticly, build it manually with `sass _sass/main.scss assets/main.css --no-source-map --load-path=.`