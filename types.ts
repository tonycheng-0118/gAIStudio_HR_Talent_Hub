
export interface Participant {
  id: string;
  name: string;
}

export type ViewState = 'INPUT' | 'LOTTERY' | 'GROUPING';

export interface Group {
  id: number;
  name: string;
  members: Participant[];
}
