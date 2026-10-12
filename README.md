# Indhu B – Portfolio Website

A responsive, dark-themed developer portfolio built with plain HTML, CSS and JavaScript (no build step).

## Structure

```
portfolio/
├── index.html
├── css/styles.css
├── js/script.js
├── resume.pdf        (optional – you add this)
└── images/           (optional – screenshots, profile photo)
```

## Run it

Double-click `index.html`, or serve the folder locally:

```
python -m http.server 8000
```

then open http://localhost:8000. (The Download Resume button only auto-appears when served over http/https.)

## Customize

1. **College & graduation year** – in `index.html`, find the Education section (`id="college"` and `id="grad-year"`) and replace the bracketed text. Remove the `placeholder` class afterwards.
2. **Coursework / achievements / certifications** – edit the three lists in the Education section.
3. **Resume** – put your PDF in the folder named `resume.pdf`. The button appears automatically once hosted.
4. **Projects** – each project card is marked *Planned*. When one is finished, change `data-status`, switch the badge to `<span class="status completed">Completed</span>`, and replace the "Links will be added" line with real GitHub / Live Demo links. A comment in the file explains this.
5. **Achievements** – a template is in a comment inside the Achievements section. Delete the "Coming Soon" card when you add your first real one.
6. **Currently Learning** – edit the `<span>` tags inside `id="learning-list"`.
7. **Profile photo** – optional; replace the code-window block in the hero with `<img src="images/me.jpg" alt="Indhu B">`.

## Make the contact form send messages

Without a backend the form opens the visitor's email app (mailto fallback) and says so honestly.
To receive messages directly:

1. Create a free form at https://formspree.io and copy its endpoint URL.
2. Open `js/script.js` and set `FORM_ENDPOINT = "https://formspree.io/f/yourid";`

## Deploy free

- **GitHub Pages**: push the folder to a repo → Settings → Pages → deploy from `main`.
- **Netlify / Vercel**: drag-and-drop the folder.

## Honesty notes

No proficiency percentages, certificates, awards or usage stats are claimed. Planned projects are labeled as planned.
