import { CREATION_RULES } from './game-data'
import type { Attributes, ArmorType, CharacterSkill, Clock, Expendable, Weapon } from '@/types/character'

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

type CreateCharacterPayload = {
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
}

type CharacterUpdatePayload = Partial<CreateCharacterPayload & {
  fatigue: number
  stress: number
  clocks: Clock[]
  activeAuras: string[]
  notes: string
}>

const ATTR_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const
const ARMOR_TYPES = ['light', 'medium', 'heavy'] as const
const SKILL_LEVELS = ['trained', 'expert'] as const
const CLOCK_TYPES = ['progress', 'threat'] as const
const CLOCK_SEGMENTS = [4, 6, 8] as const

const MAX = {
  name: 80,
  codename: 80,
  backstory: 2000,
  talent: 80,
  talentDesc: 1000,
  weaponName: 80,
  weaponDamage: 80,
  expendableName: 120,
  backgroundTag: 120,
  skillName: 80,
  specialization: 80,
  clockId: 80,
  clockName: 120,
  aura: 120,
  notes: 5000,
}

export function validateCreateCharacterPayload(body: unknown): ValidationResult<CreateCharacterPayload> {
  if (!isPlainObject(body)) return invalid('Invalid character payload.')

  const name = requiredString(body.name, MAX.name)
  const codename = optionalString(body.codename, MAX.codename)
  const backstory = optionalString(body.backstory, MAX.backstory)
  const attrs = validateAttrs(body.attrs)
  const skills = validateSkills(body.skills, true)
  const talent = requiredString(body.talent, MAX.talent)
  const talentDesc = requiredString(body.talentDesc, MAX.talentDesc)
  const armor = validateEnum<ArmorType>(body.armor, ARMOR_TYPES)
  const weapons = validateWeapons(body.weapons)
  const expendables = validateExpendables(body.expendables)
  const bgTags = validateStringArray(body.bgTags, CREATION_RULES.backgroundTags.max, MAX.backgroundTag)

  if (
    !name ||
    codename === undefined ||
    backstory === undefined ||
    !attrs ||
    !skills ||
    !talent ||
    !talentDesc ||
    !armor ||
    !weapons ||
    !expendables ||
    !bgTags
  ) {
    return invalid('Invalid character payload.')
  }

  if (expendables.length !== CREATION_RULES.expendableCount) {
    return invalid(`Exactly ${CREATION_RULES.expendableCount} expendables are required.`)
  }

  if (bgTags.length < CREATION_RULES.backgroundTags.min) {
    return invalid('At least one background tag is required.')
  }

  return {
    ok: true,
    data: { name, codename, backstory, attrs, skills, talent, talentDesc, armor, weapons, expendables, bgTags },
  }
}

export function validateCharacterUpdates(body: unknown): ValidationResult<CharacterUpdatePayload> {
  if (!isPlainObject(body)) return invalid('Invalid character update.')

  const updates: CharacterUpdatePayload = {}

  for (const [key, value] of Object.entries(body)) {
    switch (key) {
      case 'name': {
        const name = requiredString(value, MAX.name)
        if (!name) return invalid('Invalid character name.')
        updates.name = name
        break
      }
      case 'codename':
        updates.codename = optionalString(value, MAX.codename)
        if (updates.codename === undefined) return invalid('Invalid codename.')
        break
      case 'backstory':
        updates.backstory = optionalString(value, MAX.backstory)
        if (updates.backstory === undefined) return invalid('Invalid backstory.')
        break
      case 'attrs': {
        const attrs = validateAttrs(value)
        if (!attrs) return invalid('Invalid attributes.')
        updates.attrs = attrs
        break
      }
      case 'skills': {
        const skills = validateSkills(value, false)
        if (!skills) return invalid('Invalid skills.')
        updates.skills = skills
        break
      }
      case 'talent': {
        const talent = requiredString(value, MAX.talent)
        if (!talent) return invalid('Invalid talent.')
        updates.talent = talent
        break
      }
      case 'talentDesc': {
        const talentDesc = requiredString(value, MAX.talentDesc)
        if (!talentDesc) return invalid('Invalid talent description.')
        updates.talentDesc = talentDesc
        break
      }
      case 'armor': {
        const armor = validateEnum<ArmorType>(value, ARMOR_TYPES)
        if (!armor) return invalid('Invalid armor.')
        updates.armor = armor
        break
      }
      case 'weapons': {
        const weapons = validateWeapons(value)
        if (!weapons) return invalid('Invalid weapons.')
        updates.weapons = weapons
        break
      }
      case 'expendables': {
        const expendables = validateExpendables(value)
        if (!expendables) return invalid('Invalid expendables.')
        updates.expendables = expendables
        break
      }
      case 'bgTags': {
        const bgTags = validateStringArray(value, CREATION_RULES.backgroundTags.max, MAX.backgroundTag)
        if (!bgTags) return invalid('Invalid background tags.')
        updates.bgTags = bgTags
        break
      }
      case 'fatigue': {
        const fatigue = validateInteger(value, 0, 20)
        if (fatigue === null) return invalid('Invalid fatigue.')
        updates.fatigue = fatigue
        break
      }
      case 'stress': {
        const stress = validateInteger(value, 0, 20)
        if (stress === null) return invalid('Invalid stress.')
        updates.stress = stress
        break
      }
      case 'clocks': {
        const clocks = validateClocks(value)
        if (!clocks) return invalid('Invalid clocks.')
        updates.clocks = clocks
        break
      }
      case 'activeAuras': {
        const activeAuras = validateStringArray(value, 10, MAX.aura)
        if (!activeAuras) return invalid('Invalid active auras.')
        updates.activeAuras = activeAuras
        break
      }
      case 'notes': {
        const notes = stringWithMax(value, MAX.notes)
        if (notes === null) return invalid('Invalid notes.')
        updates.notes = notes
        break
      }
    }
  }

  if (Object.keys(updates).length === 0) return invalid('No valid update fields were provided.')

  return { ok: true, data: updates }
}

function validateAttrs(value: unknown): Attributes | null {
  if (!isPlainObject(value)) return null

  const attrs: Partial<Attributes> = {}

  for (const key of ATTR_KEYS) {
    const attr = validateInteger(value[key], CREATION_RULES.attributeMin, CREATION_RULES.attributeMax)
    if (attr === null) return null
    attrs[key] = attr
  }

  if (Object.keys(value).some((key) => !ATTR_KEYS.includes(key as typeof ATTR_KEYS[number]))) return null

  const total = ATTR_KEYS.reduce((sum, key) => sum + (attrs[key] ?? 0), 0)
  if (total !== CREATION_RULES.attributePoints) return null

  return attrs as Attributes
}

function validateSkills(value: unknown, requireCreationCounts: boolean): CharacterSkill[] | null {
  if (!Array.isArray(value) || value.length > 8) return null

  const skills: CharacterSkill[] = []

  for (const item of value) {
    if (!isPlainObject(item)) return null

    const name = requiredString(item.name, MAX.skillName)
    const level = validateEnum(item.level, SKILL_LEVELS)
    const specializations = validateStringArray(item.specializations, 4, MAX.specialization)

    if (!name || !level || !specializations) return null
    if (level === 'trained' && specializations.length > 0) return null
    if (level === 'expert' && specializations.length === 0) return null

    skills.push({ name, level, specializations })
  }

  const names = new Set(skills.map((skill) => skill.name))
  if (names.size !== skills.length) return null

  const trainedCount = skills.filter((skill) => skill.level === 'trained').length
  const expertCount = skills.filter((skill) => skill.level === 'expert').length

  if (expertCount > CREATION_RULES.expertSkills) return null
  if (requireCreationCounts && (
    trainedCount !== CREATION_RULES.trainedSkills ||
    expertCount !== CREATION_RULES.expertSkills ||
    skills.some((skill) => skill.level === 'expert' && skill.specializations.length < CREATION_RULES.expertSpecMin)
  )) {
    return null
  }

  return skills
}

function validateWeapons(value: unknown): Weapon[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 4) return null

  return validateObjectArray(value, (item) => {
    const name = requiredString(item.name, MAX.weaponName)
    const damage = requiredString(item.damage, MAX.weaponDamage)
    return name && damage ? { name, damage } : null
  })
}

function validateExpendables(value: unknown): Expendable[] | null {
  if (!Array.isArray(value) || value.length > 10) return null

  return validateObjectArray(value, (item) => {
    const name = requiredString(item.name, MAX.expendableName)
    return name && typeof item.used === 'boolean' ? { name, used: item.used } : null
  })
}

function validateClocks(value: unknown): Clock[] | null {
  if (!Array.isArray(value) || value.length > 12) return null

  return validateObjectArray(value, (item) => {
    const id = requiredString(item.id, MAX.clockId)
    const name = requiredString(item.name, MAX.clockName)
    const type = validateEnum(item.type, CLOCK_TYPES)
    const segments = validateEnum(item.segments, CLOCK_SEGMENTS)
    const filled = segments ? validateInteger(item.filled, 0, segments) : null

    return id && name && type && segments && filled !== null
      ? { id, name, type, segments, filled }
      : null
  })
}

function validateObjectArray<T>(items: unknown[], validate: (item: Record<string, unknown>) => T | null): T[] | null {
  const result: T[] = []

  for (const item of items) {
    if (!isPlainObject(item)) return null

    const validated = validate(item)
    if (!validated) return null

    result.push(validated)
  }

  return result
}

function validateStringArray(value: unknown, maxItems: number, maxLength: number): string[] | null {
  if (!Array.isArray(value) || value.length > maxItems) return null

  const strings: string[] = []

  for (const item of value) {
    const text = requiredString(item, maxLength)
    if (!text) return null
    strings.push(text)
  }

  return strings
}

function requiredString(value: unknown, maxLength: number): string | null {
  const text = stringWithMax(value, maxLength)
  return text && text.length > 0 ? text : null
}

function optionalString(value: unknown, maxLength: number): string | null | undefined {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') return undefined
  const text = value.trim()
  return text.length <= maxLength ? text : undefined
}

function stringWithMax(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length <= maxLength ? text : null
}

function validateInteger(value: unknown, min: number, max: number): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max ? value : null
}

function validateEnum<T extends string | number>(value: unknown, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? value as T : null
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function invalid(error: string): ValidationResult<never> {
  return { ok: false, error }
}
