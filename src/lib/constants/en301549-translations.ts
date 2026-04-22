// src/lib/constants/en301549-translations.ts
// Official EN 301 549 criterion name translations.
// French and German: ETSI EN 301 549 v3.2.1 official publications.
// Spanish: No official ETSI Spanish translation — es entries are null (English fallback).
// Clauses 10, 11, 13 (WCAG-derived): null for all locales — English fallback.

export interface En301549CriterionTranslation {
  fr: string | null;
  es: null; // No official ETSI Spanish translation
  de: string | null;
}

export const EN301549_TRANSLATIONS: Record<string, En301549CriterionTranslation> = {
  // Clause 4: Functional Performance Statements
  '4.2.1': { fr: 'Utilisation sans vision', es: null, de: 'Nutzung ohne Sicht' },
  '4.2.2': {
    fr: 'Utilisation avec une vision limitée',
    es: null,
    de: 'Nutzung mit eingeschränkter Sehfähigkeit',
  },
  '4.2.3': {
    fr: 'Utilisation sans perception de la couleur',
    es: null,
    de: 'Nutzung ohne Farbwahrnehmung',
  },
  '4.2.4': { fr: 'Utilisation sans audition', es: null, de: 'Nutzung ohne Hörfähigkeit' },
  '4.2.5': {
    fr: 'Utilisation avec une audition limitée',
    es: null,
    de: 'Nutzung mit eingeschränkter Hörfähigkeit',
  },
  '4.2.6': { fr: 'Utilisation sans aptitude vocale', es: null, de: 'Nutzung ohne Sprachfähigkeit' },
  '4.2.7': {
    fr: 'Utilisation avec une dextérité ou une force limitée',
    es: null,
    de: 'Nutzung mit eingeschränkter Handhabungsfähigkeit oder Körperkraft',
  },
  '4.2.8': {
    fr: 'Utilisation avec une portée limitée',
    es: null,
    de: 'Nutzung mit eingeschränkter Reichweite',
  },
  '4.2.9': {
    fr: 'Réduire au minimum le risque de crise épileptique photosensible',
    es: null,
    de: 'Minimierung des Risikos lichtempfindlicher Anfälle',
  },

  // Clause 5: Generic Requirements
  '5.2': {
    fr: "Activation des caractéristiques d'accessibilité",
    es: null,
    de: 'Aktivierung von Barrierefreiheitsfunktionen',
  },
  '5.3': { fr: 'Biométrie', es: null, de: 'Biometrie' },
  '5.4': {
    fr: "Préservation des informations d'accessibilité lors de la conversion",
    es: null,
    de: 'Erhaltung von Barrierefreiheitsinformationen bei der Konvertierung',
  },
  '5.8': { fr: 'Activation accidentelle', es: null, de: 'Unbeabsichtigte Aktivierung' },
  '5.9': {
    fr: "Actions simultanées par l'utilisateur",
    es: null,
    de: 'Simultane Benutzeraktionen',
  },

  // Clause 6: ICT with Two-Way Voice Communication
  '6.1': {
    fr: 'Largeur de bande audio pour la parole',
    es: null,
    de: 'Audiobandbreite für Sprache',
  },
  '6.2.1.1': {
    fr: 'Communication par texte en temps réel',
    es: null,
    de: 'Echtzeit-Textkommunikation',
  },
  '6.2.1.2': {
    fr: 'Voix et texte simultanés',
    es: null,
    de: 'Gleichzeitige Sprach- und Textkommunikation',
  },
  '6.2.2.1': {
    fr: 'Affichage visuellement distinguable',
    es: null,
    de: 'Visuell unterscheidbares Display',
  },
  '6.2.2.2': {
    fr: "Indication déterminable par programmation de la direction de l'envoi et de la réception",
    es: null,
    de: 'Programmgesteuert bestimmbare Sende- und Empfangsrichtung',
  },
  '6.2.3': { fr: 'Interopérabilité', es: null, de: 'Interoperabilität' },
  '6.2.4': {
    fr: 'Réactivité du texte en temps réel',
    es: null,
    de: 'Reaktionsfähigkeit von Echtzeittext',
  },
  '6.3': { fr: "Identification de l'appelant", es: null, de: 'Anruferkennung' },
  '6.4': {
    fr: 'Alternatives aux services de téléphonie vocale',
    es: null,
    de: 'Alternativen zu Sprachtelefondiensten',
  },
  '6.5.1': { fr: 'Général (vidéo)', es: null, de: 'Allgemein (Video)' },
  '6.5.2': { fr: 'Résolution', es: null, de: 'Auflösung' },
  '6.5.3': { fr: "Fréquence d'images", es: null, de: 'Bildfrequenz' },
  '6.5.4': { fr: 'Synchronisation audio-vidéo', es: null, de: 'Audio-Video-Synchronisation' },

  // Clause 7: ICT with Video Capabilities
  '7.1.1': { fr: 'Lecture des sous-titres', es: null, de: 'Wiedergabe von Untertiteln' },
  '7.1.2': {
    fr: 'Synchronisation des sous-titres',
    es: null,
    de: 'Synchronisation von Untertiteln',
  },
  '7.1.3': { fr: 'Préservation des sous-titres', es: null, de: 'Erhaltung von Untertiteln' },
  '7.1.4': { fr: 'Caractéristiques des sous-titres', es: null, de: 'Merkmale von Untertiteln' },
  '7.1.5': { fr: 'Sous-titres vocaux', es: null, de: 'Gesprochene Untertitel' },
  '7.2.1': {
    fr: "Lecture de l'audiodescription",
    es: null,
    de: 'Wiedergabe von Audiobeschreibungen',
  },
  '7.2.2': {
    fr: "Synchronisation de l'audiodescription",
    es: null,
    de: 'Synchronisation von Audiobeschreibungen',
  },
  '7.2.3': {
    fr: "Préservation de l'audiodescription",
    es: null,
    de: 'Erhaltung von Audiobeschreibungen',
  },
  '7.3': {
    fr: "Commandes utilisateur pour les sous-titres et l'audiodescription",
    es: null,
    de: 'Benutzersteuerung für Untertitel und Audiobeschreibungen',
  },

  // Clause 8: Hardware
  '8.1.1': {
    fr: 'Général (exigences génériques)',
    es: null,
    de: 'Allgemein (generische Anforderungen)',
  },
  '8.1.2': { fr: 'Connexions standard', es: null, de: 'Standardverbindungen' },
  '8.1.3': { fr: 'Couleur', es: null, de: 'Farbe' },
  '8.2.1.1': { fr: 'Niveau sonore de la parole', es: null, de: 'Sprachschalllautstärke' },
  '8.2.1.2': { fr: 'Amplification des données', es: null, de: 'Datenverstärkung' },
  '8.2.2.1': {
    fr: "Réception d'une bobine de téléphone",
    es: null,
    de: 'Induktivkopplungsempfang',
  },
  '8.2.2.2': {
    fr: 'Appareils auditifs numériques/analogiques',
    es: null,
    de: 'Digitale/analoge Hörgeräte',
  },
  '8.3.2.1': { fr: 'Espace libre au sol', es: null, de: 'Bodenfreiheit' },
  '8.3.2.2': { fr: 'Espace libre au sol non obstrué', es: null, de: 'Unverstellte Bodenfreiheit' },
  '8.3.3.1': {
    fr: "Portée au-dessus d'un obstacle",
    es: null,
    de: 'Reichweite über ein Hindernis',
  },
  '8.3.3.2': { fr: "Portée autour d'un obstacle", es: null, de: 'Reichweite um ein Hindernis' },
  '8.3.4.1': { fr: "Portée vers l'avant", es: null, de: 'Vorwärtsreichweite' },
  '8.3.5': {
    fr: 'Lisibilité des informations visuelles',
    es: null,
    de: 'Lesbarkeit visueller Informationen',
  },
  '8.4.1': { fr: 'Touches numériques', es: null, de: 'Zahlentasten' },
  '8.4.2': { fr: 'Touches à fonctions alphabétiques', es: null, de: 'Buchstabentasten' },
  '8.4.3': { fr: 'Touches à fonctions', es: null, de: 'Funktionstasten' },
  '8.5': {
    fr: 'Présence tactile ou auditive',
    es: null,
    de: 'Taktile oder akustische Anwesenheit',
  },

  // Clause 12: Documentation and Support Services
  '12.1.1': {
    fr: "Caractéristiques d'accessibilité et de compatibilité",
    es: null,
    de: 'Barrierefreiheits- und Kompatibilitätsfunktionen',
  },
  '12.2.2': {
    fr: "Informations sur les caractéristiques d'accessibilité",
    es: null,
    de: 'Informationen zu Barrierefreiheitsfunktionen',
  },
  '12.2.3': { fr: 'Communication efficace', es: null, de: 'Effektive Kommunikation' },
  '12.2.4': { fr: 'Documentation accessible', es: null, de: 'Zugängliche Dokumentation' },

  // Clause 13: ICT Providing Relay or Emergency Service Access
  '13.1.2': {
    fr: 'Service de relais téléphonique textuel',
    es: null,
    de: 'Schrifttelefon-Relay-Dienst',
  },
  '13.1.3': {
    fr: 'Service de relais en langue des signes',
    es: null,
    de: 'Gebärdensprach-Relay-Dienst',
  },
  '13.1.4': {
    fr: 'Service de relais avec sous-titrage oral',
    es: null,
    de: 'Sprechuntertitel-Relay-Dienst',
  },
  '13.1.5': {
    fr: 'Service de relais avec communication vidéo',
    es: null,
    de: 'Video-Relay-Dienst',
  },
  '13.1.6': {
    fr: 'Service de relais téléphonique vocal',
    es: null,
    de: 'Sprachtelefon-Relay-Dienst',
  },
  '13.2': { fr: "Accès aux services d'urgence", es: null, de: 'Zugang zu Notfalldiensten' },
  '13.3': {
    fr: "Accès aux services d'urgence par texte en temps réel",
    es: null,
    de: 'Zugang zu Notfalldiensten über Echtzeittext',
  },
};
