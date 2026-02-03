Startup CSS Deliverable Notes – Decision Helper

CSS framework:
This project uses the Bootstrap 5 CSS framework via the CDN. Bootstrap utility classes (such as spacing and typography helpers) are used alongside custom CSS for layout and presentation.

Custom CSS and selectors:
A shared main.css file is used across all pages. The stylesheet demonstrates multiple selector types, including element selectors (body, label, table), class selectors (.app-shell, .cardish, .site-nav, .brand), ID selectors (#site-header, #site-footer), and pseudo-class selectors (a:hover, button:hover). CSS variables are defined in :root and reused throughout the stylesheet.

Imported font:
The Inter font is imported from Google Fonts using an @import rule at the top of main.css and applied as the primary font for the site.

Layout and responsiveness:
The overall page structure uses a responsive flexbox layout on the body and navigation bar. The main content area is centered using a constrained container and flexible widths so the layout adapts to different screen sizes. Navigation links wrap automatically on smaller screens, and images scale responsively using max-width: 100% and height: auto.

Overflow handling:
Tables on the Scores page are wrapped in a container with horizontal overflow enabled so that content does not overflow the viewport on smaller devices.

Shared styling:
All pages (index, play, scores, and about) share a consistent header, navigation bar, main layout container, and footer. The same main.css file is used across all pages to ensure a unified design.
