"use strict";

// Function to generate unique ID for each note
function generateNoteId() {
    return `note-${Date.now()}`;
}

// Function to load the notes from local storage and display them
function loadNotes() {
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = ''; // Clear existing notes
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Get notes from local storage or empty array
    notes.forEach(note => {
        const noteElement = createNoteElement(note.id, note.title, note.content, note.timestamp);
        notesContainer.appendChild(noteElement);

        // Apply the appearing class to trigger the animation
        setTimeout(() => {
            noteElement.classList.add('note-appearing');
        }, 100);
    });
}

// Function to create a note element
function createNoteElement(id, title, content, timestamp) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note note-appearing';
    noteDiv.id = id;

    const noteTitle = document.createElement('input');
    noteTitle.className = 'title';
    noteTitle.type = 'text';
    noteTitle.value = title;
    noteTitle.placeholder = 'Title';
    noteTitle.onblur = () => saveNoteContent(id);

    const noteContent = document.createElement('textarea');
    noteContent.className = 'content';
    noteContent.value = content;
    noteContent.placeholder = 'Content';
    noteContent.onblur = () => saveNoteContent(id);

    const noteTimestamp = document.createElement('div');
    noteTimestamp.className = 'timestamp';
    noteTimestamp.textContent = `Created: ${new Date(timestamp).toLocaleString()}`;

    const deleteBtn = document.createElement('i');
    deleteBtn.className = 'fa-solid fa-trash';
    deleteBtn.onclick = () => deleteNoteHandler(id, noteDiv);

    noteDiv.appendChild(noteTitle);
    noteDiv.appendChild(noteContent);
    noteDiv.appendChild(noteTimestamp);
    noteDiv.appendChild(deleteBtn);

    return noteDiv;
}

// Function to delete a note with animation
function deleteNoteHandler(id, noteDiv) {
    noteDiv.classList.add('delete');
    noteDiv.addEventListener('animationend', () => {
        deleteNote(id);
        noteDiv.remove();
    });
}

// Function to save a new note
function newNote() {
    // Create a temporary note container for input
    const tempNoteId = generateNoteId();
    const tempNoteElement = createNoteElement(tempNoteId, '', '', Date.now());
    document.getElementById('notes').appendChild(tempNoteElement);

    const noteTitle = tempNoteElement.querySelector('.title');

    // Focus on the title input for the new note
    noteTitle.focus();

    // Save new note only if it has a title
    noteTitle.addEventListener('blur', () => {
        const title = noteTitle.value.trim();
        if (title === '') {
            tempNoteElement.remove();
        } else {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const note = { id: tempNoteId, title, content: '', timestamp: Date.now() };
            notes.push(note);
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes(); // Reload notes to include the new note
        }
    });
}

// Function to save the content of a note
function saveNoteContent(id) {
    const noteDiv = document.getElementById(id);
    const title = noteDiv.querySelector('.title').value;
    const content = noteDiv.querySelector('.content').value;
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

// Function to delete a note
function deleteNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(filteredNotes));
    loadNotes(); // Reload notes to reflect the deletion
}

// Function to toggle between light and dark themes
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

// Function to load the theme from local storage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');
}

// Function to search notes by title or content
function searchNotes() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const notes = document.querySelectorAll('.note');

    notes.forEach(note => {
        const title = note.querySelector('.title').value.toLowerCase();
        const content = note.querySelector('.content').value.toLowerCase();
        if (title.includes(searchInput) || content.includes(searchInput)) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
}

// Load notes and theme when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadNotes();
});
