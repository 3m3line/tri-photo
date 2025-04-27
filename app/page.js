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

  //const pour retirer dossier enfant pour Etape 3 
  const extractPathParts = (fullPath) => {
    const parts = fullPath.split('\\');
    const lastPart = parts.pop(); // Dernier dossier
    const parentPath = parts.join('\\'); // Chemin parent
    return { parentPath, lastPart };
  };

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

  //fonction de fermeture du collapse au scroll et click menu
  useEffect(() => {
    const handleScrollOrNavClick = () => {
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
  

  //génère le nom dans etape 2 (2.3)
  const personMap = {
    MAM: 'MAM',
    PAPA: 'PAPA',
    V: 'V',
    E: 'E',
    J: 'J',
    A: 'A',
    D: 'D'
  };

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
            <Link href="#traitement"><button className={styles.menuButton}>II. Traitement</button></Link>
            <Link href="#rassemblement"><button className={styles.menuButton}>III. Rassemblement</button></Link>
            <Link href="#correction"><button className={styles.menuButton}>IV. Correction</button></Link>
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
                  <label htmlFor="chemin-exiftool">Chemin du dossier avec exiftool :</label>
                  <input type="text" id="chemin-exiftool" value={exiftoolPath} onChange={handleExiftoolPathChange} placeholder="Entrez le chemin" />
                </div>
                {/* Person */}
                <div>
                  <label htmlFor="choix">Choisissez la personne concernée :</label>
                  <select id="choix" value={person} onChange={handlePersonChange}>
                    <option value="">-- Sélectionnez une personne --</option>
                    <option value="MAM">Maman</option>
                    <option value="PAPA">Papa</option>
                    <option value="V">Valentin</option>
                    <option value="E">Emeline</option>
                    <option value="J">Jonathan</option>
                    <option value="A">Adrien</option>
                    <option value="D">Domitille</option>
                  </select>
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
          <div className={styles.column}>    
            <article className={styles.column1}>            
              <p>a. Ouvrir les outils de commande : invite de commande et powershell</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}><CodeBlock 
            code={generateCode('cd C:\\Users\\user\\Desktop\\exiftool-13.04_64')}
            disabledCopy={isEmpty(exiftoolPath)}
            errorMessage="Veuillez spécifier le chemin exiftool pour copier !" /></article>
          </div> 
        </section>
        <section id="traitement" className={styles.sepEtapes}>
          
          <article className={styles.sansCode}>
            <h2>ETAPE 2 : TRAITER LES ELEMENTS DU DOSSIER</h2>
            <h3>1. Renommer les fichiers avec la bonne nomenclature</h3>
            <p>Nomenclature : AAAA-MM-JJ_NOM_detail (sans accent et espace)</p>
          </article>
          <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h4>1.1. Supprimer les espaces</h4>
              <p>a. Aller dans invite de commande</p>
              <p>b. Taper le code :</p>              
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode('exiftool "-FileName<$directory/${filename;s/ /-/g}" -r "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO"')} 
              disabledCopy={isEmpty(photoPath)}
              errorMessage="Veuillez spécifier le chemin du dossier des photos à modifier !"/></article>
            </div>
            <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h4>1.2. Supprimer les accents</h4>
              <p>a. Aller dans powershell</p>
              <p>b. Taper le code :</p>              
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode('Get-ChildItem -Path "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO" -Recurse | Rename-Item -NewName { $newname = $_.Name -replace "[éèêë]","e" -replace "[àâä]","a" -replace "[ôö]","o" -replace "[îï]","i" -replace "[ûü]","u" -replace "[ç]","c" -replace " ", "-"; $newname }')} 
              disabledCopy={isEmpty(photoPath)}
              errorMessage="Veuillez spécifier le chemin du dossier des photos à modifier !"/></article>
            </div>
            <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h4>1.3. Mettre en forme date et ajouter nom</h4>
              <p>a. Aller dans invite de commande</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode(`exiftool "-FileName<\${FileName;s/^(\\d{4})(\\d{2})(\\d{2})([-_])?/\${1}-$2-$3_${person}_/; s/(?<=\\d{4}-\\d{2}-\\d{2})(?!_${person}_)/_${person}_/}" "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO"`)}
              disabledCopy={person === '' || isEmpty(photoPath)}
              errorMessage={
                person === '' && isEmpty(photoPath)
                  ? "Choisissez une personne et spécifiez le chemin du dossier des photos à modifier !"
                  : person === ''
                  ? "Choisissez une personne pour pouvoir copier !"
                  : isEmpty(photoPath)
                  ? "Veuillez spécifier le chemin du dossier des photos à modifier !"
                  : ""
              }/></article>
          </div>
          <article className={styles.sansCode}>
            <h3>2. Redater les métadonnées des photos et vidéos</h3>
          </article>
          <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h4>2.1. Redater les photos</h4>
              <p>a. Aller dans invite de commande</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock 
                code={generateCode('exiftool -ignoreMinorErrors "-AllDates<DateTimeOriginal" "-FileModifyDate<DateTimeOriginal" "-FileCreateDate<DateTimeOriginal" -overwrite_original -r "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO"')}
                disabledCopy={isEmpty(photoPath)}
                errorMessage="Veuillez spécifier le chemin du dossier des photos à modifier !"
             /></article>
          </div>
          <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h4>2.2. Redater les vidéos</h4>
              <p>a. Aller dans invite de commande</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock 
                code={generateCode('exiftool "-FileCreateDate<CreateDate" "-FileModifyDate<CreateDate" "-QuickTime:CreateDate<CreateDate" "-QuickTime:ModifyDate<CreateDate" "-AllDates<CreateDate" -overwrite_original -r -ext mov -ext mp4 -ext avi "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\JO"')} 
                disabledCopy={isEmpty(photoPath)}
                errorMessage="Veuillez spécifier le chemin du dossier des photos à modifier !"/></article>
          </div>
          <div className={`${styles.column}`}>
            <article className={styles.column1}>
              <h4>2.3. Redater les fichiers corrompus par WhatsApp grâce à la date dans le nom du fichier</h4>
              <p>a. Aller dans invite de commande</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock 
              code={generateCode(
                `exiftool ^ 
  "-AllDates<\${Filename;s/(\\\d{4})-(\\\d{2})-(\\\d{2})_.*/$1:$2:$3 12:00:00/}" ^ 
  "-FileModifyDate<\${Filename;s/(\\\d{4})-(\\\d{2})-(\\\d{2})_.*/$1:$2:$3 12:00:00/}" ^ 
  "-FileCreateDate<\${Filename;s/(\\\d{4})-(\\\d{2})-(\\\d{2})_.*/$1:$2:$3 12:00:00/}" ^ 
  -if "not $DateTimeOriginal or \${DateTimeOriginal;s/:/-/g} !~ /^\${Filename;$_=lc($_);s/(\\\d{4})-(\\\d{2})-(\\\d{2})_.*/$1-$2-$3/}/" ^ 
  -overwrite_original ^ 
  "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\03Mars\\VAL_MARS_2025\\*.*"`
              )}
              disabledCopy={isEmpty(photoPath)}
              errorMessage="Veuillez spécifier le chemin du dossier des photos à modifier !"/></article>
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
        <section id="correction" className={styles.sepEtapes}>
          <h2 className={styles.sansCode}>ETAPE 4. CORRECTION DES BUGS/ DOUBLONS/MAUVAIS MOIS</h2>
            <div className={`${styles.column} ${styles.sepCode}`}>
              <article className={styles.column1}>
                <h3>1. Vérifier que les dates dans le nom et la métadonnée sont les mêmes si non corriger</h3>
                <p>a. Aller dans invite de commande</p>
                <p>b. Taper le code :</p></article>
              <article className={styles.column2}>
                <CodeBlock code={generateCode('exiftool "-AllDates<${Filename; s/(\\d{4})-(\\d{2})-(\\d{2}).*/$1:$2:$3 00:00:00/}" "-FileModifyDate<${Filename; s/(\\d{4})-(\\d{2})-(\\d{2}).*/$1:$2:$3 00:00:00/}" "-FileCreateDate<${Filename; s/(\\d{4})-(\\d{2})-(\\d{2}).*/$1:$2:$3 00:00:00/}" -if "not $DateTimeOriginal or $DateTimeOriginal !~ /^${Filename; s/(\\d{4})-(\\d{2})-(\\d{2}).*/$1:$2:$3/}/" -overwrite_original "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS\\*.*"')} 
                disabledCopy={isEmpty(dossierAllPath)}
                errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"/></article>
            </div>
            <article className={styles.sansCode}>
              <h3>2. Vérifier les doublons et supprimer si besoin</h3>
              <p>Reprendre les photos et vérifier visuellement</p>
            </article>
            <article className={styles.sansCode}>
              <h3>3. Oter photo qui ne sont pas du mois</h3>
              <p>a. Reprendre le fichier avec les photos</p>
              <p>b. Récupérer celles qui ne sont pas du mois à trier</p>
              <p>c. Les mettre dans un dossier pour le mois suivant en attendant son tri</p>
            </article>
        </section>
        <section id="amelioration">
          <h2 className={styles.sansCode}>ETAPE 5. AMELIORATION DU TRI DES PHOTOS POUR AIDER AU MONTAGE</h2>
          <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h3>1. Ajout des lieux si besoin entre date et nom pour améliorer tri</h3>
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode('exiftool "-FileName<${Filename; s/^(\\d{4}-\\d{2}-\\d{2})?_?/${1}_chtx_/}" -overwrite_original -if "$Filename =~ /chateauroux|calendrier|Grand-mere/i" -ext jpg -r "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS"')} 
              disabledCopy={isEmpty(dossierAllPath)}
              errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"/>
            </article>
          </div>
          <div className={`${styles.column} ${styles.sepCode}`}>
            <article className={styles.column1}>
              <h3>2. Ajout d&apos;une séquence numérique</h3>
              <p>a. Aller dans powershell</p>
              <p>b. Taper le code :</p>
            </article>
            <article className={styles.column2}>
              <CodeBlock code={generateCode(`$files = Get-ChildItem -Path "C:\\Users\\user\\Desktop\\PHOTOS\\2025\\Janvier\\2025-01-RASSEMBLEMENT-PHOTOS" -Recurse -File |
              Where-Object { $_.Extension -match "jpg|jpeg|png|mp4|mov|avi" } |
              Sort-Object Name
              $count = 1
              foreach ($file in $files) {
                  $newName = "{0:D3}_{1}" -f $count, $file.Name
                  $newPath = Join-Path $file.DirectoryName $newName
                  Rename-Item -Path $file.FullName -NewName $newPath
                  $count++
              }`)} 
              disabledCopy={isEmpty(dossierAllPath)}
              errorMessage="Veuillez spécifier le chemin du dossier avec les photos rassemblées !"/>
            </article>
          </div>
          <article className={styles.sansCode}>
            <h3>3. Modification de la séquence pour améliorer l'ordre</h3>
            <p>a. Reprendre les photos et vérifier visuellement</p>
            <p>b. Modifier manuellement le numéro de la séquence numérique des photos si besoin pour avoir un ordre plus logique : rassembler les photos de personnes ensembles à la suite</p>
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
