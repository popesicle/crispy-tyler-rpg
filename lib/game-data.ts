export const CREATION_RULES = {
  attributePoints: 12,
  attributeMin: 1,
  attributeMax: 5,
  trainedSkills: 3,
  expertSkills: 1,
  expertSpecMin: 1,
  expendableCount: 3,
  backgroundTags: { min: 1, max: 2 },
}

export const EXAMPLE_BUILDS = [
  {
    name: 'Occult Specialist',
    tagline: '"The agency keeps calling me back because the things we find keep matching my books."',
    attrs: { STR: 1, DEX: 2, CON: 2, INT: 3, WIS: 3, CHA: 1 },
    expertSkill: 'Occult & Mythos',
    expertSpecs: ['Demonology', 'Occult Texts & Languages'],
    trainedSkills: ['Parapsychology', 'Criminology & Investigation', 'Empathy & Insight', 'Bureaucracy & Procedure'],
    bgTags: ['Academic (Old University)', 'Former Cult Consultant'],
    talent: 'Occult Pattern Recognition',
    talentDesc:
      'Once per scene, when you succeed on an Occult or Parapsychology roll, you may ask one extra connecting question. The GM must reveal a useful link, pattern, or clue.',
    expendables: ["Saint's Tarnished Medal", 'Binding Salt Vial', 'Whispering Reliquary'],
  },
  {
    name: 'Black-Bag Operator (STR)',
    tagline: '"Kick the door, grab the thing, and get out before anyone knows we were there."',
    attrs: { STR: 4, DEX: 2, CON: 3, INT: 1, WIS: 1, CHA: 1 },
    expertSkill: 'Stealth',
    expertSpecs: ['Facility Infiltration', 'Urban Shadowing'],
    trainedSkills: ['Firearms', 'Athletics', 'Close Quarters Combat', 'Drive / Pilot', 'Tinkering & Demolitions'],
    bgTags: ['Vietnam Vet (Recon)', 'Agency Black Ops'],
    talent: 'Ghost in the Doorframe',
    talentDesc:
      'Once per scene, the first time you fail a Stealth roll, treat it as a partial success: you get into position, but the GM introduces a lesser complication instead of full detection.',
    expendables: ['Ghostlight Projector', 'Resonant Lock Breaker', 'Dead Zone Field Emitter', 'HEM Prototype Round'],
  },
  {
    name: 'Black-Bag Operator (DEX)',
    tagline: '"In and out before anyone even realizes a door was opened."',
    attrs: { STR: 2, DEX: 4, CON: 2, INT: 1, WIS: 2, CHA: 1 },
    expertSkill: 'Stealth',
    expertSpecs: ['Facility Infiltration', 'Urban Shadowing'],
    trainedSkills: ['Firearms', 'Athletics', 'Close Quarters Combat', 'Drive / Pilot', 'Tinkering & Demolitions'],
    bgTags: ['Vietnam Vet (Recon)', 'Agency Black Ops'],
    talent: 'Ghost in the Doorframe',
    talentDesc:
      'Once per scene, the first time you fail a Stealth roll, treat it as a partial success: you get into position, but the GM introduces a lesser complication instead of full detection.',
    expendables: ['Ghostlight Projector', 'Resonant Lock Breaker', 'Dead Zone Field Emitter', 'HEM Prototype Round'],
  },
  {
    name: 'Psi Asset',
    tagline: '"I don\'t need to see the file. I already know what\'s in it."',
    attrs: { STR: 1, DEX: 2, CON: 1, INT: 3, WIS: 3, CHA: 2 },
    expertSkill: 'Parapsychology',
    expertSpecs: ['ESP & Clairvoyance', 'Hauntings'],
    trainedSkills: ['Occult & Mythos', 'Empathy & Insight', 'Persuasion', 'Deception', 'Criminology & Investigation'],
    bgTags: ['Project Subject (Government Psi Program)', 'Odd Childhood'],
    talent: 'Second Sight',
    talentDesc:
      "Once per scene, before making a roll, ask the GM for a brief premonition. If you follow the vision's guidance, gain +1 die on the next relevant roll.",
    expendables: ['MK-Delta Ampoule', 'Remote Viewing Capsule', 'Psychic Feedback Collar'],
  },
]

export const SKILLS = [
  // Physical
  {
    name: 'Athletics',
    attr: 'STR/DEX',
    cat: 'Physical',
    specs: ['Parkour & Rooftops', 'Chases', 'Swimming & Dives', 'Climbing & Scaling'],
  },
  {
    name: 'Stealth',
    attr: 'DEX',
    cat: 'Physical',
    specs: ['Urban Shadowing', 'Rural Stalking', 'Facility Infiltration', 'Camouflage & OPs'],
  },
  {
    name: 'Firearms',
    attr: 'DEX',
    cat: 'Physical',
    specs: ['Handguns', 'Shotguns', 'Rifles', 'SMGs / Automatics'],
  },
  {
    name: 'Close Quarters Combat',
    attr: 'STR/DEX',
    cat: 'Physical',
    specs: ['Grappling & Restraints', 'Knives & Blades', 'Batons & Nightsticks', 'Dirty Fighting'],
  },
  {
    name: 'Drive / Pilot',
    attr: 'DEX',
    cat: 'Physical',
    specs: ['Urban Car Chases', 'Highway Pursuit', 'Motorcycles', 'Light Aircraft / Choppers'],
  },
  // Investigation
  {
    name: 'Criminology & Investigation',
    attr: 'INT',
    cat: 'Investigation',
    specs: ['Crime Scene Analysis', 'Interrogation Prep', 'Profiling', 'Paper Trail Analysis'],
  },
  {
    name: 'Forensics',
    attr: 'INT',
    cat: 'Investigation',
    specs: ['Ballistics', 'Toxicology', 'Pathology', 'Trace Evidence'],
  },
  {
    name: 'Tinkering & Demolitions',
    attr: 'INT/DEX',
    cat: 'Investigation',
    specs: ['Surveillance Gear', 'Lockpicking & Safes', 'Explosives', 'Electronics & Security'],
  },
  {
    name: 'Medicine',
    attr: 'INT/WIS',
    cat: 'Investigation',
    specs: ['First Aid & Triage', 'Emergency Medicine', 'Psychiatry/Counseling', 'Medical Pathology'],
  },
  {
    name: 'Bureaucracy & Procedure',
    attr: 'INT/WIS',
    cat: 'Investigation',
    specs: ['Federal Agencies', 'Local Law Enforcement', 'Records & Archives', 'Procurement & Budgets'],
  },
  {
    name: 'Cryptology & Data',
    attr: 'INT',
    cat: 'Investigation',
    specs: ['Ciphers & Codes', 'Signals Intelligence', 'Computing Systems', 'Records Cross-Referencing'],
  },
  // Social
  {
    name: 'Persuasion',
    attr: 'CHA',
    cat: 'Social',
    specs: ['Negotiation & Deals', 'Official Channels', 'Reassurance', 'Charm & Small Talk'],
  },
  {
    name: 'Deception',
    attr: 'CHA',
    cat: 'Social',
    specs: ['Undercover Identities', 'Forged Documents', 'Fast Talk', 'Misdirection'],
  },
  {
    name: 'Intimidation',
    attr: 'STR/CHA',
    cat: 'Social',
    specs: ['Interrogation Intimidation', 'Street Threats', 'Silent Menace', 'Weapon Display'],
  },
  {
    name: 'Empathy & Insight',
    attr: 'WIS',
    cat: 'Social',
    specs: ['Lie Detection', 'Social Profiling', 'Victim Support', 'Group Dynamics'],
  },
  {
    name: 'Street & Subculture Lore',
    attr: 'WIS/CHA',
    cat: 'Social',
    specs: ['Organized Crime', 'Counterculture', 'Music & Club Scenes', 'Fringe Religious Movements'],
  },
  // Weird
  {
    name: 'Occult & Mythos',
    attr: 'INT/WIS',
    cat: 'Weird',
    specs: ['Demonology', 'Folk Magic & Rural Rites', 'Cults & Secret Societies', 'Occult Texts & Languages'],
  },
  {
    name: 'Parapsychology',
    attr: 'INT',
    cat: 'Weird',
    specs: ['ESP & Clairvoyance', 'Psychokinesis & Poltergeists', 'Hauntings', 'Experimental Protocols'],
  },
  {
    name: 'Fringe Science & Technology',
    attr: 'INT',
    cat: 'Weird',
    specs: ['UFOlogy & Alien Tech', 'Mind Control & MK Projects', 'Energy Anomalies', 'Retro-Tech Engineering'],
  },
]

export const EXPENDABLES = [
  // Fringe Tech
  {
    name: 'Ghostlight Projector',
    cat: 'Fringe Tech',
    effect:
      'All Perception/Investigation rolls in lit area +2 dice. Invisible/ethereal entities visible as hazy silhouettes.',
    drawback: 'At scene end, each exposed character rolls WIS vs D1; failure = 1 Stress.',
  },
  {
    name: 'Resonant Lock Breaker',
    cat: 'Fringe Tech',
    effect: 'Auto-succeed on one Tinkering (Lockpicking & Safes) test up to D3. No roll needed.',
    drawback: 'Leaves a distinctive vibration pattern that expert forensics may trace to your organization.',
  },
  {
    name: 'Dead Zone Field Emitter',
    cat: 'Fringe Tech',
    effect: 'Jams all radio, phone, and basic electronic surveillance in ~10m radius for one scene.',
    drawback: 'All Fringe Tech / Psi gear in the zone rolls at −1 die while active.',
  },
  {
    name: 'HEM Prototype Round',
    cat: 'Fringe Tech / Weapon',
    effect: 'On hit: +2 damage and ignore armor soak for this shot.',
    drawback: 'If used on a normal human, shooter gains 1 Stress after seeing the wound.',
  },
  // Occult
  {
    name: "Saint's Tarnished Medal",
    cat: 'Occult Talisman',
    effect: 'Auto-pass one WIS or CHA defense roll against a mental or spiritual assault.',
    drawback: 'The medal blackens and becomes mundane once used.',
  },
  {
    name: 'Binding Salt Vial',
    cat: 'Occult Warding',
    effect:
      'Creates a ward for the scene. Spirits/demons must roll WIS/INT vs D3 to cross; failure = cannot cross that round.',
    drawback: 'If a PC voluntarily breaks the circle, all such entities gain +1 die on hostile actions next round.',
  },
  {
    name: 'Blood-Stained Tarot Card',
    cat: 'Occult Fortune',
    effect: 'After a roll: treat one 4 as a hit and one 6 as 2 hits (effectively +2 hits).',
    drawback: 'Immediately gain 1 Stress; GM may introduce a symbolic omen that complicates events.',
  },
  {
    name: 'Whispering Reliquary',
    cat: 'Occult Artifact',
    effect:
      'Ask one paranormal question aloud; receive a cryptic answer + gain +2 dice on next Occult or Parapsychology roll tied to that info.',
    drawback: "GM may ask one intrusive question about your character's past; you must answer honestly in-character.",
  },
  // Psi
  {
    name: 'MK-Delta Ampoule',
    cat: 'Psi / Chemical',
    effect: 'For one scene, on any INT, WIS, or CHA roll you may reroll 1 die for free.',
    drawback: 'At scene end, roll CON vs D2; failure = 2 Stress and 1 Fatigue from the crash.',
  },
  {
    name: 'Remote Viewing Capsule',
    cat: 'Psi / Chemical',
    effect:
      'Perceive a remote known location. INT (Parapsychology) vs D2–D3; success = solid intel + +2 dice on future Stealth/Investigation rolls at that site.',
    drawback: 'While in trance your body is helpless; if disturbed, gain 1 Stress and the vision ends immediately.',
  },
  {
    name: 'Psychic Feedback Collar',
    cat: 'Psi Tech',
    effect:
      'When you or a nearby ally is targeted by a psychic/mental power: reduce incoming effect by 1–2 hits and force attacker to roll INT vs D2 or take 1 Stress.',
    drawback: 'The collar overloads and burns out in sparks after use.',
  },
  // Bureaucratic
  {
    name: 'Midnight Clearance Letter',
    cat: 'Bureaucratic',
    effect:
      'Treat one major social obstacle as D1; on success also clear future checks from this group for this operation.',
    drawback: 'Ineffective against major rival agencies or other clandestine branches.',
  },
  {
    name: 'Retroactive Transfer Form',
    cat: 'Bureaucratic',
    effect:
      'One paper-based obstacle is automatically cleared: a record vanishes, a suspect appears moved, or evidence gets logged under your unit.',
    drawback: 'GM may create future complications: discrepancies, rival inquiries, or strange audits.',
  },
  {
    name: 'Unquestionable Badge',
    cat: 'Authority Totem',
    effect:
      'Auto-succeed on one Persuasion or Intimidation roll to make someone stand down, let you pass, or back off.',
    drawback: 'The target remembers your face perfectly and may later describe you to others.',
  },
]

export const AURAS = [
  {
    name: 'Focus Field',
    effect: '+1 die on INT or WIS rolls. Ignore the first −1 die penalty from Stress.',
    cost: 'When Aura ends, take 1 additional Stress.',
  },
  {
    name: 'Harden',
    effect: 'Reduce incoming physical damage by 1 (before soak). +1 die to resist forced movement or knockdown.',
    cost: '−1 die on social rolls while active.',
  },
  {
    name: 'Command Presence',
    effect:
      '+1 die to Persuasion, Intimidation, and leadership teamwork rolls. Successful aid grants +2 dice instead of +1.',
    cost: 'If you fail a CHA roll, take 1 Stress.',
  },
  {
    name: 'Veil',
    effect: '+1 die to Stealth and defense rolls. First attack against you each round suffers −1 die.',
    cost: 'Cannot benefit from MARK while this Aura is active.',
  },
]

export const WORDS_OF_POWER = [
  { name: 'Bind', effect: 'Prevent movement or action for 1 round per hit.' },
  { name: 'Move', effect: 'Push, pull, or reposition objects or entities.' },
  { name: 'Silence', effect: 'Suppress sound or resonance-based effects for 1–2 rounds.' },
  { name: 'Mark', effect: 'Reveal or name a target; allies gain +1 die against it for the scene.' },
]

export const ARMOR_OPTIONS = [
  {
    type: 'light' as const,
    label: 'Light',
    soak: 'Soak 1d6',
    modifier: 'Initiative +1',
    description: 'Field jacket, concealed vest. Fast and mobile.',
  },
  {
    type: 'medium' as const,
    label: 'Medium',
    soak: 'Soak 2d6',
    modifier: 'No modifier',
    description: 'Standard tactical vest. Balanced protection.',
  },
  {
    type: 'heavy' as const,
    label: 'Heavy',
    soak: 'Soak 3d6',
    modifier: 'Initiative −1',
    description: 'Full plate carrier. Maximum protection, restricted movement.',
  },
]
