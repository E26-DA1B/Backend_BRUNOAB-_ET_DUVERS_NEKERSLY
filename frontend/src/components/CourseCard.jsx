export default function CourseCard({ course, user, onDelete }) {
  const canDelete =
    user?.role === 'FORMATEUR' &&
    user?.id === course.teacherId;

  return (
    <article className="course-card">
      <div className="course-card-header">
        <span className={`level level-${course.level.toLowerCase()}`}>
          {course.level}
        </span>

        <span>
          {course._count?.lessons ?? course.lessons?.length ?? 0} leçon(s)
        </span>
      </div>

      <h3>{course.title}</h3>
      <p>{course.description}</p>

      <p className="teacher">
        Formateur : {course.teacher?.name || 'Non précisé'}
      </p>

      {canDelete && (
        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(course.id)}
        >
          Supprimer
        </button>
      )}
    </article>
  );
}