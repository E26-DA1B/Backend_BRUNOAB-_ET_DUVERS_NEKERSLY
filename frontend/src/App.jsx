import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';

export default function App() {
  const { user, logout, isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCourses = () => {
    setRefreshKey((currentKey) => currentKey + 1);
  };

  return (
    <div className="app">
      <header className="site-header">
        <div>
          <p className="eyebrow">Service Web · Laboratoire 2</p>
          <h1>Mini-Moodle</h1>
        </div>

        {isAuthenticated && (
          <div className="user-area">
            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={logout}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Académie en ligne</p>
            <h2>Apprendre, enseigner et progresser.</h2>
            <p>
              Consultez les cours disponibles et connectez-vous
              pour accéder aux actions protégées.
            </p>
          </div>
        </section>

        {!isAuthenticated && (
          <section className="auth-section">
            <LoginForm />
            <RegisterForm />
          </section>
        )}

        {isAuthenticated && user.role === 'FORMATEUR' && (
          <CourseForm onCourseCreated={refreshCourses} />
        )}

        {isAuthenticated && user.role === 'ETUDIANT' && (
          <p className="connected-message">
            Vous êtes connecté comme étudiant. Vous pouvez
            consulter les cours disponibles.
          </p>
        )}

        <CourseList refreshKey={refreshKey} />
      </main>

      <footer>
        Mini-Moodle · Service Web · Groupe 25604
      </footer>
    </div>
  );
}