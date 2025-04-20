
# React Bug Squash Interview Challenge

This project is designed as a technical challenge for senior React developer interviews. It contains a small but realistic React application with intentionally placed bugs that candidates need to identify and fix.

## Project Overview

This is a data table application featuring:

- Paginated data display
- Search and filter functionality
- Settings panel to customize the UI
- Intentional bugs of varying difficulty

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install dependencies:
```
npm install
```

### Running the Application

Start the development server:
```
npm run dev
```

This will start the application at `http://localhost:8080`.

### Running Tests

Run the test suite:
```
npm test
```

Some tests will fail due to intentional bugs in the code.

## The Challenge

This application contains several intentional bugs that need to be fixed:

- Pagination issues
- Performance problems due to unnecessary renders
- State management bugs
- Missing optimizations
- And more...

Your task is to:

1. Identify as many bugs as possible
2. Fix the issues in a clean, maintainable way
3. Make failing tests pass
4. Explain your thought process and fixes

## Bug Difficulty Levels

Bugs range from:
- **Easy**: Simple fixes like off-by-one errors
- **Medium**: Fixing improper React patterns like direct state mutations
- **Hard**: Identifying and fixing performance issues and stale closures

## Tips

- Use React DevTools to identify performance bottlenecks
- Pay attention to React hooks and their dependencies
- Look for state management issues
- Check if functions are recreated unnecessarily
- Observe how contexts are set up and used

Good luck!
