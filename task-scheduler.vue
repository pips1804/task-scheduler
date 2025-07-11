<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-300">
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <!-- Authentication Page -->
      <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-2">Task Scheduler</h1>
            <p class="text-gray-600 dark:text-gray-400">Organize your tasks efficiently</p>
          </div>
          
          <div class="space-y-4">
            <button
              @click="showLoginModal = true"
              class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Login
            </button>
            <button
              @click="showSignupModal = true"
              class="w-full border border-gray-300 dark:border-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <!-- Main App -->
      <div v-else class="flex flex-col lg:flex-row min-h-screen">
        <!-- Header (Mobile) -->
        <div class="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <button
            @click="showMobileSidebar = !showMobileSidebar"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-bold">Task Scheduler</h1>
          <div class="flex items-center space-x-2">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sun v-if="isDarkMode" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            <button
              @click="logout"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Sidebar -->
        <div :class="[
          'lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col',
          showMobileSidebar ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:flex'
        ]">
          <!-- Desktop Header -->
          <div class="hidden lg:flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-2xl font-bold">Task Scheduler</h1>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleDarkMode"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Sun v-if="isDarkMode" class="w-5 h-5" />
                <Moon v-else class="w-5 h-5" />
              </button>
              <button
                @click="logout"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Mobile Close Button -->
          <div class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold">Subjects</h2>
            <button
              @click="showMobileSidebar = false"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Subjects -->
          <div class="flex-1 p-4 lg:p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold hidden lg:block">Subjects</h2>
              <button
                @click="showSubjectModal = true"
                class="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <Plus class="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="subject in subjects"
                :key="subject.id"
                :class="[
                  'p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedSubject?.id === subject.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
                @click="selectSubject(subject)"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ subject.name }}</span>
                  <div class="flex items-center space-x-1">
                    <span class="text-sm opacity-75">{{ getTaskCount(subject.id) }}</span>
                    <button
                      @click.stop="deleteSubject(subject.id)"
                      class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
          <div v-if="selectedSubject" class="flex-1 p-4 lg:p-6">
            <!-- Subject Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 class="text-2xl font-bold">{{ selectedSubject.name }}</h2>
              <button
                @click="showTaskModal = true"
                class="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <Plus class="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            <!-- Kanban Board -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                v-for="column in columns"
                :key="column.id"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <h3 class="font-semibold mb-4 flex items-center space-x-2">
                  <component :is="column.icon" class="w-5 h-5" />
                  <span>{{ column.title }}</span>
                  <span class="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                    {{ getTasksByStatus(column.id).length }}
                  </span>
                </h3>

                <div
                  class="space-y-3 min-h-[200px]"
                  @drop="onDrop($event, column.id)"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div
                    v-for="task in getTasksByStatus(column.id)"
                    :key="task.id"
                    :class="[
                      'bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border cursor-move transition-all hover:shadow-md',
                      isTaskOverdue(task) ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
                    ]"
                    draggable="true"
                    @dragstart="onDragStart($event, task)"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-medium text-sm">{{ task.name }}</h4>
                      <div class="flex items-center space-x-1">
                        <button
                          @click="editTask(task)"
                          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Edit class="w-3 h-3" />
                        </button>
                        <button
                          @click="deleteTask(task.id)"
                          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Trash2 class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">{{ task.description }}</p>
                    
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Calendar class="w-3 h-3" />
                        <span>{{ formatDate(task.deadline) }}</span>
                      </div>
                      <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Clock class="w-3 h-3" />
                        <span>{{ formatTime(task.deadline) }}</span>
                      </div>
                    </div>
                    
                    <div v-if="isTaskOverdue(task)" class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                      Overdue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex-1 flex items-center justify-center p-6">
            <div class="text-center">
              <h3 class="text-xl font-semibold mb-2">No Subject Selected</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Select a subject from the sidebar to view tasks</p>
              <button
                @click="showSubjectModal = true"
                class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Create Your First Subject
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Login Modal -->
      <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Login</h3>
            <button @click="showLoginModal = false" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <form @submit.prevent="login" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <!-- Signup Modal -->
      <div v-if="showSignupModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Sign Up</h3>
            <button @click="showSignupModal = false" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <form @submit.prevent="signup" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input
                v-model="signupForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input
                v-model="signupForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <input
                v-model="signupForm.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <!-- Subject Modal -->
      <div v-if="showSubjectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Add Subject</h3>
            <button @click="showSubjectModal = false" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <form @submit.prevent="addSubject" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Subject Name</label>
              <input
                v-model="subjectForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., Mathematics, Science"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Add Subject
            </button>
          </form>
        </div>
      </div>

      <!-- Task Modal -->
      <div v-if="showTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">{{ editingTask ? 'Edit Task' : 'Add Task' }}</h3>
            <button @click="closeTaskModal" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <form @submit.prevent="saveTask" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Task Name</label>
              <input
                v-model="taskForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter task name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Description</label>
              <textarea
                v-model="taskForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter task description"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Deadline</label>
              <input
                v-model="taskForm.deadline"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {{ editingTask ? 'Update Task' : 'Add Task' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { 
  Plus, Calendar, Clock, Edit, Trash2, Sun, Moon, LogOut, Menu, X,
  Circle, RotateCcw, CheckCircle
} from 'lucide-vue-next'

// Reactive state
const isAuthenticated = ref(false)
const isDarkMode = ref(false)
const showLoginModal = ref(false)
const showSignupModal = ref(false)
const showSubjectModal = ref(false)
const showTaskModal = ref(false)
const showMobileSidebar = ref(false)
const editingTask = ref(null)

const currentUser = ref(null)
const subjects = ref([])
const tasks = ref([])
const selectedSubject = ref(null)

// Forms
const loginForm = reactive({
  email: '',
  password: ''
})

const signupForm = reactive({
  name: '',
  email: '',
  password: ''
})

const subjectForm = reactive({
  name: ''
})

const taskForm = reactive({
  name: '',
  description: '',
  deadline: ''
})

// Kanban columns
const columns = [
  { id: 'todo', title: 'To Do', icon: Circle },
  { id: 'inprogress', title: 'In Progress', icon: RotateCcw },
  { id: 'completed', title: 'Completed', icon: CheckCircle }
]

// Computed properties
const getTaskCount = (subjectId) => {
  return tasks.value.filter(task => task.subjectId === subjectId).length
}

const getTasksByStatus = (status) => {
  if (!selectedSubject.value) return []
  return tasks.value.filter(task => 
    task.subjectId === selectedSubject.value.id && task.status === status
  )
}

// Authentication methods
const login = () => {
  // Mock authentication
  const users = JSON.parse(localStorage.getItem('taskSchedulerUsers') || '[]')
  const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password)
  
  if (user) {
    currentUser.value = user
    isAuthenticated.value = true
    showLoginModal.value = false
    loadUserData()
    loginForm.email = ''
    loginForm.password = ''
  } else {
    alert('Invalid credentials')
  }
}

const signup = () => {
  // Mock user registration
  const users = JSON.parse(localStorage.getItem('taskSchedulerUsers') || '[]')
  
  if (users.find(u => u.email === signupForm.email)) {
    alert('User already exists')
    return
  }
  
  const newUser = {
    id: Date.now().toString(),
    name: signupForm.name,
    email: signupForm.email,
    password: signupForm.password
  }
  
  users.push(newUser)
  localStorage.setItem('taskSchedulerUsers', JSON.stringify(users))
  
  currentUser.value = newUser
  isAuthenticated.value = true
  showSignupModal.value = false
  
  signupForm.name = ''
  signupForm.email = ''
  signupForm.password = ''
}

const logout = () => {
  currentUser.value = null
  isAuthenticated.value = false
  subjects.value = []
  tasks.value = []
  selectedSubject.value = null
  showMobileSidebar.value = false
}

// Subject methods
const addSubject = () => {
  const newSubject = {
    id: Date.now().toString(),
    name: subjectForm.name,
    userId: currentUser.value.id
  }
  
  subjects.value.push(newSubject)
  saveUserData()
  showSubjectModal.value = false
  subjectForm.name = ''
  
  if (!selectedSubject.value) {
    selectedSubject.value = newSubject
  }
}

const selectSubject = (subject) => {
  selectedSubject.value = subject
  showMobileSidebar.value = false
}

const deleteSubject = (subjectId) => {
  if (confirm('Are you sure you want to delete this subject and all its tasks?')) {
    subjects.value = subjects.value.filter(s => s.id !== subjectId)
    tasks.value = tasks.value.filter(t => t.subjectId !== subjectId)
    
    if (selectedSubject.value?.id === subjectId) {
      selectedSubject.value = subjects.value[0] || null
    }
    
    saveUserData()
  }
}

// Task methods
const saveTask = () => {
  if (editingTask.value) {
    // Update existing task
    const taskIndex = tasks.value.findIndex(t => t.id === editingTask.value.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = {
        ...tasks.value[taskIndex],
        name: taskForm.name,
        description: taskForm.description,
        deadline: taskForm.deadline
      }
    }
  } else {
    // Add new task
    const newTask = {
      id: Date.now().toString(),
      name: taskForm.name,
      description: taskForm.description,
      deadline: taskForm.deadline,
      status: 'todo',
      subjectId: selectedSubject.value.id,
      userId: currentUser.value.id
    }
    
    tasks.value.push(newTask)
  }
  
  saveUserData()
  closeTaskModal()
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.name = task.name
  taskForm.description = task.description
  taskForm.deadline = task.deadline
  showTaskModal.value = true
}

const deleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    saveUserData()
  }
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
  taskForm.name = ''
  taskForm.description = ''
  taskForm.deadline = ''
}

// Drag and drop methods
const onDragStart = (event, task) => {
  event.dataTransfer.setData('text/plain', task.id)
}

const onDrop = (event, newStatus) => {
  const taskId = event.dataTransfer.getData('text/plain')
  const task = tasks.value.find(t => t.id === taskId)
  
  if (task) {
    task.status = newStatus
    saveUserData()
  }
}

// Utility methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const isTaskOverdue = (task) => {
  return new Date(task.deadline) < new Date() && task.status !== 'completed'
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('taskSchedulerDarkMode', isDarkMode.value.toString())
}

// Data persistence
const saveUserData = () => {
  if (!currentUser.value) return
  
  const userData = {
    subjects: subjects.value,
    tasks: tasks.value
  }
  
  localStorage.setItem(`taskSchedulerData_${currentUser.value.id}`, JSON.stringify(userData))
}

const loadUserData = () => {
  if (!currentUser.value) return
  
  const userData = JSON.parse(localStorage.getItem(`taskSchedulerData_${currentUser.value.id}`) || '{}')
  
  subjects.value = userData.subjects || []
  tasks.value = userData.tasks || []
  
  if (subjects.value.length > 0 && !selectedSubject.value) {
    selectedSubject.value = subjects.value[0]
  }
}

// Lifecycle
onMounted(() => {
  // Load dark mode preference
  const savedDarkMode = localStorage.getItem('taskSchedulerDarkMode')
  if (savedDarkMode) {
    isDarkMode.value = savedDarkMode === 'true'
  }
  
  // Check for saved authentication
  const savedUser = localStorage.getItem('taskSchedulerCurrentUser')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
    isAuthenticated.value = true
    loadUserData()
  }
})

// Watch for user changes to persist current user
watch(currentUser, (newUser) => {
  if (newUser) {
    localStorage.setItem('taskSchedulerCurrentUser', JSON.stringify(newUser))
  } else {
    localStorage.removeItem('taskSchedulerCurrentUser')
  }
}, { deep: true })
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Mobile touch improvements */
@media (max-width: 1024px) {
  .cursor-move {
    cursor: grab;
  }
  
  .cursor-move:active {
    cursor: grabbing;
  }
}

/* Hover effects for better UX */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
