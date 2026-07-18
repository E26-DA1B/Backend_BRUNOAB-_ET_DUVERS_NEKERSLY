import axios from 'axios';

export const fetchQuizQuestions = async () => {
  try {
    // Tentative d'appel sur l'API externe avec un timeout de 3 secondes
    const response = await axios.get('https://opentdb.com', { timeout: 3000 });
    
    if (response.data && response.data.response_code === 0) {
      return response.data.results.map((q) => ({
        text: q.question,
        correctAnswer: q.correct_answer,
      }));
    }
    
    // Si le site répond mais avec un code d'erreur (Rate Limit), on déclenche le plan de secours
    throw new Error('API saturée');
    
  } catch (error) {
    console.log('⚠️ Banque mondiale indisponible ou saturée. Activation des questions de secours pédagogiques...');
    
    // Banque de questions de secours locale pour garantir la réussite du projet
    return [
      { text: "Que signifie REST dans le contexte des API ?", correctAnswer: "Representational State Transfer" },
      { text: "Quel code de statut HTTP correspond à une ressource créée avec succès ?", correctAnswer: "201 Created" },
      { text: "Quel outil utilise-t-on pour hacher les mots de passe de manière sécurisée ?", correctAnswer: "Bcrypt" },
      { text: "À quoi sert un jeton JWT ?", correctAnswer: "À authentifier et transmettre des informations de session de manière sécurisée" },
      { text: "Quel composant d'Express sert à intercepter une requête avant qu'elle n'atteigne le contrôleur ?", correctAnswer: "Un middleware" }
    ];
  }
};
