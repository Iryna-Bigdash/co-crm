import { limiter } from './config/limiter';

export interface SummaryStats {
  promotions: number;
  categories: number;
  newCompanies: number;
  activeCompanies: number;
}

export interface SummarySales {
  id: string;
  companyId: string;
  companyTitle: string;
  sold: number;
  income: number;
}

export interface Country {
  id: string;
  title: string;
}

export interface Category {
  id: string;
  title: string;
}

export enum CompanyStatus {
  Active = 'active',
  NotActive = 'notActive',
  Pending = 'pending',
  Suspended = 'suspended',
}

export interface Company {
  id: string;
  title: string;
  description: string;
  status: CompanyStatus;
  joinedDate: string;
  hasPromotions: boolean;
  categoryId: string;
  categoryTitle: string;
  countryId: string;
  countryTitle: string;
  avatar?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  companyId: string;
  companyTitle: string;
  avatar?: string;
}

const PROJECT_TOKEN = process.env.NEXT_PUBLIC_PROJECT_TOKEN;

const buildUrl = (...paths: string[]) =>
  `https://${PROJECT_TOKEN}.mockapi.io/api/v1/${paths.join('/')}`;

const stringifyQueryParams = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

const sendRequestWithLimit = async <T>(
  url: string,
  init?: RequestInit,
): Promise<T> => {
  const remainingTokens = await limiter.removeTokens(1);

  // console.log('remainingTokens', remainingTokens);

  if (remainingTokens < 0) {
    throw new Error('Rate limit exceeded');
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json() as Promise<T>;
};

export const getSummaryStats = (init?: RequestInit) => {
  return sendRequestWithLimit<SummaryStats>(
    buildUrl('summary-stats', '1'),
    init,
  );
};

export const getSummarySales = (init?: RequestInit) => {
  return sendRequestWithLimit<SummarySales[]>(buildUrl('summary-sales'), init);
};

export const getCountries = (init?: RequestInit) => {
  return sendRequestWithLimit<Country[]>(buildUrl('countries'), init);
};

export const getCategories = (init?: RequestInit) => {
  return sendRequestWithLimit<Category[]>(buildUrl('categories'), init);
};

export const getCompanies = (init?: RequestInit) => {
  return sendRequestWithLimit<Company[]>(buildUrl('companies'), init);
};

export const getCompany = (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Company>(buildUrl('companies', id), init);
};

export const getPromotions = async (
  params: Record<string, string> = {},
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Promotion[]>(
    `${buildUrl('promotions')}?${stringifyQueryParams(params)}`,
    init,
  );
};

export const createCompany = async (
  data: Omit<Company, 'id' | 'hasPromotions'>,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Company>(buildUrl('companies'), {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const createPromotion = async (
  data: Omit<Promotion, 'id'>,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Promotion>(buildUrl('promotions'), {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const deleteCompany = async (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Company>(buildUrl('companies', id), {
    ...init,
    method: 'DELETE',
    headers: {
      ...(init?.headers || {}),
    },
  });
};

export const updateCompanyDescription = async (
  companyId: string,
  newDescription: string,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Company>(buildUrl('companies', companyId), {
    ...init,
    method: 'PUT',
    body: JSON.stringify({ description: newDescription }),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const getCompaniesByTitle = async (
  title: string,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Company[]>(
    `${buildUrl('companies')}?${stringifyQueryParams({ title })}`,
    init,
  );
};
