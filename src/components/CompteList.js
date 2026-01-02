import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteList() {
  // Déclaration d'un état pour stocker les comptes
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilisation de useEffect pour effectuer un appel à l'API dès le chargement
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/comptes`)
      .then(response => {
        setComptes(response.data); // Mise à jour de l'état avec les données récupérées
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des comptes:', error);
        setError(
          error.code === 'ECONNREFUSED' || error.message.includes('Network Error')
            ? `Impossible de se connecter au backend. Vérifiez que le serveur est démarré sur ${API_BASE_URL}`
            : `Erreur: ${error.response?.data?.message || error.message || 'Erreur inconnue'}`
        );
        setLoading(false);
      });
  }, []); // Le tableau vide indique que l'effet s'exécute uniquement au montage du composant

  return (
    <div className="container mt-4">
      <h2>Liste des Comptes</h2>
      {loading && (
        <div className="alert alert-info">Chargement des comptes...</div>
      )}
      {error && (
        <div className="alert alert-danger">
          <strong>Erreur de connexion:</strong> {error}
        </div>
      )}
      {!loading && !error && (
        <>
          {comptes.length === 0 ? (
            <div className="alert alert-warning">Aucun compte trouvé.</div>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Solde</th>
                  <th>Date de Création</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {comptes.map(compte => (
                  <tr key={compte.id}>
                    <td>{compte.id}</td>
                    <td>{compte.solde}</td>
                    <td>{compte.dateCreation}</td>
                    <td>{compte.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default CompteList;

