export type VulnerabilityRecord =
  Record<string, unknown>;

export interface ValidationError {
  path: Array<string | number>;
  schemaPath: Array<string | number>;
  message: string;
  validator?: string;
}

export interface ValidationResult {
  valid: boolean;
  profile: string;
  errors: ValidationError[];
}

export interface EditorCapabilities {
  apiVersion: string;
  recordProfiles: string[];

  features: {
    recordStorage: boolean;
    validation: boolean;
    cpeSearch: boolean;
    publication: boolean;
  };
}

export interface EditorRepository {
  getCapabilities(): Promise<EditorCapabilities>;

  loadRecord(
    identifier: string,
  ): Promise<VulnerabilityRecord>;

  createRecord(
    record: VulnerabilityRecord,
    profile: string,
  ): Promise<VulnerabilityRecord>;

  updateRecord(
    identifier: string,
    record: VulnerabilityRecord,
    profile: string,
  ): Promise<VulnerabilityRecord>;

  validateRecord(
    record: VulnerabilityRecord,
    profile: string,
  ): Promise<ValidationResult>;
}
