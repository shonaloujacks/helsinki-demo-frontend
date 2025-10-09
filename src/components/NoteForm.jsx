import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <label htmlFor='note-input'>Note content:
          <input
            id='note-input'
            value={newNote}
            onChange={event => setNewNote(event.target.value)}
          />
        </label>
        <button style={{ marginLeft: '10px' }} type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm