# Admin Panel — Forks

## Context
The game needs an admin interface to manage game state, view players, configure target assignment rules, and run the target assignment algorithm. The `is_admin` flag already exists on `User`. No admin routes, controllers, or UI exist yet. The target assignment algorithm is ported from the spoons app (circular chain with constraint rules).

---

## Phase 1 — Backend Infrastructure

### 1. EnsureAdmin Middleware
```
php artisan make:middleware EnsureAdmin --no-interaction
```
- Check `$request->user()?->is_admin`, abort(403) if false
- Register alias `'admin'` in `bootstrap/app.php` alongside `profile.completed`

### 2. TargetRule Model + Migration + Factory
```
php artisan make:model TargetRule --migration --factory --no-interaction
```
Migration:
```php
$table->id();
$table->foreignId('player1_id')->constrained('users')->cascadeOnDelete();
$table->foreignId('player2_id')->constrained('users')->cascadeOnDelete();
$table->unique(['player1_id', 'player2_id']);
$table->timestamps();
```
Model: `$fillable = ['player1_id', 'player2_id']`, `player1()` and `player2()` BelongsTo relationships.

Add to `User` model: `currentTarget()`, `killedByUser()` BelongsTo relationships.

### 3. TargetAssignmentService
```
php artisan make:class Services/TargetAssignmentService --no-interaction
```
Three methods:
- `assign(): void` — fetch alive users, Fisher-Yates shuffle, apply TargetRules (move player2 to after player1 in array), create circular pairs, validate, persist `current_target_id`
- `reshuffle(): void` — calls `assign()`
- `clear(): void` — `User::query()->update(['current_target_id' => null])`

Algorithm (ported from spoons `/lib/targetAssignment.ts`):
1. Get all `alive = true` users
2. Shuffle (Fisher-Yates)
3. For each TargetRule: find player2 in array, splice it to position immediately after player1
4. Validate: same count + same IDs (throw on failure)
5. Circular assignment: `users[i]->current_target_id = users[(i+1) % count]->id`

### 4. Form Requests
```
php artisan make:request Admin/UpdateGameRequest --no-interaction
php artisan make:request Admin/StoreTargetRuleRequest --no-interaction
```
- `UpdateGameRequest`: `stage` (Rule::enum(GameStage)), `auth_open` (boolean)
- `StoreTargetRuleRequest`: `player1_id` (exists:users, different:player2_id), `player2_id` (exists:users)

### 5. Controllers
```
php artisan make:controller Admin/AdminController --no-interaction
php artisan make:controller Admin/UpdateGameController --invokable --no-interaction
php artisan make:controller Admin/ToggleUserAliveController --invokable --no-interaction
php artisan make:controller Admin/ToggleUserAdminController --invokable --no-interaction
php artisan make:controller Admin/StoreTargetRuleController --invokable --no-interaction
php artisan make:controller Admin/DestroyTargetRuleController --invokable --no-interaction
php artisan make:controller Admin/AssignTargetsController --invokable --no-interaction
php artisan make:controller Admin/ReshuffleTargetsController --invokable --no-interaction
php artisan make:controller Admin/ClearTargetsController --invokable --no-interaction
```

`AdminController::index()` — renders `admin/index` Inertia page with:
- `game` — `Game::current()`
- `users` — `User::query()->orderBy('name')->get([id, name, nickname, email, alive, is_admin, current_target_id, total_kills])`
- `targetRules` — `TargetRule::query()->with(['player1:id,name,nickname', 'player2:id,name,nickname'])->get()`

All action controllers redirect to `to_route('admin.index')` after their action.

### 6. Routes
Create `routes/admin.php`:
```php
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/',                              [AdminController::class, 'index'])->name('index');
    Route::patch('/game',                        UpdateGameController::class)->name('game.update');
    Route::patch('/users/{user}/alive',          ToggleUserAliveController::class)->name('users.toggleAlive');
    Route::patch('/users/{user}/admin',          ToggleUserAdminController::class)->name('users.toggleAdmin');
    Route::post('/target-rules',                 StoreTargetRuleController::class)->name('targetRules.store');
    Route::delete('/target-rules/{targetRule}',  DestroyTargetRuleController::class)->name('targetRules.destroy');
    Route::post('/assignment/assign',            AssignTargetsController::class)->name('assignment.assign');
    Route::post('/assignment/reshuffle',         ReshuffleTargetsController::class)->name('assignment.reshuffle');
    Route::post('/assignment/clear',             ClearTargetsController::class)->name('assignment.clear');
});
```
Add `require __DIR__.'/admin.php';` at bottom of `routes/web.php`.

---

## Phase 2 — Frontend

### 1. Install Tabs
```
npx shadcn@latest add tabs
```

### 2. Regenerate Wayfinder
```
php artisan wayfinder:generate
```

### 3. Update `resources/js/types/auth.ts`
Add to `User` type: `is_admin: boolean`, `alive: boolean`, `current_target_id: number | null`, `total_kills: number`, `killed_by: number | null`

### 4. Admin Page — `resources/js/pages/admin/index.tsx`
Single page with 4 tabs using `AppLayout` (sidebar layout, same as dashboard):

**Game tab** — `useForm` with Select (stage) + Checkbox (auth_open) + Save button. Submits to `UpdateGameController`.

**Players tab** — table of all users. Each row has two inline `<Form>` toggle buttons (alive/dead badge, admin toggle) using `ToggleUserAliveController.form({ user })` and `ToggleUserAdminController.form({ user })` with `preserveScroll: true`.

**Target Rules tab** — two sections:
- Rules table with delete button per row (`DestroyTargetRuleController.form({ targetRule })`)
- Create rule form using `useForm` with two `<Select>` dropdowns for player1/player2, submits to `StoreTargetRuleController`

**Assignment tab** — three buttons each wrapped in `<Dialog>` confirmation:
- "Assign Targets" → `AssignTargetsController.form()`
- "Reshuffle" → `ReshuffleTargetsController.form()`
- "Clear Targets" (destructive) → `ClearTargetsController.form()`

### 5. Admin link in sidebar
Edit `resources/js/components/app-sidebar.tsx` — add conditional Admin nav item gated on `auth.user.is_admin` from `usePage().props`.

---

## Phase 3 — Tests

```
php artisan make:test --pest Feature/Admin/AdminMiddlewareTest --no-interaction
php artisan make:test --pest Feature/Admin/GameManagementTest --no-interaction
php artisan make:test --pest Feature/Admin/PlayerManagementTest --no-interaction
php artisan make:test --pest Feature/Admin/TargetRuleTest --no-interaction
php artisan make:test --pest Feature/Admin/TargetAssignmentTest --no-interaction
```

Key test cases:
- Guests redirect to login, non-admins get 403, admins get 200
- Game update changes stage and auth_open, validates enum
- Toggle alive/admin flips the boolean
- Create/delete target rules, validates different player IDs
- Assign creates circular chain (every alive player targeted exactly once)
- Assignment respects TargetRules (player1 targets player2)
- Clear nullifies all current_target_id values

Reuse existing factory states: `User::factory()->admin()->profileCompleted()->create()`

---

## Files Modified
- `bootstrap/app.php` — add `admin` middleware alias
- `routes/web.php` — add `require admin.php`
- `app/Models/User.php` — add relationship methods
- `resources/js/types/auth.ts` — extend User type
- `resources/js/components/app-sidebar.tsx` — add admin nav item

## Verification
```bash
php artisan migrate
php artisan wayfinder:generate
vendor/bin/pint --dirty
php artisan test --compact tests/Feature/Admin/
npm run build
```
Then visit `/admin` logged in as an admin user and verify all four tabs work.
