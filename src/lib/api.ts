import { limiter } from './config/limiter';
import { getApiBaseUrl, withApiAuth } from './config';

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

// interactions
export type InteractionType = 'CALL' | 'EMAIL' | 'MEETING' | 'OTHER';
export type InteractionStatus = 'PENDING' | 'DONE' | 'CANCELED' ;

export interface Interaction {
  id: string;
  companyId: string;
  type: InteractionType;
  status: InteractionStatus;
  date: string;               // ISO
  comment: string;
  nextCall?: string | null;   // ISO
  amount?: number | null;
  createdAt: string;
  updatedAt: string;
}
export interface InteractionsListResponse {
  items: Interaction[];
  total: number;
  skip: number;
  take: number;
}

export interface CalendarInteraction extends Interaction {
  companyTitle: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAT?: string;
}

interface CompanyDocument {
  filename: string;
  url: string;
}

const buildUrl = (...paths: string[]) =>
  `${getApiBaseUrl()}/${paths.join('/')}`;

const stringifyQueryParams = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

const parseApiError = async (response: Response) => {
  const errorText = await response.text();

  try {
    const parsed = JSON.parse(errorText) as { message?: string | string[] };
    if (Array.isArray(parsed.message)) {
      return parsed.message.join(', ');
    }
    if (parsed.message) {
      return parsed.message;
    }
  } catch {
    // keep raw text
  }

  return errorText || 'Request failed';
};

const sendRequestWithLimit = async <T>(
  url: string,
  init?: RequestInit,
): Promise<T> => {
  const remainingTokens = await limiter.removeTokens(1);

  if (remainingTokens < 0) {
    throw new Error('Rate limit exceeded');
  }

  const res = await fetch(url, withApiAuth(init));

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return res.json() as Promise<T>;
};

export const getSummaryStats = (employeeId?: string, init?: RequestInit) => {
  const url = employeeId
    ? `${buildUrl('summary-stats')}?employeeId=${employeeId}`
    : buildUrl('summary-stats');
  return sendRequestWithLimit<SummaryStats>(url, init);
};

export const getSummarySales = (employeeId?: string, init?: RequestInit) => {
  const url = employeeId
    ? `${buildUrl('summary-sales')}?employeeId=${employeeId}`
    : buildUrl('summary-sales');
  return sendRequestWithLimit<SummarySales[]>(url, init);
};

export const getCountries = (init?: RequestInit) => {
  return sendRequestWithLimit<Country[]>(buildUrl('countries'), init);
};

export const getCountriesWithCompanyCounts = async (employeeId?: string, init?: RequestInit) => {
  const url = employeeId
    ? `${buildUrl('countries', 'with-companies')}?employeeId=${employeeId}`
    : buildUrl('countries', 'with-companies');
  return sendRequestWithLimit<CountryWithCompanyCount[]>(url, init);
};

export const getCategoriesCounts = async (employeeId?: string, init?: RequestInit) => {
  const url = employeeId
    ? `${buildUrl('categories', 'with-companies')}?employeeId=${employeeId}`
    : buildUrl('categories', 'with-companies');
  return sendRequestWithLimit<CountryWithCategoriesCount[]>(url, init);
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
  const response = await fetch(url, withApiAuth({
    method: 'POST',
    body: formData,
  }));

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'File upload failed');
  }

  const data = await response.json();
  return data.path;
}

export async function uploadDocuments(
  file: File,
  companyId: string,
  companyTitle: string,
  documentName?: string
): Promise<string> {
  const formData = new FormData();
  formData.append('documents', file);
  formData.append('companyId', companyId);
  formData.append('companyTitle', companyTitle);
  if (documentName) formData.append('documentName', documentName);

  const url = buildUrl('documents');

  const response = await fetch(url, withApiAuth({
    method: 'POST',
    body: formData,
  }));

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'File upload failed');
  }

  const data = await response.json();
  return data.path;
}

export const getCompanyDocuments = async (
  companyId: string
): Promise<CompanyDocument[]> => {
  const response = await fetch(buildUrl('documents', 'company', companyId), withApiAuth());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Не вдалося отримати список документів компанії');
  }

  return await response.json();
};

export const deleteDocument = async (filename: string) => {
  const res = await fetch(buildUrl('documents', filename), withApiAuth({ method: 'DELETE' }));
  if (!res.ok) throw new Error('Помилка при видаленні файлу');
};

export const createCompany = async (
  data: Omit<Company, 'id' | 'hasPromotions'>,
  employeeId?: string,
  init?: RequestInit,
) => {
  const url = employeeId
    ? `${buildUrl('company')}?employeeId=${employeeId}`
    : buildUrl('company');
  return sendRequestWithLimit<Company>(url, {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const getCompanies = (employeeId?: string, init?: RequestInit) => {
  const url = employeeId 
    ? `${buildUrl('company')}?employeeId=${employeeId}`
    : buildUrl('company');
  return sendRequestWithLimit<Company[]>(url, init);
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

// interections
export const createInteraction = async (
  companyId: string,
  data: Omit<Interaction, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>,
  init?: RequestInit,
) => {
  return sendRequestWithLimit<Interaction>(buildUrl('interactions','company', companyId), {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
};

export const getInteractionsForCompany = async (
  companyId: string,
  init?: RequestInit
) => {
  return sendRequestWithLimit<InteractionsListResponse>(
    buildUrl('interactions', 'company', companyId),
    init
  );
};

export const getCalendarInteractions = async (
  params: {
    employeeId?: string;
    dateFrom?: string;
    dateTo?: string;
    type?: InteractionType;
    status?: InteractionStatus;
  } = {},
  init?: RequestInit,
) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, value]) => Boolean(value)),
  ) as Record<string, string>;

  const url = Object.keys(query).length
    ? `${buildUrl('interactions')}?${stringifyQueryParams(query)}`
    : buildUrl('interactions');

  return sendRequestWithLimit<CalendarInteraction[]>(url, {
    ...init,
    cache: 'no-store',
  });
};

export const deleteInteraction = async (id: string, init?: RequestInit) => {
  return sendRequestWithLimit<Interaction>(buildUrl('interactions', id), {
    ...init,
    method: 'DELETE',
    headers: {
      ...(init?.headers || {}),
    },
  });
};

export const getEmployees = (role?: string, init?: RequestInit) => {
  const url = role
    ? `${buildUrl('employees')}?role=${role}`
    : buildUrl('employees');
  return sendRequestWithLimit<Employee[]>(url, init);
};

export const createEmployee = (
  data: { name: string; email: string; password: string; role: string },
  init?: RequestInit,
) =>
  sendRequestWithLimit<Employee>(buildUrl('employees'), {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });

export const updateEmployee = (
  id: string,
  data: { name?: string; email?: string; password?: string },
  init?: RequestInit,
) =>
  sendRequestWithLimit<Employee>(buildUrl('employees', id), {
    ...init,
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json',
    },
  });

export const deleteEmployee = (id: string, init?: RequestInit) =>
  sendRequestWithLimit<Employee>(buildUrl('employees', id), {
    ...init,
    method: 'DELETE',
  });

export const getEmployeeCompanies = (employeeId: string, init?: RequestInit) =>
  sendRequestWithLimit<Company[]>(buildUrl('employees', employeeId, 'companies'), init);

export const assignCompanyToEmployee = (
  employeeId: string,
  companyId: string,
  init?: RequestInit,
) =>
  sendRequestWithLimit(buildUrl('employees', employeeId, 'companies', companyId), {
    ...init,
    method: 'POST',
  });

export const unassignCompanyFromEmployee = (
  employeeId: string,
  companyId: string,
  init?: RequestInit,
) =>
  sendRequestWithLimit(buildUrl('employees', employeeId, 'companies', companyId), {
    ...init,
    method: 'DELETE',
  });

