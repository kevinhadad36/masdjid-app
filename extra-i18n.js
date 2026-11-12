// Textes des fonctions ajoutées (série, rappels, compte, formule de rendez-vous).
// Seuls fr et en sont écrits ; les autres langues retombent sur le français (voir t() dans index.html).
// À traduire puis FAIRE RELIRE par des locuteurs natifs. Les rappels sont des textes de démonstration à faire valider par un savant.
Object.assign(TR.fr,{
 rappels:'Rappels',account:'Compte',accountD:'E-mail ou téléphone (maquette)',
 fShort:'Courts',fLong:'Plus longs',fLive:'Lives',demoTag:'DÉMO',live:'EN DIRECT',
 like:'J\'aime',react:'Réagir',reactHint:'Choisis une réaction. Aucun message libre n\'est possible dans l\'appli.',shareBtn:'Partager',
 playSim:'Lecture simulée (vidéos de démonstration)',noLive:'Aucun live pour l\'instant. Les mosquées autorisées pourront diffuser ici.',
 cm0:'Barakallahu fik',cm1:'Jazakum Allahu khayran',cm2:'Amîn',cm3:'Très utile',cm4:'Qu\'Allah nous guide',cm5:'Masha\'Allah',
 rq1:'Les actions ne valent que par les intentions.',rs1:'Hadith — Bukhari & Muslim',
 rq2:'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',rs2:'Hadith — Bukhari',
 rq3:'Sourire à ton frère est une aumône.',rs3:'Hadith — Tirmidhi',
 rq4:'Un long rappel sur le bon comportement envers ses voisins et les personnes âgées.',rs4:'Rappel long (démo)',
 rq5:'Cours de la semaine : rappel sur la prière à l\'heure.',rs5:'Rediffusion (démo)',
 rqLive:'Cours du soir en direct depuis la mosquée.',rsLive:'Live (démo)',
 serie:'Ma série',serieDays:'{n} jour(s) de suite',serieStart:'Commence ta série aujourd\'hui',serieToday:'Aujourd\'hui, j\'ai prié :',
 serieNote:'Déclaratif : rien n\'est vérifié. Un jour compte dès {n} prière(s) cochée(s). Règle provisoire.',serieMile:'Bravo ! {n} jours de suite',serieBadge:'Ma série de prières',
 acKind:'Je m\'inscris avec',acEmail:'E-mail',acPhone:'Téléphone',acPh_email:'prenom@exemple.fr',acPh_phone:'06 12 34 56 78',
 acCreate:'Créer mon compte (maquette)',acBad:'Saisie invalide',acSaved:'Compte créé (maquette)',acOut:'Se déconnecter',acHello:'Connecté avec',
 acNote:'Maquette : rien n\'est envoyé ni vérifié, et aucune donnée ne quitte ce téléphone. Dans la vraie version, un code de vérification sera envoyé par e-mail ou SMS ; un des deux suffit.',
 meet:'Rendez-vous {place} pour aller à la mosquée',pl_entry:'à l\'entrée',pl_parking:'au parking',pl_bus:'à l\'arrêt de bus',
 meetHint:'Rendez-vous :'
});
Object.assign(TR.en,{
 rappels:'Reminders',account:'Account',accountD:'Email or phone (mock-up)',
 fShort:'Short',fLong:'Longer',fLive:'Lives',demoTag:'DEMO',live:'LIVE',
 like:'Like',react:'React',reactHint:'Pick a reaction. Free messages are not possible in the app.',shareBtn:'Share',
 playSim:'Simulated playback (demo videos)',noLive:'No live right now. Authorised mosques will be able to broadcast here.',
 cm0:'Barakallahu fik',cm1:'Jazakum Allahu khayran',cm2:'Ameen',cm3:'Very useful',cm4:'May Allah guide us',cm5:'Masha\'Allah',
 rq1:'Actions are judged only by intentions.',rs1:'Hadith — Bukhari & Muslim',
 rq2:'The best of you is the one who learns the Quran and teaches it.',rs2:'Hadith — Bukhari',
 rq3:'Smiling at your brother is charity.',rs3:'Hadith — Tirmidhi',
 rq4:'A longer reminder on good conduct towards neighbours and the elderly.',rs4:'Long reminder (demo)',
 rq5:'This week\'s lesson: a reminder on praying on time.',rs5:'Replay (demo)',
 rqLive:'Evening lesson live from the mosque.',rsLive:'Live (demo)',
 serie:'My streak',serieDays:'{n} day(s) in a row',serieStart:'Start your streak today',serieToday:'Today I prayed:',
 serieNote:'Self-declared: nothing is verified. A day counts from {n} ticked prayer(s). Provisional rule.',serieMile:'Well done! {n} days in a row',serieBadge:'My prayer streak',
 acKind:'I sign up with',acEmail:'Email',acPhone:'Phone',acPh_email:'name@example.com',acPh_phone:'06 12 34 56 78',
 acCreate:'Create my account (mock-up)',acBad:'Invalid entry',acSaved:'Account created (mock-up)',acOut:'Sign out',acHello:'Signed in with',
 acNote:'Mock-up: nothing is sent or verified, and no data leaves this phone. In the real version a verification code will be sent by email or SMS; one of the two is enough.',
 meet:'Meet at {place} to go to the mosque',pl_entry:'the entrance',pl_parking:'the car park',pl_bus:'the bus stop',
 meetHint:'Meet-up:'
});

// --- covoiturage séparé frères/sœurs, cours des mosquées ---
Object.assign(TR.fr,{
 brother:'Frère',sister:'Sœur',iAm:'Je suis',
 womenOnly:'Espace sœurs : les trajets sont uniquement entre sœurs.',menOnly:'Espace frères : les trajets sont uniquement entre frères.',
 pickGender:'Choisis frère ou sœur pour voir et proposer des trajets.',
 genderNote:'Séparation stricte : une sœur ne voit et ne propose des trajets qu\'avec des sœurs, un frère qu\'avec des frères. Maquette : le choix est déclaratif ; la vraie version devra le contrôler côté serveur.',
 forWhat:'Pour',courseOpt:'Cours',cours:'Cours',coursD:'Horaires des cours et covoiturage',
 coursNote:'Horaires des cours des mosquées, avec covoiturage pour s\'y rendre. Données de démonstration : les mosquées renseigneront leurs vrais cours.',
 coursEmpty:'Les autres mosquées n\'ont pas encore renseigné leurs cours. Une mosquée vérifiée peut les ajouter (Réglages > mode mosquée).',
 audMen:'Frères',audWomen:'Sœurs',audAll:'Tous',
 cTitle1:'Cours de fiqh (démo)',cTitle2:'Cours de Coran pour sœurs (démo)',cTitle3:'Cours d\'arabe (démo)',
 addCours:'Ajouter un cours',cPh:'Titre du cours',cBad:'Titre, jour et heure sont obligatoires',cAdded:'Cours ajouté',delCours:'Supprimer ce cours'
});
Object.assign(TR.en,{
 brother:'Brother',sister:'Sister',iAm:'I am',
 womenOnly:'Sisters\' space: rides are between sisters only.',menOnly:'Brothers\' space: rides are between brothers only.',
 pickGender:'Choose brother or sister to see and offer rides.',
 genderNote:'Strict separation: a sister only sees and offers rides with sisters, a brother only with brothers. Mock-up: the choice is self-declared; the real version must enforce it on the server.',
 forWhat:'For',courseOpt:'Class',cours:'Classes',coursD:'Class times and carpooling',
 coursNote:'Mosque class times, with carpooling to get there. Demo data: mosques will enter their real classes.',
 coursEmpty:'Other mosques have not entered their classes yet. A verified mosque can add them (Settings > mosque mode).',
 audMen:'Brothers',audWomen:'Sisters',audAll:'Everyone',
 cTitle1:'Fiqh class (demo)',cTitle2:'Quran class for sisters (demo)',cTitle3:'Arabic class (demo)',
 addCours:'Add a class',cPh:'Class title',cBad:'Title, day and time are required',cAdded:'Class added',delCours:'Delete this class'
});
