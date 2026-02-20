import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { profileApi } from '@/api/modules/profile.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Button } from '@/ui/Button/Button';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { onboardingSchema } from '@/features/onboarding/schemas';
import { defaultOnboardingValues } from '@/features/onboarding/types';
import type { OnboardingFormValues } from '@/features/onboarding/types';
import { EducationStep } from '@/features/onboarding/steps/EducationStep';
import { PersonalInfoStep } from '@/features/onboarding/steps/PersonalInfoStep';
import { PreferencesStep } from '@/features/onboarding/steps/PreferencesStep';
import { formatDateTime } from '@/lib/date';
import { useAuthStore } from '@/stores/auth.store';

const MAX_AVATAR_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_AVATAR_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'];

interface ResumeMeta {
  fileName: string;
  url: string;
  uploadedAt: string;
}

function isAllowedResumeFile(file: File) {
  const fileName = file.name.toLowerCase();
  return ALLOWED_RESUME_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

function isAllowedAvatarFile(file: File) {
  const fileName = file.name.toLowerCase();
  return ALLOWED_AVATAR_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

function formatFileSize(file: File) {
  const sizeKb = file.size / 1024;
  if (sizeKb < 1024) {
    return `${Math.round(sizeKb)} KB`;
  }

  return `${(sizeKb / 1024).toFixed(1)} MB`;
}

function getNameInitials(firstName: string, lastName: string) {
  const firstInitial = firstName.trim().charAt(0).toUpperCase();
  const lastInitial = lastName.trim().charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}` || 'U';
}

export function ProfilePage() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeMeta, setResumeMeta] = useState<ResumeMeta>({
    fileName: '',
    url: '',
    uploadedAt: '',
  });
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const avatarUploadRequestRef = useRef(0);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaultOnboardingValues,
    mode: 'onBlur',
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const profile = await profileApi.getProfile();

      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        educationLevel: profile.educationLevel,
        fieldOfStudy: profile.fieldOfStudy,
        graduationYear: profile.graduationYear,
        preferredCountry: profile.preferredCountry,
        preferredIndustry: profile.preferredIndustry,
        languages: profile.languages,
        housingSupportNeeded: profile.housingSupportNeeded,
        bio: profile.bio,
      });
      setResumeMeta({
        fileName: profile.resumeFileName ?? '',
        url: profile.resumeUrl ?? '',
        uploadedAt: profile.resumeUploadedAt ?? '',
      });
      setAvatarUrl(profile.avatarUrl ?? '');
      updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        profileCompletion: profile.completion,
        avatarUrl: profile.avatarUrl,
      });
    } catch {
      reset(defaultOnboardingValues);
      setResumeMeta({
        fileName: '',
        url: '',
        uploadedAt: '',
      });
      setAvatarUrl('');
    } finally {
      setIsLoading(false);
    }
  }, [reset, updateUser]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const onSubmit = async (values: OnboardingFormValues) => {
    try {
      const updatedProfile = await profileApi.updateProfile(values);
      setResumeMeta({
        fileName: updatedProfile.resumeFileName ?? '',
        url: updatedProfile.resumeUrl ?? '',
        uploadedAt: updatedProfile.resumeUploadedAt ?? '',
      });
      setAvatarUrl(updatedProfile.avatarUrl ?? '');
      updateUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        profileCompletion: updatedProfile.completion,
        avatarUrl: updatedProfile.avatarUrl,
      });
      toast.success('Profile updated');
    } catch {
      toast.error('Unable to update profile at the moment.');
    }
  };

  const onResumeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedResume(null);
      return;
    }

    if (!isAllowedResumeFile(file)) {
      toast.error('Only PDF, DOC, or DOCX files are allowed.');
      event.target.value = '';
      setSelectedResume(null);
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      toast.error('Maximum file size is 5 MB.');
      event.target.value = '';
      setSelectedResume(null);
      return;
    }

    setSelectedResume(file);
  };

  const onAvatarSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isAllowedAvatarFile(file)) {
      toast.error('Only JPG, PNG, or WEBP files are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error('Maximum avatar size is 3 MB.');
      event.target.value = '';
      return;
    }

    event.target.value = '';
    void uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    const previousAvatarUrl = avatarUrl;
    const localPreviewUrl = URL.createObjectURL(file);
    const requestId = avatarUploadRequestRef.current + 1;
    avatarUploadRequestRef.current = requestId;

    setAvatarUrl(localPreviewUrl);
    setIsUploadingAvatar(true);

    try {
      const updatedProfile = await profileApi.uploadAvatar(file);

      if (avatarUploadRequestRef.current !== requestId) {
        return;
      }

      setAvatarUrl(updatedProfile.avatarUrl ?? previousAvatarUrl);
      updateUser({
        avatarUrl: updatedProfile.avatarUrl,
      });
      toast.success('Profile photo uploaded.');
    } catch {
      if (avatarUploadRequestRef.current !== requestId) {
        return;
      }

      setAvatarUrl(previousAvatarUrl);
      toast.error('Unable to upload profile photo right now.');
    } finally {
      URL.revokeObjectURL(localPreviewUrl);

      if (avatarUploadRequestRef.current === requestId) {
        setIsUploadingAvatar(false);
      }
    }
  };

  const openAvatarPicker = () => {
    if (isUploadingAvatar) {
      return;
    }

    avatarInputRef.current?.click();
  };

  const onUploadResume = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume file first.');
      return;
    }

    try {
      setIsUploadingResume(true);
      const updatedProfile = await profileApi.uploadResume(selectedResume);
      setResumeMeta({
        fileName: updatedProfile.resumeFileName ?? selectedResume.name,
        url: updatedProfile.resumeUrl ?? '',
        uploadedAt: updatedProfile.resumeUploadedAt ?? new Date().toISOString(),
      });
      updateUser({
        profileCompletion: updatedProfile.completion,
      });
      setSelectedResume(null);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
      toast.success('Resume uploaded successfully.');
    } catch {
      toast.error('Unable to upload resume right now.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const firstName = watch('firstName')?.trim() ?? '';
  const lastName = watch('lastName')?.trim() ?? '';
  const nameInitials = getNameInitials(firstName, lastName);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Profile" subtitle="View and edit your full placement profile." />
        <div className="space-y-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="View and edit your full placement profile." />
      <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile photo</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Click the avatar to upload or change your photo.</p>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/70">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                className="group relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-slate-200 bg-brand-100 text-2xl font-semibold text-brand-700 transition-all hover:border-brand-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:bg-brand-500/20 dark:text-brand-100 dark:hover:border-brand-400 dark:focus-visible:outline-brand-300"
                onClick={openAvatarPicker}
                aria-label="Upload profile photo"
                title="Change profile photo"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                    width={80}
                    height={80}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  nameInitials
                )}
                <span className="pointer-events-none absolute inset-0 bg-slate-900/0 transition-colors duration-200 group-hover:bg-slate-900/28 group-focus-visible:bg-slate-900/28" />
                <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="rounded-full border border-white/70 bg-slate-900/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
                    Edit photo
                  </span>
                </span>
                {isUploadingAvatar ? (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-900/45">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                  </span>
                ) : null}
              </button>

              <div className="min-w-0 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{avatarUrl ? 'Profile photo ready' : 'Add your profile photo'}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {isUploadingAvatar ? 'Uploading photo...' : 'Click the avatar to change your photo'}
                </p>
              </div>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={onAvatarSelect}
              className="sr-only"
              aria-hidden
            />
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Personal information</h2>
          <PersonalInfoStep register={register} errors={errors} watch={watch} setValue={setValue} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Academic profile</h2>
          <EducationStep register={register} errors={errors} watch={watch} setValue={setValue} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Preferences</h2>
          <PreferencesStep register={register} errors={errors} watch={watch} setValue={setValue} />
        </section>
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resume / CV</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Upload PDF, DOC, or DOCX. Maximum size: 5 MB.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Choose file</span>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onResumeSelect}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand-800 hover:file:bg-brand-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:file:bg-brand-500/25 dark:file:text-brand-100 dark:hover:file:bg-brand-500/35"
              />
            </label>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              isLoading={isUploadingResume}
              onClick={() => {
                void onUploadResume();
              }}
              disabled={!selectedResume}
            >
              Upload resume
            </Button>
          </div>

          {selectedResume ? (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Selected: <span className="break-all font-semibold text-slate-800 dark:text-slate-100">{selectedResume.name}</span> (
              {formatFileSize(selectedResume)})
            </p>
          ) : null}

          {resumeMeta.fileName ? (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-500/40 dark:bg-emerald-500/10">
              <p className="font-semibold text-emerald-900 dark:text-emerald-200">Current resume: {resumeMeta.fileName}</p>
              {resumeMeta.uploadedAt ? (
                <p className="text-emerald-800 dark:text-emerald-300">Uploaded: {formatDateTime(resumeMeta.uploadedAt)}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No resume uploaded yet.</p>
          )}
        </section>
        <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
          Save profile
        </Button>
      </form>
    </div>
  );
}



