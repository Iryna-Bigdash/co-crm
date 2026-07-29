'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Modal from './modal';
import Button from './button';
import {
  assignCompanyToEmployee,
  getEmployeeCompanies,
  getEmployees,
  unassignCompanyFromEmployee,
  type Company,
  type Employee,
} from '@/lib/api';

interface ReassignCompaniesModalProps {
  show: boolean;
  onClose: () => void;
  fromManager: Employee;
}

export default function ReassignCompaniesModal({ 
  show, 
  onClose, 
  fromManager 
}: ReassignCompaniesModalProps) {
  const queryClient = useQueryClient();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [targetManagerId, setTargetManagerId] = useState<string>('');

  const { data: assignedCompanies = [], isLoading: loadingCompanies } = useQuery<Company[]>({
    queryKey: ['employees', fromManager.id, 'companies'],
    queryFn: () => getEmployeeCompanies(fromManager.id),
    enabled: show,
  });

  const { data: managers = [], isLoading: loadingManagers } = useQuery<Employee[]>({
    queryKey: ['employees', 'MANAGER', 'exclude', fromManager.id],
    queryFn: async () => {
      const allManagers = await getEmployees('MANAGER');
      return allManagers.filter((manager) => manager.id !== fromManager.id);
    },
    enabled: show,
  });

  const reassignMutation = useMutation({
    mutationFn: async () => {
      if (!targetManagerId) throw new Error('Please select a target manager');
      if (selectedCompanies.length === 0) throw new Error('Please select at least one company');

      await Promise.all(
        selectedCompanies.map(async (companyId) => {
          await unassignCompanyFromEmployee(fromManager.id, companyId);

          try {
            await assignCompanyToEmployee(targetManagerId, companyId);
          } catch (error) {
            const message = error instanceof Error ? error.message : '';
            if (!message.includes('already assigned')) {
              throw error;
            }
          }
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success(`Successfully reassigned ${selectedCompanies.length} compan${selectedCompanies.length === 1 ? 'y' : 'ies'}`);
      setSelectedCompanies([]);
      setTargetManagerId('');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleToggleCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === assignedCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(assignedCompanies.map(c => c.id));
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={`Reassign Companies from ${fromManager.name}`}>
      <div className="space-y-6">
        {loadingCompanies || loadingManagers ? (
          <div className="text-center py-4 text-gray-900 dark:text-gray-100">Loading...</div>
        ) : (
          <>
            {assignedCompanies.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                This manager has no assigned companies.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reassign to Manager *
                  </label>
                  <select
                    value={targetManagerId}
                    onChange={(e) => setTargetManagerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select target manager...</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} ({manager.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Companies ({selectedCompanies.length}/{assignedCompanies.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      {selectedCompanies.length === assignedCompanies.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-md max-h-60 overflow-y-auto bg-white dark:bg-gray-700 transition-colors">
                    {assignedCompanies.map((company) => (
                      <label
                        key={company.id}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b dark:border-gray-600 last:border-b-0 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company.id)}
                          onChange={() => handleToggleCompany(company.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-500 rounded"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {company.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {company.categoryTitle}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => reassignMutation.mutate()}
                    disabled={reassignMutation.isPending || !targetManagerId || selectedCompanies.length === 0}
                  >
                    {reassignMutation.isPending ? 'Reassigning...' : 'Reassign Companies'}
                  </Button>
                  <Button onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
