# Biola Campus Map

An interactive map of the Biola University campus. Visitors can explore the map, search for any building, browse a directory organized by category, and open a location to see its photo, description and opening hours.

It started as a team project for Biola's Software Engineering course, where I was the project leader. I built the backend and API and reworked most of the frontend code, starting from a teammate's Figma design. After the course, I took it to production, with the database on Supabase, the API on Railway and the frontend on Vercel, where it was live for several months.

## What it does

- **Interactive map.** Drag to pan and zoom in and out of the campus map, with a marker for every location.
- **Search and directory.** Search for a building by name, or browse a directory grouped into expandable categories.
- **Location details.** Selecting a place opens its photo, description and today's opening hours, with a button for the full weekly schedule.
- Designed for desktop screens.

## How it's built

React frontend, Express API and a PostgreSQL database, each hosted separately.

- **API.** A small Express service with read-only routes for locations, the directory, categories and opening hours, querying Supabase's PostgreSQL through `pg`.
- **Safe queries.** Every query is parameterized. The opening hours route reads a column named after the day of the week, which can't be parameterized, so the day is checked against a fixed list first.
- **Fast panels.** The location photos are preloaded in the background, one after another, so the details panel opens without waiting on an image.

**Tech:** React, Express, PostgreSQL (`pg`), Supabase, Vercel, Railway.

The hosted version has since been taken down, so this repo is here to showcase the code.
