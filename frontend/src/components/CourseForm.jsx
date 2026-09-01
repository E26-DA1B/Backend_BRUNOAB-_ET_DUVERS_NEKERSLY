import { useState } from 'react';
import api from '../services/api';

export default function CourseForm({ onCourseCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'DEBUTANT'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/courses', form);

      setForm({
        title: '',
        description: '',
        level: 'DEBUTANT'
      });

      setSuccess('Cours créé avec succès.');
      onCourseCreated();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Impossible de créer le cours.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-course-section">
      <form className="course-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Action protégée</p>
        <h2>Créer un cours</h2>

        {success && (
          <p className="success-message">{success}</p>
        )}

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="course-title">Titre</label>
        <input
          id="course-title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Introduction à React"
          required
        />

        <label htmlFor="course-description">Description</label>
        <textarea
          id="course-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description du cours"
          rows="5"
          required
        />

        <label htmlFor="course-level">Niveau</label>
        <select
          id="course-level"
          name="level"
          value={form.level}
          onChange={handleChange}
        >
          <option value="DEBUTANT">Débutant</option>
          <option value="INTERMEDIAIRE">Intermédiaire</option>
          <option value="AVANCE">Avancé</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer le cours'}
        </button>
      </form>
    </section>
  );
}