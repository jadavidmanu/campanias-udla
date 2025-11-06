# Design Guidelines: Campaign Management System

## Design Approach
**System-Based Approach**: Using a refined design system optimized for data management applications, drawing inspiration from Linear and Notion for clean, functional interfaces that prioritize usability and efficiency.

**Design Principles:**
- Function-first interface prioritizing data clarity and workflow efficiency
- Minimal cognitive load with clear visual hierarchy
- Consistent interaction patterns across all CRUD operations

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 220 100% 50% (Clean blue for primary actions)
- Background: 0 0% 98% (Soft off-white)
- Surface: 0 0% 100% (Pure white cards)
- Text Primary: 220 10% 15% (Deep charcoal)
- Text Secondary: 220 5% 45% (Medium gray)
- Border: 220 10% 90% (Light gray)

**Dark Mode:**
- Primary: 220 100% 60% (Slightly lighter blue)
- Background: 220 15% 8% (Deep navy background)
- Surface: 220 10% 12% (Dark cards)
- Text Primary: 0 0% 95% (Off-white)
- Text Secondary: 220 5% 65% (Light gray)
- Border: 220 10% 20% (Dark border)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: 600 weight, sizes from text-lg to text-2xl
- **Body Text**: 400 weight, text-sm for dense data, text-base for forms
- **Labels**: 500 weight, text-xs for table headers and form labels

### Layout System
**Spacing Primitives**: Consistent use of Tailwind units 2, 4, 6, and 8
- Tight spacing: p-2, m-2 for compact elements
- Standard spacing: p-4, m-4 for cards and sections  
- Generous spacing: p-6, m-6 for major layout divisions
- Large spacing: p-8, m-8 for page-level separation

### Component Library

**Navigation:**
- Clean horizontal navigation bar with subtle background
- Active state indicators using primary color
- Consistent spacing and typography hierarchy

**Data Tables:**
- Striped rows for better scanning (odd rows with subtle background tint)
- Hover states for row interactivity
- Action buttons grouped consistently on the right
- Sortable column headers with clear visual indicators

**Forms:**
- Grouped form sections with subtle borders
- Consistent input styling with focus states
- Dropdown selectors for campaign/ad group relationships
- Clear validation messaging with appropriate color coding

**Cards:**
- Subtle shadows for depth (shadow-sm)
- Rounded corners (rounded-lg)
- Clear content hierarchy within cards
- Consistent padding using spacing primitives

**Search & Filters:**
- Prominent search bar with subtle border styling
- Filter dropdowns that maintain visual consistency
- Clear active filter indicators

**Buttons:**
- Primary actions use primary color with appropriate contrast
- Secondary actions use outline style with border
- Destructive actions (delete) use red color scheme
- Consistent padding and typography across all button types

### Data Display Optimization
- Hierarchical relationship visualization through indentation and connecting lines
- Status indicators using subtle color coding
- Compact yet readable data presentation
- Clear separation between different data types (campaigns, ad groups, ads)

### Responsive Behavior
- Mobile-first approach with collapsible navigation
- Table overflow handling with horizontal scroll
- Form layout adaptation for smaller screens
- Maintained functionality across all viewport sizes

This design system ensures a professional, efficient interface optimized for campaign management workflows while maintaining visual consistency and user experience quality throughout the application.