'use server';

import { revalidatePath } from 'next/cache';

/** Bust ISR for catalog pages after admin edits (see `revalidate` on home / products). */
export async function revalidatePublicCatalog() {
  revalidatePath('/');
  revalidatePath('/products');
}
