import type {
  EditorCapabilities,
  EditorRepository,
  ValidationResult,
  VulnerabilityRecord,
} from "@/editor/contracts";

export class HttpRepository
  implements EditorRepository
{
  constructor(
    private readonly apiRoot = "/api/v1",
  ) {}

  getCapabilities(): Promise<EditorCapabilities> {
    return this.request("/capabilities");
  }

  async loadRecord(
    identifier: string,
  ): Promise<VulnerabilityRecord> {
    const response = await this.request<{
      record: VulnerabilityRecord;
    }>(
      `/records/${encodeURIComponent(identifier)}`,
    );

    return response.record;
  }

  async createRecord(
    record: VulnerabilityRecord,
    profile: string,
  ): Promise<VulnerabilityRecord> {
    const response = await this.request<{
      record: VulnerabilityRecord;
    }>("/records", {
      method: "POST",
      body: JSON.stringify({
        record,
        profile,
        isDraft: true,
      }),
    });

    return response.record;
  }

  updateRecord(
    _identifier: string,
    _record: VulnerabilityRecord,
    _profile: string,
  ): Promise<VulnerabilityRecord> {
    throw new Error("Update endpoint is not implemented yet.");
  }

  validateRecord(
    record: VulnerabilityRecord,
    profile: string,
  ): Promise<ValidationResult> {
    return this.request("/validate", {
      method: "POST",
      body: JSON.stringify({
        record,
        profile,
      }),
    });
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);

    headers.set("Accept", "application/json");

    if (init.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(
      `${this.apiRoot}${path}`,
      {
        ...init,
        headers,
        credentials: "same-origin",
      },
    );

    const body = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      throw new Error(
        body?.message
        ?? `${response.status} ${response.statusText}`,
      );
    }

    return body as T;
  }
}
