# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bucket List** is a client-side, vanilla JavaScript web application. It requires no build tools, bundlers, or package managers. The app runs directly in the browser by opening `index.html`.

- **No build process**: Static files served as-is
- **No npm/dependencies**: All CSS via Tailwind CDN
- **No testing framework**: Manual testing in browser
- **No linting**: Plain JavaScript

## Architecture

### Two-Module Design

The codebase intentionally separates concerns into two modules:

1. **`js/storage.js` — Data Layer**
   - Manages all LocalStorage operations
   - Pure data CRUD: `addItem()`, `updateItem()`, `deleteItem()`
   - Stateless, testable functions
   - Handles the data model: `{id, title, completed, createdAt, completedAt}`
   - Returns filtered lists and computed stats

2. **`js/app.js` — Presentation Layer**
   - `BucketListApp` class handles DOM manipulation and user interaction
   - Owns event binding, rendering, and state display
   - Calls `BucketStorage` methods to persist changes
   - No direct LocalStorage access — delegates to storage module

### Data Flow

User Action → App Event Handler → Storage CRUD → Storage.save(localStorage) → App.render() → DOM Updated

Example: User clicks "add item" → `handleAdd()` → `BucketStorage.addItem()` → saves to localStorage → `render()` updates the list display.

## Running & Testing

### Open in Browser

```bash
# Windows: Direct file open
start index.html

# macOS: Direct file open
open index.html

# Or use any local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Manual Testing Checklist

- **Add item**: Type text, press Enter or click "추가"
- **Toggle complete**: Click checkbox, verify strikethrough and stat updates
- **Edit item**: Click "수정" button, change text in modal, verify changes persist
- **Delete item**: Click "삭제", confirm deletion
- **Filter tabs**: Click "전체", "진행중", "완료" — verify list updates
- **Refresh**: Close and reopen browser (or press F5) — data should persist in LocalStorage
- **Empty state**: Delete all items — verify empty message appears

### XSS Prevention

The `escapeHtml()` method in `app.js` prevents injection attacks. Always use it when rendering user input in HTML (already implemented in `createBucketItemHTML()`).

## Key Files to Understand

| File | Purpose |
|------|---------|
| `index.html` | Single-page layout, stats dashboard, form, filter buttons, modal |
| `js/storage.js` | LocalStorage abstraction, data CRUD, filtering, stats calculation |
| `js/app.js` | UI rendering, event handling, DOM lifecycle |
| `css/styles.css` | Animations, responsive mobile breakpoints, dark mode media queries |

## Important Design Decisions

1. **No framework**: Vanilla JS keeps the bundle size zero and learning curve flat
2. **Class-based App**: Single `BucketListApp` instance manages all UI state
3. **Full re-render on change**: After any CRUD operation, call `render()` to update stats and list display (simple, effective for small datasets)
4. **Timestamp-based IDs**: `id: Date.now().toString()` provides unique, sortable IDs without a server
5. **ISO 8601 timestamps**: `createdAt` and `completedAt` use `.toISOString()` for consistent storage and display
6. **Modal for editing**: Dedicated modal dialog keeps edit flow separate from list view

## Common Modifications

**Add a new field to items:**
1. Update data model in `storage.js` → `addItem()` 
2. Add rendering logic in `app.js` → `createBucketItemHTML()`

**Add a new filter:**
1. Add filter button in `index.html`
2. Update `currentFilter` in `app.js`
3. Add case in `storage.js` → `getFilteredList()`

**Styling changes:**
1. Tailwind utility classes in `index.html` (preferred)
2. Custom CSS in `css/styles.css` for animations, responsive breakpoints

## Browser Compatibility

Works in all modern browsers with LocalStorage support (Chrome, Firefox, Safari, Edge). Uses ES6+ (arrow functions, template literals, `const`/`let`).

## Persistence

All data lives in `localStorage.bucketList` as a JSON string. Exceeding the 5–10 MB limit is unlikely for typical bucket lists, but no cleanup logic exists — users can only clear via browser DevTools or explicit delete buttons.
