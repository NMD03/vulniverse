import type {
  EditorRepository,
  LoadedRecord,
} from "@/editor/contracts";

import {
  RepositoryError,
} from "./RepositoryError";

export class HttpRepository
  implements EditorRepository
{
  constructor(
    private readonly apiRoot = "/api/v1",
  ) {}

  async loadRecord(
    identifier: string,
  ): Promise<LoadedRecord> {
    return this.request<LoadedRecord>(
      `/records/${encodeURIComponent(identifier)}`,
    );
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);

    headers.set("Accept", "application/json");

    if (init.body !== undefined) {
      headers.set(
        "Content-Type",
        "application/json",
      );
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
      throw new RepositoryError(
        body?.message ??
          `${response.status} ${response.statusText}`,
        response.status,
        body,
      );
    }

    return body as T;
  }
}
