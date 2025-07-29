'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SettingsPage() {
  const [logo, setLogo] = useState('https://placehold.co/80x80.png');
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('+999 123 456 789');
  const [web, setWeb] = useState('www.domain.com');
  const [area, setArea] = useState('123 Street, Town, Postal');
  const [template, setTemplate] = useState('classic');
  const [themeColor, setThemeColor] = useState('#F39C12');
  const { toast } = useToast();

  useEffect(() => {
    const savedName = localStorage.getItem('vstudio-name');
    const savedEmail = localStorage.getItem('vstudio-email');
    const savedLogo = localStorage.getItem('vstudio-logo');
    const savedPhone = localStorage.getItem('vstudio-phone');
    const savedWeb = localStorage.getItem('vstudio-web');
    const savedArea = localStorage.getItem('vstudio-area');
    const savedTemplate = localStorage.getItem('vstudio-template');
    const savedThemeColor = localStorage.getItem('vstudio-theme-color');

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedLogo) setLogo(savedLogo);
    if (savedPhone) setPhone(savedPhone);
    if (savedWeb) setWeb(savedWeb);
    if (savedArea) setArea(savedArea);
    if (savedTemplate) setTemplate(savedTemplate);
    if (savedThemeColor) setThemeColor(savedThemeColor);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    try {
      localStorage.setItem('vstudio-name', name);
      localStorage.setItem('vstudio-email', email);
      localStorage.setItem('vstudio-logo', logo);
      localStorage.setItem('vstudio-phone', phone);
      localStorage.setItem('vstudio-web', web);
      localStorage.setItem('vstudio-area', area);
      localStorage.setItem('vstudio-template', template);
      localStorage.setItem('vstudio-theme-color', themeColor);
      toast({
        title: 'Settings Saved!',
        description: 'Your branding and account information have been updated.',
      });
    } catch (error) {
       console.error("Failed to save settings to localStorage", error);
       toast({
         variant: 'destructive',
         title: 'Error saving settings',
         description: 'Could not save settings. Your browser might be blocking local storage.',
       });
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
          <p className="text-muted-foreground">Manage your account and branding settings.</p>
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>Invoice Template</CardTitle>
            <CardDescription>Choose the design and theme for your invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <Label>Template</Label>
                <RadioGroup value={template} onValueChange={setTemplate} className="mt-2 grid grid-cols-2 gap-4">
                  <Label className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="classic" id="classic"/>
                    <Image src="https://placehold.co/150x210.png" width={150} height={210} alt="Classic Template Preview" className="rounded-md" data-ai-hint="invoice template"/>
                    <span className="font-semibold">Classic</span>
                  </Label>
                   <Label className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="modern" id="modern"/>
                    <Image src="https://placehold.co/150x210.png" width={150} height={210} alt="Modern Template Preview" className="rounded-md" data-ai-hint="invoice template"/>
                    <span className="font-semibold">Modern</span>
                  </Label>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                 <Label htmlFor="theme-color">Theme Color</Label>
                 <Input id="theme-color" type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-24 h-12 p-1" />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Customize the look of your invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="shrink-0">
                <Image
                  src={logo}
                  alt="Current Logo"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                  data-ai-hint="logo company"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="logo-upload">Company Logo</Label>
                <div className="flex gap-2 mt-2">
                  <Input id="logo-upload" type="file" className="flex-1" onChange={handleLogoUpload} accept="image/*" />
                   <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Recommended size: 200x200px. Max file size: 2MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="web">Website</Label>
              <Input id="web" value={web} onChange={(e) => setWeb(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="area">Address</Label>
              <Textarea id="area" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </CardContent>
        </Card>

         <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
         </div>
      </div>
    </AppLayout>
  );
}
