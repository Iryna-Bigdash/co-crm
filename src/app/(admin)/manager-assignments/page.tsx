'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Header from '@/app/components/header';
import {
  assignCompanyToEmployee,
  getCompanies,
  getEmployees,
  getEmployeeCompanies,
  unassignCompanyFromEmployee,
  type Company,
  type Employee,
} from '@/lib/api';

export default function ManagerAssignmentsPage() {
  const { data: session } = useSession({ required: true });
  const queryClient = useQueryClient();
  
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  const { data: managers = [], isLoading: managersLoading } = useQuery<Employee[]>({
    queryKey: ['employees', 'MANAGER'],
    queryFn: () => getEmployees('MANAGER'),
  });
  
  const { data: companies = [], isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => getCompanies(),
  });

  const { data: assignmentsMap = {} } = useQuery<Record<string, string[]>>({
    queryKey: ['assignments', managers.map(m => m.id)],
    queryFn: async () => {
      const map: Record<string, string[]> = {};
      await Promise.all(
        managers.map(async (manager) => {
          const assignedCompanies = await getEmployeeCompanies(manager.id);
          map[manager.id] = assignedCompanies.map((company) => company.id);
        })
      );
      return map;
    },
    enabled: managers.length > 0,
  });

  const assignMutation = useMutation({
    mutationFn: ({ employeeId, companyId }: { employeeId: string; companyId: string }) =>
      assignCompanyToEmployee(employeeId, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });

  const unassignMutation = useMutation({
    mutationFn: ({ employeeId, companyId }: { employeeId: string; companyId: string }) =>
      unassignCompanyFromEmployee(employeeId, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });

  const handleToggleAssignment = async (employeeId: string, companyId: string, isAssigned: boolean) => {
    if (isAssigned) {
      unassignMutation.mutate({ employeeId, companyId });
    } else {
      const managersWithThisCompany = managers.filter(m => 
        assignmentsMap[m.id]?.includes(companyId)
      );
      
      if (managersWithThisCompany.length > 0) {
        await Promise.all(
          managersWithThisCompany.map((manager) =>
            unassignCompanyFromEmployee(manager.id, companyId),
          ),
        );
      }
      
      assignMutation.mutate({ employeeId, companyId });
    }
  };

  if (managersLoading || companiesLoading) {
    return (
      <div>
        <Header>Manager Assignments</Header>
        <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
          <div className="text-center text-gray-900 dark:text-gray-100">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header>Manager Assignments</Header>
      <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7 overflow-x-auto">
        <table className="w-full min-w-[800px] bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Company
              </th>
              {managers.map((manager) => (
                <th
                  key={manager.id}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  {manager.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <div className="font-medium">{company.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{company.categoryTitle}</div>
                </td>
                {managers.map((manager) => {
                  const isAssigned = assignmentsMap[manager.id]?.includes(company.id) ?? false;
                  return (
                    <td key={manager.id} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleToggleAssignment(manager.id, company.id, isAssigned)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
