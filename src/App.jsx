import loginService from './services/login'
import { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import "./index.css";
import Footer from "./components/Footer";
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm';
import LogoutForm from './components/LogoutForm';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
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


  const addNote = async (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    const returnedNote = await noteService.create(noteObject);
    setNotes(notes.concat(returnedNote));
    setNewNote("");
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
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

  const handleLogin = async event => {
    event.preventDefault()
    
   try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
      console.log("Logged in user:", user) 
      setUsername('')
      setPassword('')
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

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && ( 
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        setUsername={setUsername}
        setPassword={setPassword} /> 
      )}
      {user && (
        <div> 
          <p>{user.name} logged in </p> 
          <NoteForm 
          addNote={addNote}
          newNote={newNote}
          handleNoteChange={handleNoteChange}
          /> 
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
