'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Header from '@/app/components/header';

interface Manager {
  id: string;
  name: string;
  email: string;
}

interface Company {
  id: string;
  title: string;
  categoryTitle: string;
}

export default function ManagerAssignmentsPage() {
  const { data: session } = useSession({ required: true });
  const queryClient = useQueryClient();
  
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  const { data: managers = [], isLoading: managersLoading } = useQuery<Manager[]>({
    queryKey: ['employees', 'MANAGER'],
    queryFn: async () => {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://api-yho4.onrender.com/api'
        : 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/employees?role=MANAGER`);
      if (!res.ok) throw new Error('Failed to fetch managers');
      return res.json();
    }
  });
  
  const { data: companies = [], isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://api-yho4.onrender.com/api'
        : 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/company`);
      if (!res.ok) throw new Error('Failed to fetch companies');
      return res.json();
    }
  });

  const { data: assignmentsMap = {} } = useQuery<Record<string, string[]>>({
    queryKey: ['assignments', managers.map(m => m.id)],
    queryFn: async () => {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://api-yho4.onrender.com/api'
        : 'http://localhost:3000/api';
      
      const map: Record<string, string[]> = {};
      await Promise.all(
        managers.map(async (manager) => {
          const res = await fetch(`${apiUrl}/employees/${manager.id}/companies`);
          if (res.ok) {
            const assignedCompanies = await res.json();
            map[manager.id] = assignedCompanies.map((c: Company) => c.id);
          } else {
            map[manager.id] = [];
          }
        })
      );
      return map;
    },
    enabled: managers.length > 0,
  });

  const assignMutation = useMutation({
    mutationFn: async ({ employeeId, companyId }: { employeeId: string; companyId: string }) => {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://api-yho4.onrender.com/api'
        : 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/employees/${employeeId}/companies/${companyId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to assign company');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });

  const unassignMutation = useMutation({
    mutationFn: async ({ employeeId, companyId }: { employeeId: string; companyId: string }) => {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://api-yho4.onrender.com/api'
        : 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/employees/${employeeId}/companies/${companyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to unassign company');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });

  const handleToggleAssignment = async (employeeId: string, companyId: string, isAssigned: boolean) => {
    if (isAssigned) {
      // Simply unassign
      unassignMutation.mutate({ employeeId, companyId });
    } else {
      // Before assigning to new manager, unassign from all other managers
      const managersWithThisCompany = managers.filter(m => 
        assignmentsMap[m.id]?.includes(companyId)
      );
      
      if (managersWithThisCompany.length > 0) {
        // Unassign from all other managers first
        try {
          const apiUrl = process.env.NODE_ENV === 'production'
            ? 'https://api-yho4.onrender.com/api'
            : 'http://localhost:3000/api';
          
          await Promise.all(
            managersWithThisCompany.map(manager =>
              fetch(`${apiUrl}/employees/${manager.id}/companies/${companyId}`, {
                method: 'DELETE',
              })
            )
          );
        } catch (error) {
          console.error('Error unassigning from other managers:', error);
        }
      }
      
      // Now assign to the new manager
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
      <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto transition-colors">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="sticky left-0 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600 transition-colors">
                  Manager
                </th>
                {companies.map((company) => (
                  <th
                    key={company.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="truncate max-w-[120px]" title={company.title}>
                        {company.title}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                        {company.categoryTitle}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
              {managers.map((manager) => (
                <tr key={manager.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="sticky left-0 bg-white dark:bg-gray-800 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600 transition-colors">
                    <div className="flex flex-col">
                      <span>{manager.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{manager.email}</span>
                    </div>
                  </td>
                  {companies.map((company) => {
                    const isAssigned = assignmentsMap[manager.id]?.includes(company.id) || false;
                    return (
                      <td key={company.id} className="px-4 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => handleToggleAssignment(manager.id, company.id, isAssigned)}
                          disabled={assignMutation.isPending || unassignMutation.isPending}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {managers.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No managers found. Create manager accounts to assign companies.
          </div>
        )}
        
        {companies.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No companies found. Create companies to assign to managers.
          </div>
        )}
      </main>
    </div>
  );
}
