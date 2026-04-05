export type Relic = 'aegis' | 'guardian' | 'overdrive'

export interface RelicDefinition {
  description: string
  id: Relic
  label: string
}
