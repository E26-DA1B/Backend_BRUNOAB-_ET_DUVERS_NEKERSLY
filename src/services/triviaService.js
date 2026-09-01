import axios from 'axios';

const decodeHtml = (text) => {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
};

export const fetchQuizQuestions = async () => {
  try {
    const response = await axios.get(
      'https://opentdb.com/api.php',
      {
        params: {
          amount: 5,
          type: 'multiple'
        },
        timeout: 10000
      }
    );

    if (
      response.data.response_code !== 0 ||
      !Array.isArray(response.data.results)
    ) {
      throw new Error(
        "L'API Open Trivia n'a retourné aucune question."
      );
    }

    return response.data.results.map((question) => ({
      text: decodeHtml(question.question),
      correctAnswer: decodeHtml(question.correct_answer),
      incorrectAnswers: question.incorrect_answers.map(
        decodeHtml
      )
    }));
  } catch (error) {
    console.error(
      'Open Trivia indisponible. Utilisation des questions de secours.'
    );

    return [
      {
        text: 'Que signifie REST dans le contexte des API?',
        correctAnswer: 'Representational State Transfer',
        incorrectAnswers: [
          'Remote Execution Service Tool',
          'Rapid Express Server Technology',
          'Relational Endpoint Storage Type'
        ]
      },
      {
        text: 'Quel code HTTP représente une création réussie?',
        correctAnswer: '201 Created',
        incorrectAnswers: [
          '200 Deleted',
          '401 Created',
          '500 Success'
        ]
      },
      {
        text: 'Quel outil sert à hacher les mots de passe?',
        correctAnswer: 'Bcrypt',
        incorrectAnswers: [
          'Axios',
          'Prisma',
          'Express'
        ]
      },
      {
        text: 'À quoi sert un jeton JWT?',
        correctAnswer: 'À authentifier un utilisateur',
        incorrectAnswers: [
          'À créer une base de données',
          'À styliser une page',
          'À installer les dépendances'
        ]
      },
      {
        text: 'Quel composant intercepte une requête Express?',
        correctAnswer: 'Un middleware',
        incorrectAnswers: [
          'Un composant React',
          'Une migration',
          'Une feuille CSS'
        ]
      }
    ];
  }
};