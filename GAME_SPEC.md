# Spoons Game — Full Specification

A campus-wide elimination game. Players are assigned secret targets to eliminate. Last player standing wins.

---

## Game Phases

### Phase 1: Sign-Up
- Players create accounts (email-restricted to your domain)
- Profile required: nickname, first/last name, phone, dorm/location, grade/year
- Sign-ups can be locked/unlocked by admins independently of game state

### Phase 2: Pre-Game
- Admins create target rules (constraints: "Player A must target Player B")
- Admins generate target assignments — a circular chain where each player targets exactly one other
- Assignments can be reshuffled or cleared before the game starts
- Manual accounts can be created for users who can't use the primary auth method

### Phase 3: Running
- Each player has exactly one target at all times
- To submit a kill:
  1. Player clicks their target's name on the target page
  2. A map opens — player clicks the location where the kill occurred
  3. Location must be within allowed bounds (campus perimeter)
  4. Player picks the date/time of the kill
  5. Player enters the **name of their target's next target** (proves they eliminated the correct person)
  6. On success: killer inherits victim's target; victim is marked dead
- Kill chain updates instantly — no gaps in the assignment chain

### Phase 4: Kill Resolution
- After a kill is submitted, the victim sees a notification
- Victim can **Approve** the kill (immediate confirmation)
- Victim can **Contest** the kill (flags it for admin review)
- Contested kills are resolved by admins

### Phase 5: Free-For-All (FFA) Mode
- Can be enabled by admins at any point, including mid-game
- Any alive player can target any other alive player
- No target chain — victim is selected from a dropdown of all alive players
- No next-target verification required
- All FFA kills require admin approval before counting
- Admins can revert (undo) any FFA kill

### Phase 6: Post-Game
- Admin ends the game
- Final leaderboard is frozen and displayed

---

## Kill Rules

- Kill location must be within defined geographic bounds (off-bounds = rejected)
- Kill submission is rate-limited (one kill per N minutes per player)
- In normal mode: player must verify their victim's next target by name
- In FFA mode: no verification required, but admin approval is mandatory
- Kills are stored with GPS coordinates, timestamp, killer ID, victim ID, and approval status

---

## Target Assignment Algorithm

1. Fetch all target rules from the database
2. Get all non-admin players
3. Shuffle the player list (Fisher-Yates)
4. Apply target rules: if a rule says "A targets B," reorder the array so B follows A
5. Create a circular chain: each player's target = the next player in the array; last player targets first
6. Validate the array has no duplicates or gaps
7. Persist all assignments to the database

---

## Admin Controls

| Action | Description |
|---|---|
| Start game | Verify assignments exist, set status to RUNNING |
| End game | Set status to POSTGAME |
| Reset game | Clear all kills, targets, player state; set status to PREGAME |
| Toggle FFA | Enable/disable free-for-all mode at any time |
| Toggle real names | Show/hide real names on the public leaderboard |
| Lock/unlock sign-ups | Control whether new players can register |
| Create target rules | Constrain who targets whom before assignment |
| Generate targets | Run the assignment algorithm |
| Reshuffle targets | Re-run assignment algorithm (clears existing) |
| Clear targets | Reset all target assignments |
| Create manual account | Add a player who can't use the normal auth flow |
| Approve FFA kill | Confirm a free-for-all kill |
| Revert FFA kill | Undo a kill, restore victim to alive |

---

## Player State

Each player has:
- `alive` / `dead` flag
- `currentTarget` — ID of their assigned target (null if FFA or dead)
- `totalKills` — count of confirmed kills
- `killedBy` — ID of the player who eliminated them
- `previousKills` — list of kill record IDs

---

## Kill Record

Each kill stores:
- Killer ID
- Victim ID
- GPS coordinates (lat/long)
- Timestamp
- `approved` (boolean) — admin or victim confirmed
- `contested` (boolean) — victim disputed the kill

---

## Game Configuration Keys

| Key | Values | Purpose |
|---|---|---|
| `status` | PREGAME, RUNNING, POSTGAME | Current game phase |
| `sign_ups_open` | yes / no | Allow new registrations |
| `ffa` | true / false | Free-for-all mode active |
| `show_real_names` | true / false | Show real names on leaderboard |

---

## Leaderboard Rules

- Visible to anyone (public)
- Admins/gamemasters are excluded
- Alive players shown first (sorted by kill count descending)
- Dead players shown below alive players
- Real names only shown when admin enables it AND user is authenticated
- Nicknames shown by default

---

## Authentication & Access Control

- Login restricted to a specific email domain
- Profile must be completed before participating
- Admin flag on user record gates all admin actions
- All admin API routes must verify the admin flag server-side
- Session includes: user ID, profile fields, game state (kills, target, alive status, gamemaster flag)

---

## Constraints & Edge Cases

- A player cannot target themselves
- Target rules take precedence over random shuffle
- If a player is the last alive, the game should be ended by admin
- Contested kills suspend the kill record — victim remains dead but kill is unconfirmed until admin resolves
- FFA kills that are reverted restore the victim to alive status and delete the kill record
- Rate limiting on kill submission prevents spam (recommended: 15 minutes between submissions)
- Off-campus kills must be rejected at the API level, not just client-side
