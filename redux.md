# Redux Usage in Better Projects

## Overview

At Better Projects, we've implemented a hybrid state management approach that combines Redux Toolkit and React Query. This document explains our pattern, which we expect our engineers to understand and follow.

## State Management Philosophy

Our application distinguishes between two primary types of state:

1. **UI State** (Redux): Anything related to the user interface that doesn't come from the server
   - Dark mode preference
   - Sidebar expansion state
   - Filter criteria
   - Selected items
   - Search queries

2. **Server State** (React Query): Any data that comes from or needs to be synchronized with the server
   - Tasks and their details
   - Files
   - User data
   - Comments

## Why the Hybrid Approach?

### Redux Benefits
- **Centralized UI State**: Redux provides a single source of truth for UI-related state
- **Debugging**: Redux DevTools makes tracking state changes straightforward
- **Middleware Integration**: Simple integration with our analytics and logging systems
- **Cross-Component Communication**: Enabling components far apart in the component tree to interact

### React Query Benefits
- **Automatic Caching**: Built-in caching with intelligent invalidation
- **Background Refreshing**: Ability to keep data fresh without blocking UI
- **Loading/Error States**: Simplified handling of loading, error, and success states
- **Pagination & Infinite Scrolling**: First-class support for advanced data fetching patterns
- **Optimistic Updates**: Instant UI updates with server reconciliation
- **Prefetching**: Ability to preload data before it's needed

## Performance Considerations

Our hybrid approach significantly improves performance by:

1. **Minimizing Renders**: Redux selectors ensure components re-render only when necessary
2. **Reduced Network Traffic**: React Query's caching drastically reduces API calls
3. **Separation of Concerns**: UI state changes don't trigger unnecessary data refetching
4. **Progressive Loading**: Data is loaded only when needed and cached appropriately
5. **Optimistic Updates**: Users experience instant feedback while server operations happen in background

## Code Structure

- `/store/index.ts` - Redux store configuration
- `/store/slices/` - Feature-based Redux slices
  - `uiSlice.ts` - Dark mode, sidebar state, mobile menu
  - `taskSlice.ts` - Selected task, filters, search criteria

We keep our Redux store deliberately simple and focused on UI concerns. Most slices have fewer than 10 actions.

## Practical Example: Task Management

When a user interacts with our task board:

1. **Task Filtering**: Redux manages filter criteria, while React Query handles the actual data
2. **Task Selection**: When a user selects a task, we store the selection in Redux but fetch details with React Query
3. **Task Updates**: React Query handles mutations with automatic invalidation of affected queries

## What We Expect From Engineers

As a frontend engineer at Better Projects, you should:

1. **Understand the Distinction**: Know when to use Redux vs. React Query
2. **Follow the Pattern**: Place new state in the appropriate system
3. **Optimize Selectors**: Create memoized selectors that extract only what components need
4. **Query Keys**: Design thoughtful React Query keys that enable efficient invalidation
5. **Keep Redux Simple**: Avoid putting server data in Redux; use it primarily for UI state

Remember: Just because you can put something in Redux doesn't mean you should. We value performance and maintainability over dogmatic adherence to a single state management solution.