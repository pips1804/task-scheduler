<template>
  <div class="py-4 px-4 sm:px-6 max-w-screen-xl mx-auto">
    <!-- Header Section -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <!-- Title and Description -->
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          My Notes
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Jot down ideas, summaries, or anything you want to remember.
        </p>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div class="relative inline-block w-48">
          <select
            v-model="sortOption"
            class="appearance-none w-full text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none pr-10"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>

          <!-- Lucide Icon (e.g., ChevronDown) -->
          <ChevronDown
            class="w-4 h-4 text-gray-500 dark:text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
        </div>

        <button
          @click="addNote"
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition"
        >
          <Plus class="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>
    </div>

    <!-- Notes Grid -->
    <div
      class="flex-1 overflow-y-auto px-4 sm:px-6 max-w-screen-xl mx-auto pb-6"
    >
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="note in sortedNotes"
          :key="note.id"
          @click="openModal(note)"
          class="relative group p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer"
          :style="{ backgroundColor: note.color || 'rgba(255,255,255,0.7)' }"
        >
          <h3
            class="font-semibold text-base mb-1 line-clamp-1 text-gray-800 dark:text-white"
          >
            {{ note.title || "Untitled" }}
          </h3>

          <div
            class="prose dark:prose-invert text-sm line-clamp-3"
            v-html="note.content"
          />

          <!-- Tags -->
          <div class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="tag in note.tags"
              :key="tag"
              class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-2 py-0.5"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Delete Button -->
          <button
            @click.stop="deleteNote(note.id)"
            class="absolute top-2 right-2 p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="notes.length === 0" class="text-center py-20">
      <div
        class="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
      >
        <BookOpen class="w-8 h-8 text-blue-500" />
      </div>
      <h3 class="font-semibold text-gray-800 dark:text-white mb-2">
        No notes yet
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Click "Add Note" to start writing.
      </p>
    </div>
  </div>

  <!-- Modal -->
  <div
    v-if="expandedNote"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-xl w-full p-6 relative"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
      >
        ✕
      </button>

      <!-- Tags Input -->
      <input
        v-model="expandedNote.tagsString"
        @blur="handleTagsUpdate"
        placeholder="Tags (comma-separated)"
        class="mb-3 w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-700 outline-none text-gray-700 dark:text-gray-300 placeholder:text-gray-400"
      />

      <!-- Color Picker -->
      <select
        v-model="expandedNote.color"
        @change="updateNote(expandedNote)"
        class="w-full mb-4 bg-transparent text-sm border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
      >
        <option value="">Default Color</option>
        <option value="#FCD34D">Yellow</option>
        <option value="#F87171">Red</option>
        <option value="#34D399">Green</option>
        <option value="#60A5FA">Blue</option>
      </select>

      <!-- Title -->
      <input
        v-model="expandedNote.title"
        @blur="updateNote(expandedNote)"
        type="text"
        placeholder="Note title"
        class="w-full mb-4 text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none text-gray-800 dark:text-white"
      />

      <!-- Rich Editor -->
      <QuillEditor
        v-model:content="expandedNote.content"
        contentType="html"
        @blur="updateNote(expandedNote)"
        theme="snow"
        class="custom-quill"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuth } from "../composables/useAuth";
import { useNotes } from "../composables/useNote";
import { Plus, Trash2, BookOpen, ChevronDown } from "lucide-vue-next";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const { currentUser } = useAuth();
const { notes, addNote, deleteNote, updateNote } = useNotes(currentUser);

const expandedNoteId = ref(null);

const expandedNote = ref(null);

const openModal = (note) => {
  expandedNote.value = {
    ...note,
    tagsString: (note.tags || []).join(", "),
  };
};

const closeModal = () => {
  expandedNote.value = null;
};

const handleTagsUpdate = () => {
  expandedNote.value.tags = expandedNote.value.tagsString
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  updateNote(expandedNote.value);
};

const sortOption = ref("createdAt");

const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => {
    if (sortOption.value === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
  });
});
</script>

<style scoped>
::v-deep(.custom-quill .ql-editor) {
  min-height: 16rem; /* Adjust as needed (e.g., h-64) */
  padding: 1rem;
  font-size: 0.875rem; /* text-sm */
}
</style>
