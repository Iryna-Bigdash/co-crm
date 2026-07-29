'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import Header from '@/app/components/header';
import Button from '@/app/components/button';
import Modal from '@/app/components/modal';
import ManagerForm from '@/app/components/manager-form';
import ReassignCompaniesModal from '@/app/components/reassign-companies-modal';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  type Employee,
} from '@/lib/api';

interface ManagerFormValues {
  name: string;
  email: string;
  password: string;
}

export default function ManagersPage() {
  const { data: session } = useSession({ required: true });
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Employee | null>(null);
  const [reassigningManager, setReassigningManager] = useState<Employee | null>(null);
  const [createdPassword, setCreatedPassword] = useState<{ name: string; email: string; password: string } | null>(null);
  
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard');
  }

  const { data: managers = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees', 'MANAGER'],
    queryFn: () => getEmployees('MANAGER'),
  });

  const createMutation = useMutation({
    mutationFn: async (values: ManagerFormValues) => {
      const employee = await createEmployee({
        ...values,
        role: 'MANAGER',
      });
      return { employee, password: values.password };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees', 'MANAGER'] });
      setIsCreateModalOpen(false);
      setCreatedPassword({
        name: data.employee.name,
        email: data.employee.email,
        password: data.password
      });
      toast.success('Manager created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: ManagerFormValues }) => {
      const updateData: { name: string; email: string; password?: string } = {
        name: values.name,
        email: values.email,
      };
      
      if (values.password) {
        updateData.password = values.password;
      }

      const employee = await updateEmployee(id, updateData);
      return { employee, password: values.password };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees', 'MANAGER'] });
      
      if (data.password) {
        setCreatedPassword({
          name: data.employee.name,
          email: data.employee.email,
          password: data.password
        });
      }
      
      setEditingManager(null);
      toast.success('Manager updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Password copied to clipboard');
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', 'MANAGER'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Manager deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete manager "${name}"? All company assignments will be removed.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header>Managers</Header>
        <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
          <div className="text-center text-gray-900 dark:text-gray-100">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header>Managers</Header>
      <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
        <div className="mb-6">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create New Manager
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto transition-colors">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {managers.map((manager) => (
                <tr key={manager.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {manager.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {manager.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingManager(manager)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setReassigningManager(manager)}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      Reassign
                    </button>
                    <button
                      onClick={() => handleDelete(manager.id, manager.name)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          show={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Manager"
        >
          <ManagerForm
            onSubmit={(values) => createMutation.mutate(values)}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        <Modal
          show={!!editingManager}
          onClose={() => setEditingManager(null)}
          title="Edit Manager"
        >
          {editingManager && (
            <ManagerForm
              initialValues={{
                name: editingManager.name,
                email: editingManager.email,
                password: '',
              }}
              onSubmit={(values) => updateMutation.mutate({ id: editingManager.id, values })}
              onCancel={() => setEditingManager(null)}
              isEdit
            />
          )}
        </Modal>

        {reassigningManager && (
          <ReassignCompaniesModal
            show={!!reassigningManager}
            onClose={() => setReassigningManager(null)}
            fromManager={reassigningManager}
          />
        )}

        <Modal
          show={!!createdPassword}
          onClose={() => setCreatedPassword(null)}
          title="Manager Credentials"
        >
          {createdPassword && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 transition-colors">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                  Important: Save these credentials now!
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  The password will only be shown once. Make sure to copy it before closing this window.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors">
                  {createdPassword.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (Login)
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 flex justify-between items-center transition-colors">
                  <span>{createdPassword.email}</span>
                  <button
                    onClick={() => copyToClipboard(createdPassword.email)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors"
                    title="Copy email"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 flex justify-between items-center font-mono transition-colors">
                  <span>{createdPassword.password}</span>
                  <button
                    onClick={() => copyToClipboard(createdPassword.password)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors"
                    title="Copy password"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
