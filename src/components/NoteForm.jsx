  
  const NoteForm = ({ addNote, newNote, handleNoteChange }) => {
    console.log("NoteForm rendered")
    return (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
    

  )}
  
  export default NoteForm