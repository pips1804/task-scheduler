# Vue StopCrammin'

A modern, mobile-responsive StopCrammin' web application built with Vue.js 3, Tailwind CSS, and Lucide Vue icons.

## Features

### 🔐 Authentication

- Simple login/signup system with localStorage
- User session persistence
- Mock authentication for demo purposes

### 📚 Subject Management

- Create and organize subjects (Math, Science, etc.)
- Subject-based task organization
- Delete subjects with confirmation

### ✅ Task Management

- Create, edit, and delete tasks
- Task details: name, description, deadline
- Overdue task highlighting
- Task count per subject

### 📋 Kanban Board

- Three columns: To Do, In Progress, Completed
- Drag and drop functionality
- Visual task status management
- Responsive card layout

### 🎨 Modern UI/UX

- Black and white color palette
- Light/dark mode toggle
- Smooth animations and transitions
- Mobile-responsive design
- Lucide Vue icons throughout

### 📱 Mobile Responsive

- Collapsible sidebar for mobile
- Touch-friendly interactions
- Responsive breakpoints
- Mobile-optimized modals

### 💾 Data Persistence

- localStorage for data storage
- User-specific data separation
- Settings persistence

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue** - Beautiful icon library
- **Composition API** - Modern Vue development

## Project Structure

\`\`\`
src/
├── components/ # Vue components
│ ├── AuthPage.vue # Authentication page
│ ├── MainContent.vue # Main content area
│ ├── Sidebar.vue # Subject sidebar
│ ├── KanbanColumn.vue # Kanban column
│ ├── TaskCard.vue # Individual task card
│ ├── TaskModal.vue # Task creation/editing modal
│ └── SubjectModal.vue # Subject creation modal
├── composables/ # Vue composables
│ ├── useAuth.js # Authentication logic
│ ├── useTheme.js # Theme management
│ ├── useSubjects.js # Subject management
│ ├── useTasks.js # Task management
│ └── useKanban.js # Kanban functionality
├── App.vue # Root component
├── main.js # Application entry point
└── style.css # Global styles
\`\`\`

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd vue-task-scheduler
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Create Subjects**: Add subjects like "Mathematics", "Science", etc.
3. **Add Tasks**: Create tasks with names, descriptions, and deadlines
4. **Manage Tasks**: Drag tasks between columns (To Do, In Progress, Completed)
5. **Dark Mode**: Toggle between light and dark themes
6. **Mobile**: Use the app seamlessly on mobile devices

## Features in Detail

### Authentication System

- Mock authentication using localStorage
- User registration and login
- Session persistence across browser sessions

### Subject Organization

- Create unlimited subjects
- Each subject contains its own tasks
- Visual task count per subject
- Easy subject deletion with confirmation

### Task Management

- Rich task creation with name, description, and deadline
- Visual deadline indicators
- Overdue task highlighting
- Easy task editing and deletion

### Kanban Board

- Intuitive drag-and-drop interface
- Three status columns for task progression
- Visual task cards with all relevant information
- Responsive design for all screen sizes

### Responsive Design

- Mobile-first approach
- Collapsible sidebar for mobile devices
- Touch-friendly interactions
- Optimized layouts for different screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
