
export interface AutomationTrigger {
  id: string;
  name: string;
  description: string;
  color: string;
  keywords: string[];
  subTriggers?: SubTrigger[];
}

export interface SubTrigger {
  id: string;
  name: string;
  icon: string;
}
