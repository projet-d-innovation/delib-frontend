import { IPagination, IEntity } from "../types/interfaces";
import { api } from "./axios";

// Generic service function
export const createEntityService = <T extends IEntity>(baseUrl: string) => {
  return {
    getEntities: async ({
      page,
      size = 10,
      nom = "",
    }: {
      page: number;
      size?: number;
      nom?: string;
    }): Promise<IPagination<T>> => {
      const { data } = await api.get(baseUrl, {
        params: {
          page: page - 1,
          size,
          nom,
          includeRole: true,
        },
      });
      return data;
    },

    saveEntity: async (entity: T): Promise<T> => {
      const { data } = await api.post(baseUrl, entity);
      return data;
    },

    updateEntity: async (entity: T): Promise<T> => {
      const { data } = await api.patch(`${baseUrl}/${entity.code}`, entity);
      return data;
    },

    getEntity: async (entityId: string): Promise<T> => {
      const { data } = await api.get(`${baseUrl}/${entityId}`);
      return data;
    },

    deleteEntities: async (entityIds: string[]): Promise<void> => {
      await api.delete(`${baseUrl}/bulk`, {
        params: {
          codes: entityIds,
        },
      });
    },
  };
};
