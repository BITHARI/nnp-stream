
```
NNP-Stream
├─ ADMIN
│  ├─ .dockerignore
│  ├─ app
│  │  ├─ (admin)
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     ├─ Navbar.tsx
│  │  │     └─ UserDropdown.tsx
│  │  ├─ (auth)
│  │  │  ├─ forgot-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ set-new-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ signup
│  │  │  │  └─ page.tsx
│  │  │  └─ verify-email
│  │  │     └─ page.tsx
│  │  ├─ globals.css
│  │  └─ not-found.tsx
│  ├─ components
│  │  ├─ cards
│  │  │  ├─ VideoCard.tsx
│  │  │  └─ VideoHCard.tsx
│  │  ├─ file-uploader
│  │  │  ├─ RenderState.tsx
│  │  │  ├─ Uploader.tsx
│  │  │  └─ VideoUploader.tsx
│  │  ├─ general
│  │  │  └─ EmptyState.tsx
│  │  ├─ icons
│  │  │  ├─ Arrow.tsx
│  │  │  ├─ BellIcon.tsx
│  │  │  ├─ BurgerIcon.tsx
│  │  │  ├─ EyeIcon.tsx
│  │  │  ├─ HeartIcon.tsx
│  │  │  ├─ HomeIcon.tsx
│  │  │  ├─ LiveIcon.tsx
│  │  │  ├─ NnpLogo.tsx
│  │  │  ├─ NnpMinifiedLogo.tsx
│  │  │  ├─ PlayIcon.tsx
│  │  │  ├─ SearchIcon.tsx
│  │  │  └─ Spinner.tsx
│  │  ├─ rich-text-editor
│  │  │  ├─ Editor.tsx
│  │  │  ├─ HtmlViewer.tsx
│  │  │  └─ MenuBar.tsx
│  │  ├─ search
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchDropDown.tsx
│  │  │  └─ SearchResult.tsx
│  │  ├─ sidebar
│  │  │  ├─ app-sidebar.tsx
│  │  │  ├─ chart-area-interactive.tsx
│  │  │  ├─ nav-documents.tsx
│  │  │  ├─ nav-main.tsx
│  │  │  ├─ nav-secondary.tsx
│  │  │  ├─ nav-user.tsx
│  │  │  ├─ section-cards.tsx
│  │  │  └─ site-header.tsx
│  │  └─ ui
│  │     ├─ alert-dialog.tsx
│  │     ├─ animated-counter.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ multiselect.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ password-input.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ sonner.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ theme-provider.tsx
│  │     ├─ themeToggle.tsx
│  │     ├─ timeline.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     └─ tooltip.tsx
│  ├─ components.json
│  ├─ Dockerfile
│  ├─ eslint.config.mjs
│  ├─ hooks
│  │  ├─ use-carousel.ts
│  │  ├─ use-html.ts
│  │  ├─ use-local-email.ts
│  │  ├─ use-mobile.ts
│  │  ├─ use-signInWithProvider.ts
│  │  └─ useFilter.ts
│  ├─ lib
│  │  ├─ auth-client.ts
│  │  ├─ fonts.ts
│  │  ├─ utils.ts
│  │  └─ zodSchemas.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ postcss.config.mjs
│  ├─ providers
│  │  ├─ AuthProvider.tsx
│  │  ├─ AxiosInterceptorProvider.tsx
│  │  └─ QueryProvider.tsx
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ images
│  │  │  ├─ 2G8A0598.webp
│  │  │  ├─ GoInnov-1778.webp
│  │  │  ├─ GoInnov-1853.webp
│  │  │  ├─ grub+x+uhuru-4.webp
│  │  │  ├─ unframedCongo.webp
│  │  │  ├─ WIS_0975.webp
│  │  │  ├─ WIS_1097.webp
│  │  │  └─ WIS_1283.webp
│  │  ├─ pichakubwalogo.webp
│  │  ├─ pichakubwa_icon.png
│  │  ├─ pichakubwa_logoextended.png
│  │  └─ window.svg
│  ├─ README.md
│  ├─ services
│  │  ├─ admin-dash.ts
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  ├─ categories.ts
│  │  ├─ contact.ts
│  │  ├─ types.ts
│  │  ├─ upload.ts
│  │  └─ video.ts
│  ├─ tsconfig.json
│  └─ utils
│     ├─ constant.ts
│     ├─ format.ts
│     ├─ nnp-stream-app.code-workspace
│     └─ type.ts
├─ arborescence-back.md
├─ arborescence.md
├─ BACK
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ media
│  │  └─ videoCovers
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  ├─ src
│  │  ├─ controllers
│  │  │  ├─ auth.ts
│  │  │  ├─ notesQoE.ts
│  │  │  ├─ reactions.ts
│  │  │  ├─ series.ts
│  │  │  ├─ uploads.ts
│  │  │  ├─ users.ts
│  │  │  └─ videos.ts
│  │  ├─ index.ts
│  │  ├─ lib
│  │  │  ├─ db.ts
│  │  │  ├─ emailService.ts
│  │  │  ├─ muxWebhook.ts
│  │  │  ├─ passwordGenerator.ts
│  │  │  ├─ utils.ts
│  │  │  └─ zodSchemas.ts
│  │  ├─ middleware
│  │  │  ├─ auth.ts
│  │  │  ├─ error.ts
│  │  │  ├─ logger.ts
│  │  │  └─ upload.ts
│  │  └─ utils
│  │     └─ slug.ts
│  └─ tsconfig.json
├─ docker-compose.yml
└─ FRONT
   ├─ .dockerignore
   ├─ app
   │  ├─ (auth)
   │  │  ├─ forgot-password
   │  │  │  └─ page.tsx
   │  │  ├─ login
   │  │  │  └─ page.tsx
   │  │  ├─ set-new-password
   │  │  │  └─ page.tsx
   │  │  ├─ signup
   │  │  │  └─ page.tsx
   │  │  └─ verify-email
   │  │     └─ page.tsx
   │  ├─ (public)
   │  │  ├─ page.tsx
   │  │  ├─ watch
   │  │  │  └─ [videoId]
   │  │  │     ├─ page.tsx
   │  │  │     └─ _components
   │  │  │        ├─ CommentSection.tsx
   │  │  │        └─ WatchSEO.tsx
   │  │  └─ _components
   │  │     ├─ HeroVideoCarousel.tsx
   │  │     ├─ HeroVideoDetails.tsx
   │  │     ├─ Navbar.tsx
   │  │     ├─ SeriesGrid.tsx
   │  │     ├─ UserDropdown.tsx
   │  │     ├─ VideoCarousel.tsx
   │  │     ├─ VideoFilter.tsx
   │  │     └─ VideosGrid.tsx
   │  ├─ globals.css
   │  └─ not-found.tsx
   ├─ components
   │  ├─ cards
   │  │  ├─ VideoCard.tsx
   │  │  └─ VideoHCard.tsx
   │  ├─ file-uploader
   │  │  ├─ RenderState.tsx
   │  │  ├─ Uploader.tsx
   │  │  └─ VideoUploader.tsx
   │  ├─ general
   │  │  └─ EmptyState.tsx
   │  ├─ icons
   │  │  ├─ Arrow.tsx
   │  │  ├─ BellIcon.tsx
   │  │  ├─ BurgerIcon.tsx
   │  │  ├─ EyeIcon.tsx
   │  │  ├─ HeartIcon.tsx
   │  │  ├─ HomeIcon.tsx
   │  │  ├─ LiveIcon.tsx
   │  │  ├─ NnpLogo.tsx
   │  │  ├─ NnpMinifiedLogo.tsx
   │  │  ├─ PlayIcon.tsx
   │  │  ├─ SearchIcon.tsx
   │  │  └─ Spinner.tsx
   │  ├─ rich-text-editor
   │  │  ├─ Editor.tsx
   │  │  ├─ HtmlViewer.tsx
   │  │  └─ MenuBar.tsx
   │  ├─ search
   │  │  ├─ SearchBar.tsx
   │  │  ├─ SearchDropDown.tsx
   │  │  └─ SearchResult.tsx
   │  ├─ sidebar
   │  │  ├─ app-sidebar.tsx
   │  │  ├─ chart-area-interactive.tsx
   │  │  ├─ nav-documents.tsx
   │  │  ├─ nav-main.tsx
   │  │  ├─ nav-secondary.tsx
   │  │  ├─ nav-user.tsx
   │  │  ├─ section-cards.tsx
   │  │  └─ site-header.tsx
   │  └─ ui
   │     ├─ alert-dialog.tsx
   │     ├─ animated-counter.tsx
   │     ├─ avatar.tsx
   │     ├─ badge.tsx
   │     ├─ breadcrumb.tsx
   │     ├─ button.tsx
   │     ├─ card.tsx
   │     ├─ chart.tsx
   │     ├─ checkbox.tsx
   │     ├─ collapsible.tsx
   │     ├─ command.tsx
   │     ├─ dialog.tsx
   │     ├─ drawer.tsx
   │     ├─ dropdown-menu.tsx
   │     ├─ form.tsx
   │     ├─ input-otp.tsx
   │     ├─ input.tsx
   │     ├─ label.tsx
   │     ├─ multiselect.tsx
   │     ├─ navigation-menu.tsx
   │     ├─ password-input.tsx
   │     ├─ popover.tsx
   │     ├─ progress.tsx
   │     ├─ select.tsx
   │     ├─ separator.tsx
   │     ├─ sheet.tsx
   │     ├─ sidebar.tsx
   │     ├─ skeleton.tsx
   │     ├─ sonner.tsx
   │     ├─ table.tsx
   │     ├─ tabs.tsx
   │     ├─ textarea.tsx
   │     ├─ theme-provider.tsx
   │     ├─ themeToggle.tsx
   │     ├─ timeline.tsx
   │     ├─ toggle-group.tsx
   │     ├─ toggle.tsx
   │     └─ tooltip.tsx
   ├─ components.json
   ├─ Dockerfile
   ├─ eslint.config.mjs
   ├─ hooks
   │  ├─ use-carousel.ts
   │  ├─ use-html.ts
   │  ├─ use-local-email.ts
   │  ├─ use-mobile.ts
   │  ├─ use-signInWithProvider.ts
   │  └─ useFilter.ts
   ├─ lib
   │  ├─ auth-client.ts
   │  ├─ fonts.ts
   │  ├─ utils.ts
   │  └─ zodSchemas.ts
   ├─ next.config.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ pnpm-lock.yaml
   ├─ postcss.config.mjs
   ├─ providers
   │  ├─ AuthProvider.tsx
   │  ├─ AxiosInterceptorProvider.tsx
   │  └─ QueryProvider.tsx
   ├─ public
   │  ├─ file.svg
   │  ├─ globe.svg
   │  ├─ images
   │  │  ├─ 2G8A0598.webp
   │  │  ├─ GoInnov-1778.webp
   │  │  ├─ GoInnov-1853.webp
   │  │  ├─ grub+x+uhuru-4.webp
   │  │  ├─ unframedCongo.webp
   │  │  ├─ WIS_0975.webp
   │  │  ├─ WIS_1097.webp
   │  │  └─ WIS_1283.webp
   │  ├─ pichakubwalogo.webp
   │  ├─ pichakubwa_icon.png
   │  ├─ pichakubwa_logoextended.png
   │  └─ window.svg
   ├─ README.md
   ├─ services
   │  ├─ admin-dash.ts
   │  ├─ api.ts
   │  ├─ auth.ts
   │  ├─ categories.ts
   │  ├─ contact.ts
   │  ├─ types.ts
   │  ├─ upload.ts
   │  └─ video.ts
   ├─ tsconfig.json
   └─ utils
      ├─ constant.ts
      ├─ format.ts
      ├─ nnp-stream-app.code-workspace
      └─ type.ts
