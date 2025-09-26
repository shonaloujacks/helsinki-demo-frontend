import loginService from './services/login'
import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import "./index.css";
import Footer from "./components/Footer";
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm';
import LogoutForm from './components/LogoutForm';
import Togglable from './components/Togglable';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const getAllNotes = async () => {
      const returnedNotes = await noteService.getAll();
      setNotes(returnedNotes);
    };
    getAllNotes();
  }, []);


   useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    const returnedNote = await noteService.create(noteObject);
    setNotes(notes.concat(returnedNote));
  };


  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = async (id) => {
    const note = notes.find((note) => note.id === id);
    try {
      const changedNote = { ...note, important: !note.important };
      const returnedNote = await noteService.update(id, changedNote);
      setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
    } catch {
      setErrorMessage(
        `The note '${note.content}' was already deleted from the server`
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handleLogin = async ({ username, password }) => {

   try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
      console.log("Logged in user:", user) 
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    
    window.localStorage.removeItem('loggedNoteappUser')
    noteService.setToken(null)
    setUser('')
    console.log("Logged out user:", user)
  }

   const loginForm = () => (
    <Togglable 
      buttonLabel="login">
      <LoginForm
        onLogin={handleLogin}
      />
    </Togglable>
  )

  const noteFormRef = useRef()

  const noteForm = () => (
    <Togglable 
      buttonLabel="new note" ref={noteFormRef}>
      <NoteForm
        createNote={addNote}
      />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div> 
          <p>{user.name} logged in </p> 
          {noteForm()}  
          </div> 
        )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <div>{user && (   
        <LogoutForm 
          handleLogout={handleLogout}/>)} </div>
      <Footer />
    </div>
  );
};

export default App;
