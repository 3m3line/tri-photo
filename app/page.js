"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./page.module.css";
import CodeBlock from './codeBlock';




export default function Home() {

  const [photoPath, setPhotoPath] = useState('');
  const [exiftoolPath, setExiftoolPath] = useState('');
  const [person, setPerson] = useState('');
  const [dossierAllPath, setdossierAllPath] = useState ('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(true);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handlePhotoPathChange = (e) => setPhotoPath(e.target.value.trim());
  const handleExiftoolPathChange = (e) => setExiftoolPath(e.target.value.trim());
  const handlePersonChange = (e) => setPerson(e.target.value);
  const handledossierAllPath = (e) => setdossierAllPath(e.target.value.trim());
  const toggleSecondSection = () => {
    setIsSecondSectionVisible(!isSecondSectionVisible);
    setIsButtonClicked(true); // Lorsque le bouton est cliqué, on définit cet état à true
    // Réinitialisation de isButtonClicked après un délai de 500ms
    setTimeout(() => setIsButtonClicked(false), 500);
  };

  //const pour vider le menu deroulant du formulaire dès qu'il y a un changement de photoPath
  useEffect(() => {
    setPerson('');
  }, [photoPath]);

  //const pour le remplissage/effacage du chemin exiftool dans le header
  const setDefaultPath = () => {
    setExiftoolPath("C:\\Users\\user\\Desktop\\exiftool-13.04_64");
  };
  const clearPathExiftool = () => {
    setExiftoolPath("");
  };

  //génère le nom dans etape 2 (2.3)
  const personMap = {
    MAM: 'MAM',
    PAPA: 'PAPA',
    VAL: 'VAL',
    EME: 'EME',
    JO: 'JO',
    ADRIEN: 'ADRIEN',
    DODO: 'DODO'
  };

  //const pour retirer dossier enfant pour Etape 3 
  const extractPathParts = (fullPath) => {
    const parts = fullPath.split('\\');
    const lastPart = parts.pop(); // Dernier dossier
    const parentPath = parts.join('\\'); // Chemin parent
    return { parentPath, lastPart };
  };

  //const month (notamment pour etape 4.2)
  const [monthNumber, setMonthNumber] = useState(""); // exemple : "10" pour octobre

  //const pour les input du form dans erreurs pour les metadonnées (etapes 4.2.c)
  const [errorFileDate, setErrorFileDate] = useState("");
  const [errorFileName, setErrorFileName] = useState("");
  const [fileType, setFileType] = useState("photo");

  // Fonction pour montrer ou cacher le bouton "Back to Top"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Afficher le bouton après un certain défilement
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fonction pour revenir en haut de la page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction de décalage du scroll
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();  // Empêche le comportement par défaut du lien

        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        // Calcul du décalage pour le header sticky
        const offset = document.querySelector('header').offsetHeight;

        window.scrollTo({
          top: targetElement.offsetTop - offset,  // Ajout du décalage
          behavior: 'smooth',  // Transition en douceur
        });
      });
    });

    return () => {
      // Clean-up pour retirer l'event listener si nécessaire
      links.forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);

  //fonction pour cacher formulaire au format tel
  useEffect(() => {
    const isMobile = window.innerWidth <= 898;// Détecte la taille de l'écran (largeur maximale de 898px) pour le formulaire
  
    // Par défaut, cacher le formulaire sur mobile
    if (isMobile) {
      setIsSecondSectionVisible(false);
    }
  }, []); // Ce useEffect ne s'exécute qu'une seule fois à l'initialisation

  //fonction de fermeture du collapse au scroll et click menu
  useEffect(() => {
    const isMobile = window.innerWidth <= 898;// Détecte la taille de l'écran (largeur maximale de 898px) pour le formulaire
    const handleScrollOrNavClick = () => {
      if (isMobile) return; //ignore la logique si format tel
      if (isButtonClicked) return; // Si le bouton a été cliqué, on ignore la logique de scroll
      if (window.scrollY === 0) {
        setIsSecondSectionVisible(true); // Ouvre le collapse quand on est en haut
      } else {
        setIsSecondSectionVisible(false); // Ferme sinon
      }
    };

    // Écoute les événements de scroll et de clic sur les liens de navigation
    window.addEventListener('scroll', handleScrollOrNavClick);
    const navLinks = document.querySelectorAll(`.${styles.menuButton}`);
    navLinks.forEach(link => link.addEventListener('click', handleScrollOrNavClick));

    // Nettoyage des événements
    return () => {
      window.removeEventListener('scroll', handleScrollOrNavClick);
      navLinks.forEach(link => link.removeEventListener('click', handleScrollOrNavClick));
    };
  }, [isButtonClicked]); 
  
//genere le changement de nom de dossier dans le code à copier
  const generateCode = (command) => {
    const { parentPath, lastPart } = extractPathParts(dossierAllPath);
    
    return command
    .replace(/C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS/g, dossierAllPath)
    .replace(/C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO/g, photoPath)
    .replace(/C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier/g, parentPath)
    .replace(/2025-01-RASSEMBLEMENT-PHOTOS/g, lastPart)
    .replace(/C:\\Users\\user\\Desktop\\exiftool-13\.04_64/g, exiftoolPath)
    .replace(/_D_/g, `_${personMap[person]}_`);
  };
  
  //efface espace inutile dans les input
  function isEmpty(value) {
    return value.trim() === '';
  }
  console.log('exiftoolPath:', exiftoolPath, 'isEmpty:', isEmpty(exiftoolPath));
  return (
    <div className={styles.page}>
      <header>
        <div className='contenantHeader'>
          <section className={styles.contenantH1Menu}>
          <h1 className={styles.h1}>Aide tri photo</h1>
          <nav className={styles.menu}>
            <Link href="#preparation"><button className={styles.menuButton}>I. Préparation</button></Link>
            <Link href="#renommage"><button className={styles.menuButton}>II. Renommage par personne</button></Link>
            <Link href="#rassemblement"><button className={styles.menuButton}>III. Rassemblement</button></Link>
            <Link href="#traitement"><button className={styles.menuButton}>IV. Traitement de l'ensemble</button></Link>
            <Link href="#amelioration"><button className={styles.menuButton}>V. Amélioration Tri</button></Link>
          </nav>
          </section>
          <section className={styles.sectionForm}>
            <button onClick={toggleSecondSection} className={styles.toggleButton} title={isSecondSectionVisible ? "Réduire" : "En voir plus"}>
              {isSecondSectionVisible ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}
            </button>
            {isSecondSectionVisible && (
              <form className={styles.formContainer}>
                {/* Photo Path */}
                <div>
                  <label htmlFor="chemin-dossier-photo">Chemin du dossier avec les photos à modifier :</label>
                  <input type="text" id="chemin-dossier-photo" value={photoPath} onChange={handlePhotoPathChange} placeholder="Entrez le chemin" />
                </div>
                {/* Exiftool Path */}
                <div>
                  <div className={styles.exiftoolHeader}> 
                  <label htmlFor="chemin-exiftool">Chemin du dossier avec exiftool :</label>
                  {/* Icône fleche */}
                  <svg
                    onClick={setDefaultPath}
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ cursor: "pointer" }}
                    title="Remplir automatiquement"
                  >
                    {/* rectangle allongé, placé en bas */}
                    <rect x="3" y="14" width="18" height="6" rx="1" ry="1" />
                    
                    {/* flèche vers le bas, bien au-dessus */}
                    <path d="M12 2v6" />          {/* tige de la flèche */}
                    <path d="M9 7l3 3 3-3" />     {/* tête de la flèche */}
                  </svg>
                  {/* Icône poubelle */}
                  <svg
                    onClick={clearPathExiftool}
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ cursor: "pointer" }}
                    title="Vider le champ"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M8 6V4h8v2" />
                  </svg></div>
                  <input type="text" id="chemin-exiftool" value={exiftoolPath} onChange={handleExiftoolPathChange} placeholder="Entrez le chemin" />
                </div>
                <div className={styles.menuderoulant}>
                  {/* Person */}
                  <div>
                    <label htmlFor="choix">La personne concernée :</label>
                    <select id="choix" value={person} onChange={handlePersonChange}>
                      <option value="">-- Sélectionnez une personne --</option>
                      <option value="MAM">Maman</option>
                      <option value="PAPA">Papa</option>
                      <option value="VAL">Valentin</option>
                      <option value="EME">Emeline</option>
                      <option value="JO">Jonathan</option>
                      <option value="ADRIEN">Adrien</option>
                      <option value="DODO">Domitille</option>
                    </select>
                  </div>
                  {/* Mois */}
                  <div>
                    <label htmlFor="choix-mois">Le mois traité :</label>
                    <select
                      id="choix-mois"
                      value={monthNumber}
                      onChange={(e) => setMonthNumber(e.target.value)}
                    >
                      <option value="">-- Sélectionnez le mois --</option>
                      <option value="01">Janvier</option>
                      <option value="02">Février</option>
                      <option value="03">Mars</option>
                      <option value="04">Avril</option>
                      <option value="05">Mai</option>
                      <option value="06">Juin</option>
                      <option value="07">Juillet</option>
                      <option value="08">Août</option>
                      <option value="09">Septembre</option>
                      <option value="10">Octobre</option>
                      <option value="11">Novembre</option>
                      <option value="12">Décembre</option>
                    </select>
                  </div>
                </div>
                {/* Dossier All Path */}
                <div>
                  <label htmlFor="chemin-dossier-all">Chemin du nouveau dossier avec toutes les photos :</label>
                  <input type="text" id="chemin-dossier-all" value={dossierAllPath} onChange={handledossierAllPath} placeholder="Entrez le chemin" />
                </div>
              </form>
            )}
          </section>
        </div>
      </header>
      <main className={styles.main}>
        <section id="preparation" className={styles.sepEtapes}> 
          <h2 className={styles.sansCode}>ETAPE 1 : PREPARER LES ELEMENTS POUR TRAVAILLER</h2>    
          <div className={`${styles.column} ${styles.sepCode}`}>    

            <article className={styles.column1}>
              
              <h3>1.	Récuperer les photos de tout le monde</h3>
              <p>a. Récupérer les photos des membres de la famille qui les tries, les décompresser et les classer dans un dossier à leur nom</p>
              <br></br>
              <p>b. Reprendre signal pour le mois à trier, et y télécharger les photos de PAPA et GRANDMERE en les renommant avec la nomenclature suivante : 
              </p>
              <p>AAAA-MM-JJ_00-00-00-_NOM_detail.ext</p>
              <br></br>
              <p>c.	Pour chaque personne, vérifier s'il y a des photos qui ne sont pas du mois et si oui les classer dans le bon mois</p></article>
            <article className={styles.column2}>
            </article></div>
          <div className={styles.column}>
            <article className={styles.column1}> 
              <h3>2. Préparer les outils de commande</h3>           
              <p>a. Ouvrir les outils de commande : invite de commande et powershell</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}><CodeBlock 
            code={generateCode('cd C:\\Users\\user\\Desktop\\exiftool-13.04_64')}
            disabledCopy={isEmpty(exiftoolPath)}
            errorMessage="Veuillez spécifier le chemin exiftool pour copier !" /></article>
          </div> 
        </section>
        <section id="renommage" className={styles.sepEtapes}>
          
          <article className={styles.sansCode}>
            <h2>ETAPE 2 : RENOMMER LES PHOTOS DANS CHAQUE DOSSIER</h2>
            <h3>1. Renommer les fichiers avec la bonne nomenclature</h3>
            <p>Nomenclature : AAAA-MM-JJ__hh-mm-ss-_NOM_detail.ext</p>
          </article>
          <div className={styles.column}>
            <article className={styles.column1}>
              <h4>Mettre en forme date, ajout de l'heure par défaut et ajouter le nom</h4>
              <p>a. Aller dans powershell</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock
                code={generateCode(
                  [
                    'Get-ChildItem -Path "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO" -File | ForEach-Object {',
    '    $nomOriginal = $_.Name',
    '',
    '    # On ne traite que les fichiers qui n\'ont pas encore été renommés par ce script',
    '    if ($nomOriginal -notmatch \'^\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2}-_' + person + '_\') {',
    '',
    '        if ($nomOriginal -match \'^(\\d{4})(?:-)?(\\d{2})(?:-)?(\\d{2})(?:_(\\d{2}-\\d{2}-\\d{2}))?\') {',
    '',
    '            $annee  = $matches[1]',
    '            $mois   = $matches[2]',
    '            $jour   = $matches[3]',
    '            $heure  = if ($matches[4]) { $matches[4] } else { \'00-00-00\' }',
    '',
    '            $datePartie  = "$annee-$mois-$jour"',
    '            $heurePartie = $heure',
    '',
    '            # Supprime la date + heure du début',
    '            $textePartie = $nomOriginal -replace \'^\\d{4}(?:-)?\\d{2}(?:-)?\\d{2}(?:_\\d{2}-\\d{2}-\\d{2})?\', \'\'',
    '            $textePartie = $textePartie -replace \'^[_\\-]+\', \'\'',
    '            $textePartie = $textePartie -replace \'^(_' + person + '_)+\', \'\'',
    '',
    '            $nouveauNom = "${datePartie}_${heurePartie}-_' + person + '_$textePartie"',
    '',
    '            if ($nouveauNom -ne $nomOriginal) {',
    '                Rename-Item -LiteralPath $_.FullName -NewName $nouveauNom -Force',
    '                Write-Host "Renommé : $nomOriginal -> $nouveauNom"',
    '            }',
    '        }',
    '        else {',
    '            Write-Host "Format non reconnu : $nomOriginal"',
    '        }',
    '    }',
    '}'
  ].join("\n")
)}
              disabledCopy={person === '' || isEmpty(photoPath)}
              errorMessage={
                person === '' && isEmpty(photoPath)
                  ? "Choisissez une personne et spécifiez le chemin du dossier des photos à modifier !"
                  : person === ''
                  ? "Choisissez une personne pour pouvoir copier !"
                  : isEmpty(photoPath)
                  ? "Veuillez spécifier le chemin du dossier des photos à modifier !"
                  : ""
              }/>
            </article>
          </div>
        </section>
        <section id="rassemblement" className={styles.sepEtapes}>       
          <h2 className={styles.sansCode}>ETAPE 3. RASSEMBLER TOUTES LES PHOTOS DANS UN DOSSIER</h2>
          <div className={styles.column}>   
            <article className={styles.column1}>
              <p>a. Créer un nouveau dossier avec ce type de nomenclature : AAAA-MM-RASSEMBLEMENT-PHOTOS</p>
              <p>b. Aller dans invite de commande</p>
              <p>c. Pour dupliquer tous les fichiers des sous dossier et les intégrer dans le nouveau dossier, taper le code :</p>            
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode('exiftool -r -o "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS" "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier"')} 
              disabledCopy={isEmpty(dossierAllPath)}
              errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"/></article>
          </div>
        </section>
        <section id="traitement" className={styles.sepEtapes}>
          <h2 className={styles.sansCode}>ETAPE 4. TRAITER LES ELEMENTS DU DOSSIER</h2>
            <div className={`${styles.column} ${styles.sepCode}`}>
              <article className={styles.column1}>
                <h3>1. Supprimer les espaces et les accents</h3>
                <p>a. Aller dans powershell</p>
                <p>b. Taper le code :</p>
              </article>
              <article className={styles.column2}>
                <CodeBlock
                  code={generateCode([
                    'Get-ChildItem -Path "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS" -Recurse |',
                    'Where-Object { -not $_.PSIsContainer } |',
                    'Rename-Item -NewName {',
                    '    $name = $_.BaseName',
                    '    $ext  = $_.Extension',
                    '',
                    '    # Remplacer les accents',
                    '    $name = $name -replace "[éèêë]","e"',
                    '    $name = $name -replace "[àâä]","a"',
                    '    $name = $name -replace "[ôö]","o"',
                    '    $name = $name -replace "[îï]","i"',
                    '    $name = $name -replace "[ûü]","u"',
                    '    $name = $name -replace "[ç]","c"',
                    '',
                    '    # Remplacer les espaces par des -',
                    '    $name = $name -replace " ","-"',
                    '',
                    '    # Supprimer les apostrophes et autres caractères spéciaux',
                    '    $name = $name -replace "[`\'""&;,!:?()]",""',
                    '',
                    '    # Recombiner avec l\'extension',
                    '    "$name$ext"',
                    '}'
                  ].join("\n"))}

                  disabledCopy={isEmpty(dossierAllPath)}
                  errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"
                />
              </article>
            </div>
            <article className={styles.sansCode}>
              <h3>2. Corriger les dates non visibles des documents (métadonnée) pour éviter les erreurs et que cela corresponde au bon mois</h3>
               <p>a. Revérifier si il y a des photos qui ne sont pas du mois et si oui les classer dans le bon mois</p>
            </article>
            <div className={styles.column}>
              <article className={styles.column1}>
                <h4>b. Pour les photos</h4>
                <p>i. Aller dans invite de commande</p>
                <p>ii. Taper le code :</p>
              </article>
              <article className={styles.column2}>
                <CodeBlock
                  code={generateCode( `exiftool ^ -ext jpg -ext jpeg -ext png -ext heic -ext cr2 -ext nef -ext arw -ext dng ^ "-AllDates<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ "-FileModifyDate<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ "-FileCreateDate<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ -if "(not $DateTimeOriginal) or ($DateTimeOriginal !~ /^\${Filename;$_=lc($_);s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3/}/ and $DateTimeOriginal !~ /^....:${monthNumber}:/)" ^ -overwrite_original ^ "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS\\*.*"`
                  )}
                  disabledCopy={isEmpty(dossierAllPath) || isEmpty(monthNumber)}
                  errorMessage={
                    isEmpty(monthNumber) && isEmpty(dossierAllPath)
                      ? "Veuillez spécifier le mois traité, et le chemin du dossier avec les photos rassemblées !"
                      : isEmpty(monthNumber)
                      ? "Veuillez spécifier le mois traité !"
                      : isEmpty(dossierAllPath)
                      ? "Veuillez spécifier le chemin du dossier avec les photos rassemblées !"
                      : ""
                  }
                />
              </article>
            </div>
            <div className={styles.column}>
              <article className={styles.column1}>
                <h4>c. Pour les videos</h4>
                <p>i. Aller dans invite de commande</p>
                <p>ii. Taper le code :</p>
              </article>
              <article className={styles.column2}>
                <CodeBlock
                  code={generateCode( `exiftool ^ -ext mp4 -ext mov -ext avi -ext m4a -ext mkv -ext flv ^ "-AllDates<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ "-MediaCreateDate<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ "-FileModifyDate<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ "-FileCreateDate<\${Filename;s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3 00:00:00/}" ^ -if "$Filename =~ /(\\d{4})-(\\d{2})-(\\d{2})_/ and (not $MediaCreateDate or $MediaCreateDate !~ /^\${Filename;$_=lc($_);s/(\\d{4})-(\\d{2})-(\\d{2})_.*/$1:$2:$3/}/ and $MediaCreateDate !~ /^....:${monthNumber}:/)" ^ -overwrite_original ^ "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS\\*.*"`
                  )}
                  disabledCopy={isEmpty(dossierAllPath) || isEmpty(monthNumber)}
                  errorMessage={
                    isEmpty(monthNumber) && isEmpty(dossierAllPath)
                      ? "Veuillez spécifier le mois traité, et le chemin du dossier avec les photos rassemblées !"
                      : isEmpty(monthNumber)
                      ? "Veuillez spécifier le mois traité !"
                      : isEmpty(dossierAllPath)
                      ? "Veuillez spécifier le chemin du dossier avec les photos rassemblées !"
                      : ""
                  }
                />
              </article>
            </div>
            <div className={`${styles.column} ${styles.sepCode}`}>
              <article className={styles.column1}>
                <h3>Erreur</h3>
                <h4>c. En cas de fichier corrompu au niveau de la metadonnée</h4>
                <p>i. Renseigner les éléments (nom du fichier et date) dans les encarts prévus</p>
                <p>ii. Aller dans invite de commande</p>
                <p>iii. Taper le code :</p>  
              </article>

              <article className={styles.column2}>
                {/* Inputs pour date et nom de fichier */}
                <form className={styles.formContainer}>
                  <label className={styles.types}>
                    Type de fichier :
                    <span className={styles.radioWrapper}>
                      <input
                        type="radio"
                        name="fileType"
                        value="photo"
                        checked={fileType === "photo"}
                        onChange={() => setFileType("photo")}
                        className={styles.radioButton}
                      />
                      <span className={styles.radioLabel}>Photo</span>
                    </span>
                    <span className={styles.radioWrapper}>
                      <input
                        type="radio"
                        name="fileType"
                        value="video"
                        checked={fileType === "video"}
                        onChange={() => setFileType("video")}
                        className={styles.radioButton}
                      />
                      <span className={styles.radioLabel}>Vidéo</span>
                    </span>
                  </label>

                  <label>
                    Date (ex : 2026:01:01 00:00:00) :
                    <input
                      type="text"
                      value={errorFileDate}
                      onChange={(e) => setErrorFileDate(e.target.value)}
                      placeholder="2026:01:01 00:00:00"
                      style={{ marginLeft: "5px", width: "250px" }}
                    />
                  </label>
                  <br />
                  <label style={{ marginTop: "5px", display: "block" }}>
                    Nom du fichier :
                    <input
                      type="text"
                      value={errorFileName}
                      onChange={(e) => setErrorFileName(e.target.value)}
                      placeholder="exemple-nom.jpg"
                      style={{ marginLeft: "5px", width: "500px" }}
                    />
                  </label>
                </form>
                <CodeBlock
                  code={generateCode(
                      `exiftool -all= "-${
                        fileType === "photo" ? "DateTimeOriginal" : "MediaCreateDate"
                      }=${errorFileDate}" -overwrite_original "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS\\${errorFileName}"`
                    )}
                  disabledCopy={isEmpty(errorFileDate) || isEmpty(errorFileName) || isEmpty(dossierAllPath)}
                  errorMessage={
                    isEmpty(errorFileDate) && isEmpty(errorFileName) && isEmpty(dossierAllPath)
                      ? "Veuillez spécifier la date, le nom du fichier et le chemin du dossier avec les photos rassemblées !"
                      : isEmpty(errorFileDate) && isEmpty(errorFileName)
                      ? "Veuillez spécifier la date et le nom du fichier !"
                      : isEmpty(dossierAllPath) && isEmpty(errorFileName)
                      ? "Veuillez spécifier le nom du fichier et le chemin du dossier avec les photos rassemblées !"
                      : isEmpty(dossierAllPath) && isEmpty(errorFileDate)
                      ? "Veuillez spécifier la date et le chemin du dossier avec les photos rassemblées !"
                      :isEmpty(errorFileDate)
                      ? "Veuillez spécifier la date !"
                      : isEmpty(errorFileName)
                      ? "Veuillez spécifier le nom du fichier !"
                      : isEmpty(dossierAllPath)
                      ? "Veuillez spécifier le chemin du dossier avec les photos rassemblées !"
                      : ""
                  }
                />
              </article>
            </div>
            <div className={`${styles.column} ${styles.sepCode}`}>
              <article className={styles.column1}>
                <h3>3. Mettre les bonnes heures aux photos</h3>
                <p>a. Aller dans powershell</p>
                <p>b. Taper le code :</p>
              </article>

              <article className={styles.column2}>
                <CodeBlock
                  code={generateCode(
                    [
                      ".\\exiftool -m -r `",
                      "  -ext jpg -ext jpeg -ext png `",
                      "  -if 'defined $DateTimeOriginal and $FileName =~ /^(\\d{4}-\\d{2}-\\d{2})_\\d{2}-\\d{2}-\\d{2}-_/' `",
                      '  -d "%Y-%m-%d_%H-%M-%S" `',
                      "  '-FileName<${DateTimeOriginal}-_${FileName;s/^.*?-_//}' `",
                      "  -overwrite_original `",
                      '  "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS\\*.*"'
                    ].join("\n")
                  )}
                  disabledCopy={isEmpty(dossierAllPath)}
                  errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"
                />
              </article>
            </div>
            <div className={styles.column}>
              <article className={styles.column1}>
                <h3>4. Mettre les bonnes heures aux vidéos</h3>
                <p>a. Aller dans powershell</p>
                <p>b. Taper le code :</p>
              </article>

              <article className={styles.column2}>
                <CodeBlock
                  code={generateCode(
                    [
                      ".\\exiftool -m -r `",
                      "  -ext mp4 -ext mov -ext avi -ext m4a `",
                      "  -if 'defined $MediaCreateDate and $FileName =~ /^(\\d{4}-\\d{2}-\\d{2})_\\d{2}-\\d{2}-\\d{2}-_/ and $FileName !~ /_VAL_/' `",
                      '  -d "%Y-%m-%d_%H-%M-%S" `',
                      "  '-FileName<${MediaCreateDate}-_${FileName;s/^.*?-_//}' `",
                      "  -overwrite_original `",
                      '  "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS\\*.*"'
                    ].join("\n")
                  )}
             
                  disabledCopy={isEmpty(dossierAllPath)}
                  errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"
                />
              </article>
            </div>            
        </section>
        <section id="amelioration">
          <h2 className={styles.sansCode}>ETAPE 5. AMELIORATION DU TRI DES PHOTOS POUR AIDER AU MONTAGE</h2>
          <article className={styles.sansCode}>
              <h3>1. Vérifier les doublons et supprimer si besoin </h3>
              <p>Reprendre les photos et vérifier visuellement</p>
            </article>
          <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h3>2. Ajout d&apos;une séquence numérique</h3>
              <p>a. Aller dans powershell</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode(`$dossier = "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS"
$extensions = @("*.jpg", "*.jpeg", "*.png", "*.mp4", "*.mov", "*.avi", "*.m4a")

Get-ChildItem -Path $dossier -Recurse -File -Include $extensions |
    Sort-Object Name |
    ForEach-Object -Begin { $count = 1 } -Process {
        $newName = "{0:D3}_{1}" -f $count, $_.Name
        $newPath = Join-Path $_.DirectoryName $newName
        Rename-Item -Path $_.FullName -NewName $newName -ErrorAction SilentlyContinue
        $count++
    }
`)} 
              disabledCopy={isEmpty(dossierAllPath)}
              errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"/>
            </article>
          </div>
          <article className={styles.sansCode}>
            <h3>3. Modification de la séquence pour améliorer l'ordre</h3>
            <p>a. Reprendre les photos et vérifier visuellement</p>
            <p>b. Modifier manuellement le numéro de la séquence numérique des photos si besoin pour avoir un ordre plus logique (voir ci-dessous)</p>
            <ul>
              <h4 style={{ marginTop: "30px" }}>PROCESS</h4>
              <li><strong>Séquence numérique ajoutée :</strong> Chaque photo reçoit un numéro unique pour garantir un ordre cohérent.</li>
              <li style={{ marginTop: "10px" }}><strong>Classement par date et heure :</strong>
                <ul>
                  <li>Les photos d’événements communs se placent correctement selon leur <strong>date</strong> et <strong>heure</strong>. Mais ils peuvent être entrecoupé par des événements d'autres personnes, qu'ils faut donc déplacer''</li>
                  <li>Les photos dont l’heure est par défaut 00-00-00 doivent être vérifier, car elles peuvent nécessiter un ajustement manuel.</li>
                </ul>
              </li>
              <li style={{ marginTop: "10px" }}><strong>Regroupement des photos isolées :</strong>
                <ul>
                  <li>Les photos individuelles de personnes sont rassemblées ensemble pour éviter qu’elles se perdent au milieu d’autres blocs (événements ou personnes).</li>
                  <li>Même si les dates ne sont pas parfaites, ce regroupement facilite la lecture et la compréhension des albums.</li>
                  <li>Il faut essayer de réflechir au montage lors du tri : les photos ne sont pas parfaitement mises dans l'ordre chronologique, sinon on s'y perdrait (exemple d'usage : "pendant ce temps")'</li>
                </ul>
              </li>
            </ul>
          </article>         
        </section>
      </main>
      <footer className={styles.footer}>
      <button 
        className={`${styles.backToTopButton} ${showBackToTop ? styles.show : ''}`} 
        onClick={scrollToTop}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      </footer>
    </div>
  );
}
