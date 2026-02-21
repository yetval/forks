# Fork Landing Page - Design & Implementation Plan

## Context
Fork is a rebrand of NCSSM Spoons (same rules, same school) with a dramatically upgraded landing page. The existing Spoons site uses vanilla scroll-driven 2D animations. Fork will use a **full Three.js 3D scroll experience** with a cinematic dark aesthetic - the fork is always present on screen as the scene evolves through scroll.

**Stack**: Laravel 12 + Inertia.js + React 19 + Vite + Tailwind 4 + shadcn/ui + `@react-three/fiber` + `@react-three/drei` + `three`.

**Palette**: Cold steel / blue-silver. Background `#0A0A0C`, fork metal `#B0BEC5`, highlights `#CFD8DC`, shadows `#546E7A`, accent red `#C62828` (sparse).

---

## The Experience (5 scroll sections)

### Section 1: The Door (scroll 0-20%) — CINEMATIC
- Opens on near-darkness. A sliver of warm light glows under a closed door (worm's-eye camera, floor level).
- As user scrolls, a **metallic fork slides out from under the door gap** toward the camera.
- Warm backlight catches the fork briefly before fading to cold ambient tones.
- Text etched/glowing on the handle as it emerges: *"It arrives without warning."*

### Section 2: Title Reveal (scroll 20-30%) — CINEMATIC
- Fork **lifts off the floor**, rotates from flat to a centered hover, gently tilted.
- Camera rises with it. Cold key light + blue rim light fade in. Environment reflections activate.
- **"FORK"** in massive type (10rem), letters stagger in from below one at a time.
- Subtitle: **"NCSSM 2026"** fades in below with a thin expanding horizontal line.
- Fork settles into a **slow idle spin** — this is its resting state for the rest of the page.

### Section 3: Game Info (scroll 30-60%) — CLEAN & STRAIGHTFORWARD
- **Layout**: Fork offset to the **right side** of the viewport, hovering with a slow idle spin. All text flows down the **left side** (~60% width).
- Camera is static. Lighting stays consistent (cold key + rim).
- Content is **plain and informational** — moderate detail (short paragraph or 4-5 bullets per topic). Each block fades in as you scroll to it:

  **"How it works"**
  - Every player gets a fork with another player's name on it — that's your target
  - Find your target and lightly tap them on the shoulder with your fork to eliminate them
  - When you eliminate someone, you inherit their fork and their target
  - The chain continues until one player remains
  - Last person standing wins

  **"Immunity"**
  - Touch your fork to your nose to become immune — you can't be eliminated while holding it there
  - You must hold the fork with your palm (no taping, clipping, or attaching it)
  - Any fork works for defense, not just your assigned one
  - You can't eliminate anyone while you're immune

  **"Safe Zones"**
  - Your own dorm room
  - Bathrooms, showers, and your hall while walking to them
  - PFM during meal hours
  - Library, Fablab, PEC (while working out)
  - Classrooms during class and 5 min before/after
  - Registered clubs/forums/sports during hours
  - Everywhere off campus

  **"Don't be dumb"**
  - No running — injuries = disqualification
  - Be gentle when eliminating people
  - Broken fork? DM the Forkmaster for a replacement
  - Disputes go to the Forkmaster, whose decision is final

### Section 4: Sign Up CTA (scroll 60-75%)
- Fork continues spinning, maybe scales up slightly or the lighting brightens.
- *"THE GAME BEGINS SOON."*
- **"FORK 2026"** (4rem, bold)
- **[SIGN UP NOW]** button (steel border, transparent bg, hover inverts)
- Triggers Google OAuth via Laravel Socialite (`@ncssm.edu` restriction)

### Section 5: Footer (scroll 75-100%)
- Minimal footer: *"Built by Trevor Bedson and Evan Kim"*
- Fork fades out or stays as a small element

---

## Tech Stack & Project Setup

### Creating the Project

```bash
# Create fresh Laravel project with React + Inertia starter kit
composer create-project laravel/laravel fork
cd fork

# Install the Breeze starter kit with React + Inertia + Tailwind
composer require laravel/breeze --dev
php artisan breeze:install react --typescript

# Install 3D dependencies
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three

# Install Google OAuth
composer require laravel/socialite

# Install shadcn/ui (initializes into resources/js/components/ui/)
npx shadcn@latest init
# Select: React, TypeScript, Default style, CSS variables: yes
# It will auto-detect Vite + Tailwind and configure paths

# Install the shadcn components we'll use
npx shadcn@latest add button card dialog alert-dialog tabs badge separator
```

This gives you out of the box:
- **Laravel 12** — routing, controllers, middleware, Eloquent ORM, migrations
- **Inertia.js** — bridges Laravel controllers → React page components (no REST API needed)
- **React 19 + TypeScript** — all frontend components in `resources/js/`
- **Vite** — dev server + HMR + production bundling
- **Tailwind CSS 4** — via `resources/css/app.css`
- **shadcn/ui** — pre-built accessible components (Button, Card, Dialog, Tabs, etc.) in `resources/js/components/ui/`

### shadcn/ui Setup Notes

shadcn/ui is **not a dependency** — it copies component source files into your project. After `npx shadcn@latest init`, it creates:
- `resources/js/components/ui/` — component files (button.tsx, card.tsx, etc.)
- `resources/js/lib/utils.ts` — the `cn()` helper (merges Tailwind classes via `clsx` + `tailwind-merge`)
- `components.json` — shadcn config pointing to your paths

The `init` command will detect the Laravel + Vite setup and configure `components.json` with:
```json
{
  "style": "default",
  "tailwind": {
    "config": "",
    "css": "resources/css/app.css",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Where shadcn gets used**:
- **Landing page**: `Button` for the Sign Up CTA, `Separator` for the horizontal rule under the title, `Badge` for status indicators
- **Dashboard pages**: `Card` for player stats, `Tabs` for forkmaster admin sections, `Dialog` / `AlertDialog` for kill confirmation and dispute resolution
- **Theming**: shadcn's CSS variables layer on top of the fork palette — override them in `resources/css/app.css` to match the cold steel aesthetic:

```css
/* Override shadcn's default theme to match fork palette */
:root {
  --background: 240 10% 4%;        /* #0A0A0C */
  --foreground: 200 16% 82%;       /* #CFD8DC */
  --primary: 200 12% 73%;          /* #B0BEC5 */
  --primary-foreground: 240 10% 4%;
  --secondary: 200 12% 38%;        /* #546E7A */
  --secondary-foreground: 200 16% 82%;
  --accent: 0 69% 47%;             /* #C62828 */
  --accent-foreground: 200 16% 82%;
  --muted: 200 12% 38%;
  --muted-foreground: 200 12% 60%;
  --border: 200 12% 25%;
  --ring: 200 12% 73%;
  --radius: 0.5rem;
}
```

### How Laravel + Inertia Works (for this project)

1. User hits a route (e.g., `/`) → Laravel controller runs
2. Controller returns `Inertia::render('Landing', ['props' => ...])` instead of a Blade view
3. Inertia serializes props and sends them to the React component at `resources/js/Pages/Landing.tsx`
4. On client-side navigation, Inertia fetches JSON (no full page reload) — but for the landing page this doesn't matter since it's a single scroll experience
5. Auth state is passed from Laravel → React as shared Inertia props (no client-side auth library needed)

---

## 3D Technical Approach

- **Fork model**: GLTF (.glb), 2-5k triangles, realistic metallic material (metalness 0.95, roughness 0.15). Source or model in Blender.
- **Scroll binding**: `@react-three/drei` `ScrollControls` (pages=8, damping=0.15) + `useScroll` hook. All transforms via refs in `useFrame` (no React re-renders).
- **Lighting**: Warm RectAreaLight (door scene only) → cold SpotLight key + rim setup (stays consistent after title reveal).
- **Environment**: Dark studio HDRI for fork reflections (critical for metallic realism).
- **Mobile fallback**: Cap DPR at 1.5, reduce particles, simplify HDRI. If very low-end, fall back to CSS-animated 2D fork silhouette.

---

## Backend (Laravel)

### Database Schema (Migrations)

```
users
├── id (bigint, PK)
├── name (string)
├── email (string, unique) — must end in @ncssm.edu
├── google_id (string, nullable, unique)
├── avatar (string, nullable)
├── is_forkmaster (boolean, default false)
├── current_target_id (bigint, nullable, FK → users)
├── total_kills (int, default 0)
├── is_alive (boolean, default true)
├── killed_by_id (bigint, nullable, FK → users)
├── timestamps

kills
├── id (bigint, PK)
├── killer_id (bigint, FK → users)
├── victim_id (bigint, FK → users)
├── latitude (decimal, nullable)
├── longitude (decimal, nullable)
├── approved (boolean, default false)
├── timestamps

game_config
├── key (string, PK)
├── value (string)
```

`game_config` stores key-value pairs like `status` (pre_game / active / paused / finished), `sign_ups_open` (true/false), `ffa` (true/false).

### Models

```
app/Models/User.php      — relationships: target(), killedBy(), kills()
app/Models/Kill.php       — relationships: killer(), victim()
app/Models/GameConfig.php — static helpers: get('key'), set('key', 'value')
```

### Routes (`routes/web.php`)

```php
// Public
Route::get('/', [LandingController::class, 'index']);

// Auth (Google OAuth via Socialite)
Route::get('/auth/google', [AuthController::class, 'redirect']);
Route::get('/auth/google/callback', [AuthController::class, 'callback']);
Route::post('/logout', [AuthController::class, 'logout']);

// Authenticated player routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/target', [TargetController::class, 'index']);
    Route::post('/kills', [KillController::class, 'store']);
    Route::get('/account', [AccountController::class, 'index']);
});

// Forkmaster admin routes
Route::middleware(['auth', 'forkmaster'])->prefix('forkmaster')->group(function () {
    Route::get('/', [ForkmasterController::class, 'index']);
    Route::post('/assign-targets', [ForkmasterController::class, 'assignTargets']);
    Route::post('/kills/{kill}/approve', [ForkmasterController::class, 'approveKill']);
    Route::post('/game-config', [ForkmasterController::class, 'updateConfig']);
});
```

### Authentication (Google OAuth via Socialite)

**`config/services.php`**:
```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
],
```

**`app/Http/Controllers/AuthController.php`**:
```php
public function redirect()
{
    return Socialite::driver('google')
        ->with(['hd' => 'ncssm.edu'])  // restrict to NCSSM domain
        ->redirect();
}

public function callback()
{
    $googleUser = Socialite::driver('google')->user();

    // Enforce @ncssm.edu
    if (!str_ends_with($googleUser->getEmail(), '@ncssm.edu')) {
        return redirect('/')->with('error', 'Must use an @ncssm.edu email');
    }

    $user = User::updateOrCreate(
        ['google_id' => $googleUser->getId()],
        [
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'avatar' => $googleUser->getAvatar(),
        ]
    );

    Auth::login($user, remember: true);
    return redirect('/dashboard');
}
```

### Middleware

**`app/Http/Middleware/EnsureForkmaster.php`**:
```php
public function handle($request, $next)
{
    if (!$request->user()?->is_forkmaster) {
        abort(403);
    }
    return $next($request);
}
```

Register in `bootstrap/app.php` as `'forkmaster'`.

### Landing Controller

```php
class LandingController extends Controller
{
    public function index()
    {
        $signUpsOpen = GameConfig::get('sign_ups_open') === 'true';
        $gameStatus = GameConfig::get('status') ?? 'pre_game';
        $playerCount = User::count();

        return Inertia::render('Landing', [
            'signUpsOpen' => $signUpsOpen,
            'gameStatus' => $gameStatus,
            'playerCount' => $playerCount,
        ]);
    }
}
```

---

## Frontend (React + Inertia)

### Directory Structure

```
resources/js/
├── app.tsx                          — Inertia app bootstrap (auto-generated by Breeze)
├── Pages/
│   ├── Landing.tsx                  — Main landing page (thin wrapper)
│   ├── Dashboard.tsx                — Player dashboard (post-login)
│   ├── Target.tsx                   — Current target view
│   └── Forkmaster/
│       └── Index.tsx                — Admin panel
├── Components/
│   └── Landing/
│       ├── ForkLandingPage.tsx      — Canvas + ScrollControls container
│       ├── ForkScene.tsx            — All 3D logic (fork, lights, camera, scroll)
│       ├── ForkModel.tsx            — GLTF loader + metallic material
│       ├── DoorEnvironment.tsx      — Door + floor geometry for intro
│       ├── ForkFallback.tsx         — CSS-animated fallback for low-end devices
│       └── Sections/
│           ├── TitleReveal.tsx      — Staggered "FORK" letter animation
│           ├── GameInfo.tsx         — Rules, immunity, safe zones, conduct
│           ├── SignUpCTA.tsx        — CTA button (links to /auth/google)
│           └── Footer.tsx           — Credits
├── Layouts/
│   └── AppLayout.tsx               — Shared layout for authenticated pages
resources/css/
└── app.css                          — Tailwind + fork palette CSS variables
public/
└── models/
    └── fork.glb                     — Fork 3D model
```

### Architecture: How the 3D + HTML Layers Work

```
Pages/Landing.tsx
└── <ForkLandingPage />                (client-side, no SSR)
    ├── <Canvas>                       (R3F canvas, full viewport, position: fixed)
    │   └── <ScrollControls pages={8} damping={0.15}>
    │       ├── <ForkScene />          (all 3D: model, lights, camera, scroll logic)
    │       │   ├── <ForkModel />
    │       │   ├── <DoorEnvironment />
    │       │   ├── <Environment preset="studio" />
    │       │   └── Lights (SpotLight, RectAreaLight, AmbientLight)
    │       │
    │       └── <Scroll html>          (HTML overlay pinned to scroll)
    │           ├── <TitleReveal />
    │           ├── <GameInfo />
    │           ├── <SignUpCTA />
    │           └── <Footer />
    └── </Canvas>
```

**Key concept**: `<ScrollControls>` from drei creates a virtual scroll container. The `pages` prop controls total scrollable length (pages × viewport height). Inside it:
- 3D children read scroll progress via `useScroll()` in `useFrame` and animate transforms with refs.
- `<Scroll html>` children are real DOM elements positioned in the scroll flow, rendered on top of the canvas.

### SSR Consideration

Three.js **cannot** run server-side. Since Inertia + Laravel enables SSR via `@inertiajs/server`, the 3D components must be lazy-loaded client-only:

```tsx
// Pages/Landing.tsx
import { Head } from '@inertiajs/react'
import { lazy, Suspense } from 'react'

const ForkLandingPage = lazy(() => import('@/Components/Landing/ForkLandingPage'))

export default function Landing({ signUpsOpen, playerCount }: Props) {
  return (
    <>
      <Head title="Fork — NCSSM 2026" />
      <Suspense fallback={<div className="h-screen w-screen bg-[#0A0A0C]" />}>
        <ForkLandingPage signUpsOpen={signUpsOpen} playerCount={playerCount} />
      </Suspense>
    </>
  )
}
```

If SSR is enabled, also add to `ssr.tsx`:
```ts
// Skip Three.js entirely during SSR
if (typeof window === 'undefined') {
  // Return placeholder, Inertia hydrates on client
}
```

### Scroll Animation System (`ForkScene.tsx`)

All animation is driven by a single scroll offset (0 → 1) read via `useScroll().offset` inside `useFrame`. No React state, no re-renders — purely imperative ref mutations for 60fps.

```tsx
// Pseudocode for ForkScene.tsx
const forkRef = useRef<Group>(null)
const doorRef = useRef<Group>(null)
const scroll = useScroll()

useFrame(() => {
  const t = scroll.offset  // 0 to 1

  if (t < 0.2) {
    // SECTION 1: Door — fork slides toward camera along Z
    const s = t / 0.2
    forkRef.current.position.z = MathUtils.lerp(-5, 0, s)
    forkRef.current.rotation.x = 0  // flat on floor
    doorRef.current.visible = true
  } else if (t < 0.3) {
    // SECTION 2: Title — fork lifts + rotates to hover
    const s = (t - 0.2) / 0.1
    forkRef.current.position.y = MathUtils.lerp(0, 2, easeOutCubic(s))
    forkRef.current.rotation.x = MathUtils.lerp(0, -Math.PI / 6, s)
    doorRef.current.visible = false
  } else if (t < 0.6) {
    // SECTION 3: Game info — fork offset right, idle spin
    forkRef.current.position.x = 3
    forkRef.current.rotation.y += 0.003
  } else {
    // SECTION 4-5: CTA + footer
    forkRef.current.rotation.y += 0.003
  }
})
```

**Easing helpers**:
```ts
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
```

### Lighting Setup

| Light | Type | Section | Purpose |
|---|---|---|---|
| Door backlight | `RectAreaLight` (warm, 3200K) | 1 only | Warm glow under the door, catches fork as it slides |
| Key light | `SpotLight` (cool white, 5500K) | 2–5 | Main illumination, positioned upper-left |
| Rim light | `SpotLight` (blue, `#1565C0`) | 2–5 | Blue edge light from behind-right, gives depth |
| Ambient | `ambientLight` (very dim, 0.08) | All | Prevents pure black crush |

Transition from warm → cold lighting during section 2 by lerping light intensities.

### Sign Up CTA (links to Laravel Socialite route)

```tsx
// Components/Landing/Sections/SignUpCTA.tsx
import { Button } from '@/components/ui/button'

export default function SignUpCTA({ signUpsOpen }: { signUpsOpen: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg italic text-muted-foreground">THE GAME BEGINS SOON.</p>
      <h2 className="text-[4rem] font-black text-foreground">FORK 2026</h2>
      {signUpsOpen ? (
        <Button
          variant="outline"
          size="lg"
          className="border-2 border-primary bg-transparent px-10 py-6 text-xl
                     text-foreground hover:bg-primary hover:text-background"
          asChild
        >
          <a href="/auth/google">SIGN UP NOW</a>
        </Button>
      ) : (
        <p className="text-muted-foreground">Sign-ups are not yet open.</p>
      )}
    </div>
  )
}
```

Note: this is a regular `<a href>` to `/auth/google`, which triggers a full-page redirect to Google's OAuth consent screen. No client-side auth library needed — Laravel Socialite handles everything server-side.

### CSS Variables (`resources/css/app.css`)

```css
@import 'tailwindcss';

:root {
  --fork-bg: #0A0A0C;
  --fork-metal: #B0BEC5;
  --fork-highlight: #CFD8DC;
  --fork-shadow: #546E7A;
  --fork-accent: #C62828;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(3rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
  opacity: 0;
}
```

### Fork 3D Model (`public/models/fork.glb`)

**Option A: Model from scratch in Blender**
1. Model a dinner fork — 4 tines, tapered handle, slight curve. Keep it under 3k tris.
2. Material: single PBR metallic (`metalness: 0.95`, `roughness: 0.15`, `color: #B0BEC5`).
3. Export as `.glb` (binary GLTF). Enable Draco compression if file > 500KB.
4. Center the origin at the fork's balance point (roughly where the neck meets the handle).
5. Orient so the fork lies flat along the X-Z plane, tines pointing +Z, handle pointing -Z.

**Option B: Free CC0 fork model** from Sketchfab / poly.pizza. Re-orient + re-material in Blender, export as `.glb`.

**Generating the loader component:**
```bash
npx gltfjsx public/models/fork.glb --types --transform
```
Outputs a typed React component with all meshes/materials pre-wired → use as base for `ForkModel.tsx`.

---

## Performance Strategy

| Concern | Solution |
|---|---|
| DPR on high-res screens | `<Canvas dpr={[1, 1.5]}>` — caps pixel ratio at 1.5 |
| Model size | Draco-compress the `.glb` to < 200KB |
| HDRI weight | Use drei's `preset="studio"` (loaded async, small) |
| Shader complexity | Stick to `MeshStandardMaterial` (no custom shaders) |
| Mobile detection | `drei`'s `useDetectGPU()` or `navigator.hardwareConcurrency` |
| Mobile fallback | If GPU tier < 1 or < 4 cores: skip Canvas, show CSS-animated fork SVG |
| Scroll jank | All animation in `useFrame` via refs — zero React re-renders during scroll |
| Canvas resize | R3F handles resize automatically |

---

## Deployment

**Production requirements**: PHP 8.2+, Composer, Node 20+, PostgreSQL (or MySQL/SQLite).

```bash
# Build frontend assets
npm run build          # Vite compiles React → public/build/

# Laravel production
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

**Hosting options**:
- **Laravel Forge / Ploi** — managed PHP hosting, handles Nginx + SSL + deployments
- **Docker** — same pattern as the existing Spoons Dockerfile (standalone container with PHP-FPM + Nginx)
- **Railway / Render** — one-click Laravel deployment with build commands

The Vite-built assets (JS/CSS) are served as static files from `public/build/`. The `.glb` model is served from `public/models/`. No CDN needed at NCSSM scale.

---

## Build Order (Implementation Sequence)

1. **Scaffold project** — `composer create-project`, install Breeze React, install 3D deps
2. **Database** — Write migrations, models, seeders for users / kills / game_config
3. **Auth** — Configure Socialite, write AuthController, test Google OAuth flow
4. **Get the fork model** — Source or create `.glb`, place in `public/models/`
5. **`ForkModel.tsx`** — Load model with `useGLTF`, apply metallic material, verify it renders
6. **`ForkLandingPage.tsx`** — Scaffold Canvas + ScrollControls, black background, fork floating
7. **`ForkScene.tsx`** — Wire up `useScroll` + `useFrame`, implement scroll transforms section by section
8. **`DoorEnvironment.tsx`** — Floor plane + door geometry for section 1
9. **Lighting** — Implement warm → cold transition
10. **HTML overlays** — `TitleReveal`, `GameInfo`, `SignUpCTA`, footer inside `<Scroll html>`
11. **`Pages/Landing.tsx`** — Wire up Inertia page with lazy-loaded 3D
12. **`resources/css/app.css`** — Add palette vars + animations
13. **Player dashboard** — Post-login pages (target view, kill submission, account)
14. **Forkmaster admin** — Admin panel for game management
15. **Performance pass** — Test on mobile, implement fallback
16. **Polish** — Tune scroll damping, easing curves, text timing, lighting

---

## Key drei APIs Used

| API | Purpose |
|---|---|
| `ScrollControls` | Creates virtual scroll container, syncs 3D + HTML |
| `Scroll` | Wrapper for HTML children inside scroll context |
| `useScroll` | Returns scroll offset (0–1) for use in `useFrame` |
| `useGLTF` | Loads + caches `.glb` models with Draco support |
| `Environment` | Loads HDRI for realistic reflections |
| `Float` | Optional: adds subtle float/bob to fork during idle |
| `Html` | Renders DOM elements positioned in 3D space |
| `useDetectGPU` | GPU capability detection for mobile fallback |

---

## Verification
1. `php artisan serve` + `npm run dev` — scroll through the full experience
2. Verify fork animation is smooth at 60fps on desktop
3. Test Google OAuth flow end-to-end (sign up → redirect → dashboard)
4. Test on mobile (responsive text sizing, 3D performance, fallback triggers)
5. Check all narrative text is readable against 3D background
6. Verify Forkmaster admin panel is restricted to `is_forkmaster` users
7. `npm run build` + `php artisan serve` — test production asset serving
