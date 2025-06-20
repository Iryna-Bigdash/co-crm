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
  name: string;
  id: string;
}

export interface CountryWithCompanyCount {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  _count: {
    companies: number;
  };
}

export interface CountryWithCategoriesCount {
  id: string;
  title: string;
  count: number;
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
  countryId: string;
  categoryTitle?: string;
  countryTitle?: string; 
  avatar?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  companyId: string;
  companyTitle?: string;
  avatar?: string;
}

const PROJECT_TOKEN = process.env.NEXT_PUBLIC_PROJECT_TOKEN;

const newLocal = (...paths: string[]) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const baseUrl = isDevelopment
    ? 'http://localhost:3000/api' // Локальна база даних для режиму розробки
    : 'https://co-crm-api-production.up.railway.app/api'; // Віддалена база даних для продакшену

  return `${baseUrl}/${paths.join('/')}`;
};

// const buildUrl = (...paths: string[]) =>
//   `http://localhost:3000/api/${paths.join('/')}`;

// const buildUrl = (...paths: string[]) =>
//   `https://co-crm-api-production.up.railway.app/api/${paths.join('/')}`;

const buildUrl = newLocal;


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
    buildUrl('summary-stats'),
    init,
  );
};

export const getSummarySales = (init?: RequestInit) => {
  return sendRequestWithLimit<SummarySales[]>(buildUrl('summary-sales'), init);
};

export const getCountries = (init?: RequestInit) => {
  return sendRequestWithLimit<Country[]>(buildUrl('countries'), init);
};

export const getCountriesWithCompanyCounts = async (init?: RequestInit) => {
  return sendRequestWithLimit<CountryWithCompanyCount[]>(
    buildUrl('countries', 'with-companies'),
    init,
  );
};

export const getCategoriesCounts = async (init?: RequestInit) => {
  return sendRequestWithLimit<CountryWithCategoriesCount[]>(
    buildUrl('categories', 'with-companies'),
    init, 
  )
}

export const getCategories = async (init?: RequestInit): Promise<Category[]> => {
  try {
    const data = await sendRequestWithLimit<Category[]>(buildUrl('categories'), init);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export async function uploadFile(file: File, companyTitle: string): Promise<string> {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('companyTitle', companyTitle);

  const url = buildUrl('upload');
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'File upload failed');
  }

  const data = await response.json();
  console.log('data:', data);
  console.log('data URL:', data.path)
  return data.path;
}

export async function uploadDocuments(file: File, companyTitle: string, documentNumber?: string): Promise<string> {
  const formData = new FormData();
  formData.append('documents', file);
  formData.append('companyTitle', companyTitle);
  if (documentNumber) formData.append('documentNumber', documentNumber);

  const url = buildUrl('documents');

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'File upload failed');
  }

  const data = await response.json();
  return data.path;
}

export const createCompany = async (
  data: Omit<Company, 'id' | 'hasPromotions'>,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Company>(buildUrl('company'), {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const getCompanies = (init?: RequestInit) => {
  return sendRequestWithLimit<Company[]>(buildUrl('company'), init);
};

export const getCompany = (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Company>(buildUrl('company', id), init);
};

export const getPromotionsforSelectedCompany = (companyId: string, init?: RequestInit) => {
  return sendRequestWithLimit<Promotion[]>(buildUrl('promotions', 'company', companyId), init);
}


export const getPromotions = async (
  params: Record<string, string> = {},
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Promotion[]>(
    `${buildUrl('promotions')}?${stringifyQueryParams(params)}`,
    init,
  );
};

export const getPromotion = (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Promotion>(buildUrl('promotions', id), init);
};

export const createPromotion = async (
  companyId: string,
  data: Omit<Promotion, 'id'>,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Promotion>(buildUrl('promotions', companyId), {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const updatePromotion = async (
  promotionId: string,
  newData: {},
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Promotion>(buildUrl('promotions', promotionId), {
    ...init,
    method: 'PATCH',
    body: JSON.stringify(newData),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const deleteCompany = async (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Company>(buildUrl('company', id), {
    ...init,
    method: 'DELETE',
    headers: {
      ...(init?.headers || {}),
    },
  });
};

export const deletePromotion = async (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Promotion>(buildUrl('promotions', id), {
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
  return sendRequestWithLimit<Company>(buildUrl('company', companyId), {
    ...init,
    method: 'PATCH',
    body: JSON.stringify({ description: newDescription }),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const updateCompanyStatus = async (
  companyId: string,
  newStatus: CompanyStatus, 
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Company>(buildUrl('company', companyId), {
    ...init,
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }), 
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
    `${buildUrl('company')}?${stringifyQueryParams({ title })}`,
    init,
  );
};
