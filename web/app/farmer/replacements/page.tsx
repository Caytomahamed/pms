'use client';

import { useEffect, useState } from 'react';

import { useReplacementStore } from '@/store/replacementStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '../../../utlis';

import Toast from '../../components/Toast';
import { User } from '@/types';

export default function FarmPage() {
  const { fetchMyData, myReplacements, updateMyReplacement, updateError } =
    useReplacementStore();

  // Show a toast message when there is an error
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userlogin = localStorage.getItem('user'); 
    if (userlogin) {
      setUser(JSON.parse(userlogin));
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('salesman user', user);
      fetchMyData(Number(user.id));
    }
  }, [user]);

  const handleOrderResponse = (replacementId: number, status: 'approved') => {
    updateMyReplacement(replacementId, { status });

    if (!updateError) {
      showToast('updated successfully', 'success');
    }
  };

  const [activeTab, setActiveTab] = useState<
    'pending' | 'approved' | 'delivered'
  >('pending');

  const getTitleAndDescription = (
    tab: 'pending' | 'approved' | 'delivered'
  ) => {
    switch (tab) {
      case 'pending':
        return {
          title: 'Pending Replacement',
          description: 'Review and respond to egg Replacement',
        };
      case 'approved':
        return {
          title: 'Approved Replacement',
          description: 'Review and respond to egg Replacement',
        };

      case 'delivered':
        return {
          title: 'Completed Replacement',
          description: 'Track and review completed egg Replacement',
        };
      default:
        return { title: 'Replacement', description: 'Manage your Replacement' };
    }
  };

  const { title, description } = getTitleAndDescription(activeTab);

  const filteredReplacements = myReplacements.filter(
    (replace) =>
      (replace.status as 'pending' | 'approved' | 'delivered') === activeTab
  );

  return (
    <div className="w-full mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Tabs for filtering orders */}
      <div className="flex justify-start space-x-4 mb-4">
        {['pending', 'approved', 'delivered'].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            onClick={() =>
              setActiveTab(status as 'pending' | 'approved' | 'delivered')
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredReplacements.length > 0 ? (
            filteredReplacements.map((replace) => (
              <Card key={replace.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">replace #{replace.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {replace.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Deadline:{' '}
                          {new Date(replace.deadline).toLocaleDateString()}
                        </p>
                        {replace.reason && (
                          <p className="text-sm text-muted-foreground">
                            Reason: {replace.reason}
                          </p>
                        )}
                      </div>
                      <div
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                          replace.status === 'pending' &&
                            'bg-yellow-100 text-yellow-800',
                          replace.status === 'approved' &&
                            'bg-red-100 text-red-800',
                          replace.status === 'delivered' &&
                            'bg-blue-100 text-blue-800'
                        )}
                      >
                        {replace.status}
                      </div>
                    </div>

                    {replace.status === 'pending' && (
                      <Button
                        onClick={() =>
                          handleOrderResponse(Number(replace.id), 'approved')
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 w-full"
                      >
                        Approved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center">
              No Replacements found for this status:{' '}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
