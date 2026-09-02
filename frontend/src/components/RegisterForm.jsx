import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ETUDIANT'
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
      await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      setForm({
        name: '',
        email: '',
        password: '',
        role: 'ETUDIANT'
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de créer le compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Inscription</h2>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="register-name">Nom complet</label>
      <input
        id="register-name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        placeholder="Votre nom"
        required
      />

      <label htmlFor="register-email">Courriel</label>
      <input
        id="register-email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="etudiant@college.ca"
        required
      />

      <label htmlFor="register-password">Mot de passe</label>
      <input
        id="register-password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Minimum 6 caractères"
        minLength="6"
        required
      />

      <label htmlFor="register-role">Rôle</label>
      <select
        id="register-role"
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option value="ETUDIANT">Étudiant</option>
        <option value="FORMATEUR">Formateur</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : "Créer un compte"}
      </button>
    </form>
  );
}