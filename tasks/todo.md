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
- [x] Update App.tsx: Import AlertCircle and Clock icons
- [x] Replace '⚠ ' emoji with AlertCircle icon in overdue due-date display
- [x] Replace '⏰ ' emoji with Clock icon in due-soon due-date display
- [x] Run npm build to verify no errors
- [x] Run npm lint to verify code quality
- [x] Update Review section with verification

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
- Basic accessibility review completed: aria-labels and semantic HTML maintained; destructive button colors updated to #b91c1c for WCAG AA compliance with enhanced hover/focus states
- Build and lint pass without errors
- Mobile responsive design maintained (icons scale appropriately with existing responsive CSS)

## Additional Changes (AlertCircle and Clock icons)

### Tests Run
- `npm run build`: Successful. No TypeScript or build errors. Build output: vite v7.3.1, 1743 modules transformed, rendering chunks, built in 950ms
- `npm run lint`: Successful. No ESLint errors or warnings

### Changes Summary

**Files Modified:**
1. `client/src/App.tsx`
   - Updated import (line 3): Added `AlertCircle, Clock` to lucide-react imports
   - Due-date display (lines 243-244):
     - Replaced '⚠ ' emoji with `<AlertCircle size={16} className="inline" />` for overdue status
     - Replaced '⏰ ' emoji with `<Clock size={16} className="inline" />` for due-soon status

### Verification
- AlertCircle and Clock icons are properly imported from lucide-react
- Both icons use size={16} for consistency with other inline icons
- className="inline" ensures proper inline display with surrounding text
- Icons render correctly without breaking layout or text flow
- No changes made to existing button icon implementations (Plus, Trash2)
- TypeScript compilation successful with no type errors
- ESLint validation passed with no warnings
- Build completes successfully in 950ms

## Final Styling Refinement for Clear All Button (SCRUM-16)

### Changes Made
1. Updated `client/src/App.tsx` (line 272): Changed button label from "Clear done" to "Clear All"
2. Updated `client/src/App.css` (lines 281-303):
   - Changed `.secondary--destructive` background from light pink (#fee2e2) to prominent red (#dc2626)
   - Changed text color from dark red (#b91c1c) to white (#ffffff)
   - Updated border color to #b91c1c
   - Enhanced hover state: darker red background (#b91c1c) with translateY transform
   - Updated focus outline to dark red (#7f1d1d)
   - Updated disabled state colors for better contrast

### Tests Run
- `npm run build`: Successful. Build output: vite v7.3.1, 1743 modules transformed, built in 916ms
- `npm run lint`: Successful. No ESLint errors or warnings

### Verification
- Clear All button now has visually prominent red background (#dc2626) with white text
- Icon alignment maintained with .button-with-icon flexbox styling
- Hover and focus states provide proper visual feedback
- Disabled state styling ensures visibility when button is disabled
- All icon implementations remain intact (Plus, Trash2, ListTodo, Circle, CheckCircle, AlertCircle, Clock)
- Button text properly aligned with Trash2 icon (18px) using gap property
- TypeScript and ESLint validation successful
- Build completes successfully
