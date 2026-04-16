export interface SurveyResponse {
  id: string
  timestamp: string
  roomNumber: string
  name: string
  renovationPeriod: string
  renovationPeriodOther?: string
  repairFundPlan: string
  repairFundPlanOther?: string
  freeOpinion?: string
}

export type RenovationPeriod = '12年' | '13年' | '14年' | '15年' | 'その他'
export type RepairFundPlan = '１案' | '２案' | '３案' | 'その他'
