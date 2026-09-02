import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      setForm({
        email: '',
        password: ''
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Impossible de se connecter.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="login-email">Courriel</label>
      <input
        id="login-email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="etudiant@college.ca"
        required
      />

      <label htmlFor="login-password">Mot de passe</label>
      <input
        id="login-password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Votre mot de passe"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}