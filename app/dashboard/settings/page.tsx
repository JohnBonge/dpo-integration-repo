'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingConfirmation, setBookingConfirmation] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveSettings = async () => {
    try {
      // In a real app, save settings to the database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className='py-10'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold mb-8'>Settings</h1>

        <div className='grid gap-6'>
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your dashboard preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Email Notifications</p>
                  <p className='text-sm text-gray-500'>
                    Receive notifications about new bookings
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Booking Confirmations</p>
                  <p className='text-sm text-gray-500'>
                    Send automatic booking confirmations
                  </p>
                </div>
                <Switch
                  checked={bookingConfirmation}
                  onCheckedChange={setBookingConfirmation}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Marketing Emails</p>
                  <p className='text-sm text-gray-500'>
                    Send promotional emails to customers
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>Stripe API Key</label>
                <Input type='password' value='sk_test_...' disabled />
              </div>
              <div>
                <label className='text-sm font-medium'>SendGrid API Key</label>
                <Input type='password' value='SG.xxx...' disabled />
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end'>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
