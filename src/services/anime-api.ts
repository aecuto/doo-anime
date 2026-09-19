import { STATUS } from "@/constants";
import { IAnime } from "@/database/model";
import { apiService } from "@/services/base";
import type { IItemAnime } from "@/types/anime";

export const reqCreate = (payload: Partial<IAnime>) => {
  return apiService.post("/anime/create", payload);
};

export const reqList = (status: string, user: string) => {
  return apiService.get<IItemAnime[]>("/anime/list", {
    params: { status, user },
  });
};

export const reqGetById = (id: string) => {
  return apiService.get<IAnime>(`/anime/${id}`);
};

export const reqUpdate = (id: string, payload: Partial<IAnime>) => {
  return apiService.put<IAnime>(`/anime/${id}`, payload);
};

export const reqUpdateEpisode = (id: string, episode: number) => {
  return apiService.put<IAnime>(`/anime/${id}`, {
    episode: episode <= 0 ? 0 : episode,
  });
};

export const reqUpdateComplete = (id: string) => {
  const newPayload = {
    completed: new Date(),
    status: STATUS.DONE,
  };
  return apiService.put<IAnime>(`/anime/${id}`, newPayload);
};

export const reqUpdateReplay = (id: string) => {
  const newPayload = {
    status: STATUS.WATCHING,
  };
  return apiService.put<IAnime>(`/anime/${id}`, newPayload);
};

export const reqDelete = (id: string) => {
  return apiService.delete<IAnime>(`/anime/${id}`);
};

export const reqSync = () => {
  return apiService.get<IAnime>(`/anime/sync`);
};

export const reqSyncEpisodeToMal = (
  animeId: number,
  episode: number,
  status?: string,
) => apiService.post("/mal-user/update", { animeId, episode, status });

export interface ISyncMalResult {
  synced: number;
  failed: string[];
  total: number;
}

interface ISyncMalBatch extends ISyncMalResult {
  nextCursor: string | null;
  done: boolean;
}

const reqSyncToMalBatch = (cursor?: string | null) =>
  apiService.post<ISyncMalBatch>("/mal-user/sync", cursor ? { cursor } : {});

// Drives the batched sync from the client so every request stays small
// enough for serverless timeouts (Vercel Hobby).
export const reqSyncToMal = async (
  onProgress?: (progress: { synced: number; failed: number; total: number }) => void,
): Promise<ISyncMalResult> => {
  let cursor: string | null = null;
  let total = 0;
  let synced = 0;
  const failed: string[] = [];

  do {
    const { data } = await reqSyncToMalBatch(cursor);
    total = data.total;
    synced += data.synced;
    failed.push(...data.failed);
    cursor = data.nextCursor;
    onProgress?.({ synced, failed: failed.length, total });
  } while (cursor);

  return { synced, failed, total };
};

export interface IDeleteMalResult {
  deleted: number;
  failed: string[];
  total: number;
}

interface IDeleteMalBatch {
  deleted: number;
  failed: string[];
  done: boolean;
}

const reqDeleteMalBatch = () =>
  apiService.post<IDeleteMalBatch>("/mal-user/delete");

// Drains the MAL list one page per request to stay within serverless timeouts.
export const reqDeleteMalList = async (
  onProgress?: (progress: { deleted: number; failed: number }) => void,
): Promise<IDeleteMalResult> => {
  let deleted = 0;
  let failed: string[] = [];
  let done = false;

  while (!done) {
    const { data } = await reqDeleteMalBatch();
    deleted += data.deleted;
    failed = [...new Set([...failed, ...data.failed])];
    done = data.done;
    onProgress?.({ deleted, failed: failed.length });
  }

  return { deleted, failed, total: deleted + failed.length };
};
