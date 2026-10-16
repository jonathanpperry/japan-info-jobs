# Japan Info Jobs migration tracker

This tracks **migration status**, not whether an original feature was feature-complete.
The original app's route map is preserved, but most original source files have not yet been provided to the new project.

## Current state

- [x] Modern Angular/Ionic/Capacitor scaffold
- [x] Login and registration page scaffolds
- [x] Firebase authentication service integration (provider configuration still needs device testing)
- [x] Fix duplicate login route and remove finished pages from placeholder list
- [x] Add temporary `/menu` navigation hub (not a replacement for original menu/tabs)
- [x] Add `/reset-password` form using existing Firebase auth service (not device-verified)
- [ ] Replace temporary menu hub with original app's navigation and nested tab layout
- [ ] Add auth guards and verify auth-state restoration
- [ ] Migrate real feature pages, state, assets, and backend services

## Routes awaiting implementation

- `applications`
- `application/:id`
- `apply/:id/:resumeId`
- `chooseresume/:id`
- `confirm-apply` and `confirm-apply/:id`
- `createresume`
- `editresume/:id`
- `filter-job-categories`
- `job` and `job/:id`
- `menu/:id`
- `profile`
- `resumes`
- `settings`
- `language-popover`
- `resume/:id`

## Implementation conventions

1. Inspect the original `*.page.ts`, `*.page.html`, `*.page.scss`, page routing, and dependent services/models before migrating.
2. Implement one vertical feature slice per branch/PR, starting with shell/menu/tabs, then jobs, resumes, applications, and profile/settings.
3. Use Angular standalone components and `loadComponent` for pages; retain original URLs where practical.
4. Replace Ionic Native/Cordova dependencies with maintained Capacitor APIs instead of copying old plugin code.
5. Don't copy production credentials, live user data, or proprietary assets without permission.
6. Build and test each slice on web and Android. Remove its path from `pendingRoutes` only after creating a real route.
