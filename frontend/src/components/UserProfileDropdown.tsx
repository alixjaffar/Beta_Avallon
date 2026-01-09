import React, { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface UserProfileDropdownProps {
  user: User | null;
  credits: number | null;
  onSignOut: () => void;
  onOpenSettings?: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  credits,
  onSignOut,
  onOpenSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Calculate credits percentage (max 200 for pro, 20 for free)
  const maxCredits = 200;
  const creditsPercent = credits !== null ? Math.min((credits / maxCredits) * 100, 100) : 0;

  // Load profile photo from localStorage
  useEffect(() => {
    const savedPhoto = localStorage.getItem('avallon_profile_photo');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setProfilePhoto(dataUrl);
        localStorage.setItem('avallon_profile_photo', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem('avallon_profile_photo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
      >
        <div 
          className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-slate-200 dark:border-border-dark group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden"
          style={profilePhoto ? { backgroundImage: `url(${profilePhoto})` } : {}}
        >
          {!profilePhoto && (
            <span className="bg-primary/20 w-full h-full flex items-center justify-center text-primary font-semibold text-sm">
              {userInitial}
            </span>
          )}
        </div>
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#101322]"></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1d2d] rounded-xl border border-slate-200 dark:border-border-dark shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-slate-100 dark:border-border-dark">
            <div className="flex items-center gap-3">
              {/* Avatar with upload */}
              <div className="relative group">
                <div 
                  className="size-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden bg-cover bg-center"
                  style={profilePhoto ? { backgroundImage: `url(${profilePhoto})` } : {}}
                >
                  {!profilePhoto && (
                    <span className="text-primary font-bold text-lg">{userInitial}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">{userName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Credits Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Credits</span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {credits !== null ? credits : '...'} left
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">info</span>
                Daily credits reset at midnight
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
              Settings
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-400">credit_card</span>
              Plans & Billing
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-400">account_circle</span>
              {profilePhoto ? 'Change Photo' : 'Upload Photo'}
            </button>

            {profilePhoto && (
              <button
                onClick={handleRemovePhoto}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Remove Photo
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-border-dark"></div>

          {/* Sign Out */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-400">logout</span>
              Sign out
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-border-dark">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Avallon v1.0 • Made with ❤️
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
