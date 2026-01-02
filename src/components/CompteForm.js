import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteForm() {
  // Initialisation de l'état pour stocker les données du formulaire
  const [compte, setCompte] = useState({ solde: '', dateCreation: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    setCompte({ ...compte, [e.target.name]: e.target.value });
    setError(null); // Efface l'erreur quand l'utilisateur modifie le formulaire
    setSuccess(false);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    axios.post(`${API_BASE_URL}/comptes`, compte) // Envoie une requête POST avec les données
      .then(response => {
        setSuccess(true);
        setCompte({ solde: '', dateCreation: '', type: '' }); // Réinitialise le formulaire
        setLoading(false);
        // Recharger la page après 1 seconde pour voir le nouveau compte dans la liste
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du compte:', error);
        setError(
          error.code === 'ECONNREFUSED' || error.message.includes('Network Error')
            ? `Impossible de se connecter au backend. Vérifiez que le serveur est démarré sur ${API_BASE_URL}`
            : `Erreur: ${error.response?.data?.message || error.message || 'Erreur inconnue'}`
        );
        setLoading(false);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un Compte</h2>
      {success && (
        <div className="alert alert-success">
          Compte ajouté avec succès !
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          <strong>Erreur:</strong> {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Solde</label>
          <input
            type="number"
            name="solde"
            className="form-control"
            value={compte.solde}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date de Création</label>
          <input
            type="date"
            name="dateCreation"
            className="form-control"
            value={compte.dateCreation}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select name="type" className="form-select" value={compte.type} onChange={handleChange} required disabled={loading}>
            <option value="">Sélectionner un type</option>
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}

export default CompteForm;

