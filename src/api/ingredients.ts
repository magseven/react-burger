import { BASE_URL } from './config';

import type { TIngredient } from '@/utils/types';

export async function getIngredients(): Promise<TIngredient[]> {
  try {
    const res = await fetch(`${BASE_URL}/ingredients`);

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status}`);
    }

    const data: { data: TIngredient[] } = (await res.json()) as { data: TIngredient[] };
    return data.data;
  } catch (err) {
    console.error('Ошибка при запросе ингредиентов:', err);
    throw err;
  }
}
