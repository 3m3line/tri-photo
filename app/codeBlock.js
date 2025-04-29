import { useState } from 'react';
import './codeBlock.css'

// Fonction pour copier le texte dans le presse-papier
function copyToClipboard(code, disabled = false, errorMessage, setButtonText) {
  if (disabled) {
    alert(errorMessage);  // Afficher l'erreur
    return;
  }

  navigator.clipboard.writeText(code)
    .then(() => {
      setButtonText('✔');  // Modifier le texte du bouton
      setTimeout(() => setButtonText('COPIER'), 2000);  // Remettre le texte après 2 secondes
    })
    .catch(() => {
      alert('Échec de la copie du code.');
    });
}

function CodeBlock({ code, disabledCopy = false, errorMessage = "Échec de la copie du code." }) {
  const [buttonText, setButtonText] = useState('COPIER'); // État pour le texte du bouton
  return (
    <div className="codeblockDiv">
      {disabledCopy && (
        <p className="disabled-message">{errorMessage}</p>
      )}
    <div className="contenant">
      <pre className="pre"><code>{code}</code></pre>
      <button onClick={() => copyToClipboard(code, disabledCopy, errorMessage, setButtonText)} className="button"  disabled={disabledCopy}>{buttonText === '✔' ? <i className="fas fa-check"></i> : buttonText}</button>
    </div>
    </div>
  );
}

export default CodeBlock;