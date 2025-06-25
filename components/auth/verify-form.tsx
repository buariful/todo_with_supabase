'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifyFormProps {
  email: string;
  onBack: () => void;
}

export function VerifyForm({ email, onBack }: VerifyFormProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setMessage('Please enter the verification code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: 'signup'
      });

      if (error) throw error;

      setMessage('Email verified successfully! You can now use the app.');
    } catch (error: any) {
      setMessage(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      setMessage('Verification code sent! Check your email.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a verification code to<br />
            <span className="font-medium text-gray-700">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading || code.length !== 6}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={resending}
                className="text-blue-600 hover:text-blue-700"
              >
                {resending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Resend Code
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                disabled={loading}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back to Sign Up
              </Button>
            </div>
          </div>
          
          {message && (
            <div className={cn(
              "mt-4 p-3 rounded-md text-sm text-center",
              message.includes('error') || message.includes('Invalid') || message.includes('Failed')
                ? "bg-red-50 text-red-700 border border-red-200"
                : message.includes('successfully')
                ? "bg-green-50 text-green-700 border border-green-200 flex items-center justify-center gap-2"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            )}>
              {message.includes('successfully') && <CheckCircle className="h-4 w-4" />}
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}