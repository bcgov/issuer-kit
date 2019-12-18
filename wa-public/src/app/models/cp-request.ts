export interface ICPRequest {
  SearchTerm: string;
  LanguagePreference: CPLanguagePreferenceType;
  Key: string;
}

export type CPLanguagePreferenceType = 'EN';

export class CpRequest implements ICPRequest {
  SearchTerm: string;
  LanguagePreference: CPLanguagePreferenceType;
  Key: string;

  constructor(SearchTerm: string) {
    this.SearchTerm = SearchTerm;
    this.LanguagePreference = 'EN';
    this.Key = 'UP49-MX76-PT22-ZM49';
  }
}
