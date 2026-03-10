# SCRUM-16: Add lucide-react icons to improve look and feel

## Tasks
- [x] Install lucide-react package
- [x] Update App.tsx: Import icons (Plus, Trash2, ListTodo, Circle, CheckCircle)
- [x] Update App.tsx: Add Plus icon to Add button
- [x] Update App.tsx: Add Trash2 icon to Remove buttons
- [x] Update App.tsx: Add Trash2 icon to Clear done button
- [x] Update App.tsx: Add icons to filter buttons (ListTodo, Circle, CheckCircle)
- [x] Update App.css: Add icon+text alignment styles to buttons
- [x] Update App.css: Add destructive styling for Clear done button
- [x] Run npm build to verify no errors
- [x] Verify all changes with manual testing

## Review

### Tests Run
- `npm run build`: Successful. No TypeScript or build errors. Build output: vite v7.3.1, 1743 modules transformed, built in 983ms
- `npm run lint`: Successful. No ESLint errors or warnings

### Changes Summary

**Files Modified:**
1. `client/src/App.tsx`
   - Added import: `import { Plus, Trash2, ListTodo, Circle, CheckCircle } from 'lucide-react'`
   - Add button (line 175): Added `<Plus size={18} />` icon with `.button-with-icon` class
   - Filter buttons (lines 183-207): Added icon logic with `ListTodo` (All), `Circle` (Active), `CheckCircle` (Done) at size 16px with `.button-with-icon` and `.filter-button` classes
   - Remove button (line 254-262): Added `<Trash2 size={16} />` icon with `.button-with-icon` class
   - Clear done button (line 271-279): Added `<Trash2 size={18} />` icon with `.button-with-icon` and `.secondary--destructive` classes

2. `client/src/App.css`
   - Added `.button-with-icon` class (lines 98-102): `display: inline-flex; align-items: center; gap: 0.4rem;` for proper icon+text alignment
   - Added `.filter-button` class (lines 150-152): Reduces gap to `0.3rem` for compact filter button appearance
   - Added `.secondary--destructive` class (lines 281-285): Red styling with `color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca;` for destructive action visual feedback

### Verification
- All icons are properly imported from lucide-react
- Icon sizes are appropriate: 18px for main buttons, 16px for filter buttons and remove buttons
- Icons and text are aligned horizontally using flexbox with proper gaps
- Destructive button (Clear done) has red color scheme matching the error palette
- All TypeScript types are correct
- Basic accessibility review completed: aria-labels and semantic HTML maintained; note that destructive button colors may need further contrast review
- Build and lint pass without errors
- Mobile responsive design maintained (icons scale appropriately with existing responsive CSS)
