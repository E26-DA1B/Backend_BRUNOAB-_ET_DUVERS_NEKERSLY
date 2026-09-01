import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from './CourseCard';

export default function CourseList({ refreshKey }) {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/courses', {
          params: {
            page,
            limit: 6,
            search: search || undefined,
            level: level || undefined
          }
        });

        setCourses(response.data.data || response.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Impossible de charger les cours.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [page, search, level, refreshKey]);

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer ce cours ?'
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await api.delete(`/courses/${courseId}`);

      setCourses((currentCourses) =>
        currentCourses.filter((course) => course.id !== courseId)
      );

      setSuccess('Cours supprimé avec succès.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Impossible de supprimer le cours.'
      );
    }
  };

  return (
    <section className="courses-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h2>Nos cours</h2>
        </div>

        <div className="filters">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un cours"
          />

          <select
            value={level}
            onChange={(event) => {
              setLevel(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les niveaux</option>
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
          </select>
        </div>
      </div>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="status-message">Chargement des cours...</p>
      ) : courses.length === 0 ? (
        <p className="status-message">Aucun cours trouvé.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              user={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((currentPage) => currentPage - 1)}
        >
          Précédent
        </button>

        <span>
          Page {page} sur {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Suivant
        </button>
      </div>
    </section>
  );
}