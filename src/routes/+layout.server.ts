import type { LayoutServerLoad } from './$types';
import { stripBase } from '$utils/paths';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
  const locale = cookies.get('locale') ?? 'en';

  return {
    pathname: stripBase(url.pathname),
    locale
  };
};
