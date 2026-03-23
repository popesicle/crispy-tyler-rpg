export type AttributeKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'

export type Attributes = Record<AttributeKey, number>

export type SkillLevel = 'trained' | 'expert'

export interface CharacterSkill {
  name: string
  level: SkillLevel
  specializations: string[]
}

export interface Weapon {
  name: string
  damage: string
}

export interface Expendable {
  name: string
  used: boolean
}

export interface Clock {
  id: string
  name: string
  type: 'progress' | 'threat'
  segments: number  // 4, 6, or 8
  filled: number
}

export type ArmorType = 'light' | 'medium' | 'heavy'

export interface CharacterData {
  id: string
  userId: string
  name: string
  codename: string | null
  backstory: string | null
  attrs: Attributes
  skills: CharacterSkill[]
  talent: string
  talentDesc: string
  armor: ArmorType
  weapons: Weapon[]
  expendables: Expendable[]
  bgTags: string[]
  fatigue: number
  stress: number
  clocks: Clock[]
  activeAuras: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

// Wizard form state (pre-save)
export interface WizardState {
  name: string
  codename: string
  backstory: string
  attrs: Attributes
  skills: CharacterSkill[]
  talent: string
  talentDesc: string
  armor: ArmorType | ''
  weapons: Weapon[]
  expendables: string[]  // names of selected expendables
  bgTags: string[]
}
