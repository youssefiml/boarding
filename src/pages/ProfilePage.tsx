import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { profileApi } from '@/api/modules/profile.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/date';
import { useAuthStore } from '@/stores/auth.store';
import type { ProfilePayload, ProfileResponse } from '@/types/api';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { Input } from '@/ui/Input/Input';
import { ProgressBar } from '@/ui/ProgressBar/ProgressBar';
import { Select } from '@/ui/Select/Select';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { TextArea } from '@/ui/TextArea/TextArea';

const MAX_AVATAR_SIZE_BYTES = 3 * 1024 * 1024;
const MAX_RESUME_SIZE_BYTES = 6 * 1024 * 1024;
const ALLOWED_AVATAR_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const internshipDurationValues = ['3_months', '6_months', '12_months', 'flexible'] as const;

const countryOptions = ['Germany', 'France', 'Netherlands', 'Portugal', 'Spain', 'Italy', 'Belgium', 'Austria'] as const;
const industryOptions = ['Hospitality', 'Healthcare', 'IT', 'Manufacturing', 'Retail', 'Logistics', 'Finance'] as const;
const languageSuggestions = ['English', 'French', 'German', 'Spanish', 'Arabic', 'Italian'] as const;

type CefrLevel = (typeof cefrLevels)[number];
type SectionId = 'overview' | 'personal' | 'academic' | 'preferences' | 'documents';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface ResumeMeta {
  fileName: string;
  url: string;
  uploadedAt: string;
}

interface PendingAvatar {
  file: File;
  previewUrl: string;
}

interface ReadinessItem {
  id: string;
  label: string;
  done: boolean;
  section: SectionId;
}

const emptyResumeMeta: ResumeMeta = {
  fileName: '',
  url: '',
  uploadedAt: '',
};

const profileSchema = z
  .object({
    firstName: z.string().trim().min(2, 'First name is required'),
    lastName: z.string().trim().min(2, 'Last name is required'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z.string().trim().min(7, 'Enter a valid phone number'),
    educationLevel: z.enum(['high_school', 'bachelor', 'master', 'other']),
    fieldOfStudy: z.string().trim().min(2, 'Field of study is required'),
    graduationYear: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Use YYYY format')
      .refine((value) => {
        const year = Number(value);
        return year >= 1990 && year <= 2100;
      }, 'Enter a realistic graduation year'),
    expectedInternshipDuration: z.enum(internshipDurationValues),
    availabilityStartDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Select an availability date'),
    preferredCountries: z.array(z.string()).min(1, 'Select at least one country'),
    preferredIndustries: z.array(z.string()).min(1, 'Select at least one industry'),
    languagePrimary: z.string().trim().min(2, 'Primary language is required'),
    languagePrimaryLevel: z.enum(cefrLevels),
    languageSecondary: z.string().trim().max(40, 'Keep this short').optional(),
    languageSecondaryLevel: z.enum(cefrLevels).optional(),
    housingSupportNeeded: z.boolean(),
    bio: z.string().trim().min(20, 'Bio must contain at least 20 characters').max(500, 'Bio max is 500 characters'),
    avatarUrl: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.languageSecondary?.trim() && !values.languageSecondaryLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['languageSecondaryLevel'],
        message: 'Choose a level for your secondary language',
      });
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultProfileValues: ProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  educationLevel: 'bachelor',
  fieldOfStudy: '',
  graduationYear: '',
  expectedInternshipDuration: '6_months',
  availabilityStartDate: '',
  preferredCountries: [],
  preferredIndustries: [],
  languagePrimary: 'English',
  languagePrimaryLevel: 'B1',
  languageSecondary: '',
  languageSecondaryLevel: undefined,
  housingSupportNeeded: false,
  bio: '',
  avatarUrl: '',
};

function defaultAvailabilityDate() {
  const date = new Date();
  date.setDate(date.getDate() + 21);
  return date.toISOString().slice(0, 10);
}

function formatFileSize(sizeBytes: number) {
  const sizeKb = sizeBytes / 1024;

  if (sizeKb < 1024) {
    return `${Math.round(sizeKb)} KB`;
  }

  return `${(sizeKb / 1024).toFixed(1)} MB`;
}

function parseCommaList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLanguagePart(value: string): { name: string; level?: CefrLevel } {
  const normalized = value.trim();
  const match = normalized.match(/^(.*)\s+(A1|A2|B1|B2|C1|C2)$/i);

  if (!match) {
    return { name: normalized };
  }

  return {
    name: match[1].trim(),
    level: match[2].toUpperCase() as CefrLevel,
  };
}

function profileToFormValues(profile: ProfileResponse): ProfileFormValues {
  const countries = parseCommaList(profile.preferredCountry);
  const industries = parseCommaList(profile.preferredIndustry);
  const languages = parseCommaList(profile.languages).map(parseLanguagePart);

  const primaryLanguage = languages[0];
  const secondaryLanguage = languages[1];

  const durationValue =
    profile.expectedInternshipDuration === '3_months' ||
    profile.expectedInternshipDuration === '6_months' ||
    profile.expectedInternshipDuration === '12_months' ||
    profile.expectedInternshipDuration === 'flexible'
      ? profile.expectedInternshipDuration
      : '6_months';

  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    educationLevel: profile.educationLevel ?? 'bachelor',
    fieldOfStudy: profile.fieldOfStudy ?? '',
    graduationYear: profile.graduationYear ?? '',
    expectedInternshipDuration: durationValue,
    availabilityStartDate: profile.availabilityStartDate?.slice(0, 10) || defaultAvailabilityDate(),
    preferredCountries: countries.length > 0 ? countries : [],
    preferredIndustries: industries.length > 0 ? industries : [],
    languagePrimary: primaryLanguage?.name || 'English',
    languagePrimaryLevel: primaryLanguage?.level ?? 'B1',
    languageSecondary: secondaryLanguage?.name ?? '',
    languageSecondaryLevel: secondaryLanguage?.level,
    housingSupportNeeded: profile.housingSupportNeeded ?? false,
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? '',
  };
}

function buildLanguageValue(values: ProfileFormValues) {
  const primary = `${values.languagePrimary.trim()} ${values.languagePrimaryLevel}`.trim();
  const secondaryName = values.languageSecondary?.trim() ?? '';
  const secondary = secondaryName ? `${secondaryName} ${values.languageSecondaryLevel ?? ''}`.trim() : '';
  return [primary, secondary].filter(Boolean).join(', ');
}

function buildPayload(values: ProfileFormValues, resumeMeta: ResumeMeta): ProfilePayload {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    educationLevel: values.educationLevel,
    fieldOfStudy: values.fieldOfStudy.trim(),
    graduationYear: values.graduationYear.trim(),
    expectedInternshipDuration: values.expectedInternshipDuration,
    availabilityStartDate: values.availabilityStartDate,
    preferredCountry: values.preferredCountries.join(', '),
    preferredIndustry: values.preferredIndustries.join(', '),
    languages: buildLanguageValue(values),
    housingSupportNeeded: values.housingSupportNeeded,
    bio: values.bio.trim(),
    avatarUrl: values.avatarUrl?.trim() || undefined,
    resumeFileName: resumeMeta.fileName || undefined,
    resumeUrl: resumeMeta.url || undefined,
    resumeUploadedAt: resumeMeta.uploadedAt || undefined,
  };
}

function buildSnapshot(values: ProfileFormValues, resumeMeta: ResumeMeta) {
  return JSON.stringify({
    ...values,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    fieldOfStudy: values.fieldOfStudy.trim(),
    graduationYear: values.graduationYear.trim(),
    preferredCountries: [...values.preferredCountries].sort(),
    preferredIndustries: [...values.preferredIndustries].sort(),
    languagePrimary: values.languagePrimary.trim(),
    languageSecondary: values.languageSecondary?.trim() ?? '',
    bio: values.bio.trim(),
    avatarUrl: values.avatarUrl ?? '',
    resumeMeta,
  });
}

function getNameInitials(firstName: string, lastName: string) {
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
  return initials || 'ST';
}

function isAllowedFile(file: File, allowedExtensions: readonly string[]) {
  const lowerName = file.name.toLowerCase();
  return allowedExtensions.some((extension) => lowerName.endsWith(extension));
}

function formatPhoneInput(value: string) {
  const hasPlus = value.trimStart().startsWith('+');
  const digits = value.replace(/\D/g, '').slice(0, 15);

  if (!digits) {
    return hasPlus ? '+' : '';
  }

  const groups = digits.match(/.{1,3}/g) ?? [digits];
  return `${hasPlus ? '+' : ''}${groups.join(' ')}`.trim();
}

function educationLabel(value: ProfileFormValues['educationLevel']) {
  if (value === 'high_school') {
    return 'High school';
  }

  if (value === 'bachelor') {
    return 'Bachelor';
  }

  if (value === 'master') {
    return 'Master';
  }

  return 'Other';
}

function durationLabel(value: ProfileFormValues['expectedInternshipDuration']) {
  if (value === '3_months') {
    return '3 months';
  }

  if (value === '6_months') {
    return '6 months';
  }

  if (value === '12_months') {
    return '12 months';
  }

  return 'Flexible';
}

function computeReadiness(values: ProfileFormValues, resumeMeta: ResumeMeta): ReadinessItem[] {
  return [
    { id: 'avatar', label: 'Add profile photo', done: Boolean(values.avatarUrl), section: 'overview' },
    {
      id: 'name',
      label: 'Complete full name',
      done: values.firstName.trim().length > 1 && values.lastName.trim().length > 1,
      section: 'personal',
    },
    { id: 'phone', label: 'Add valid phone number', done: values.phone.replace(/\D/g, '').length >= 7, section: 'personal' },
    { id: 'study', label: 'Add field of study', done: values.fieldOfStudy.trim().length > 1, section: 'academic' },
    { id: 'duration', label: 'Set internship duration', done: Boolean(values.expectedInternshipDuration), section: 'academic' },
    { id: 'availability', label: 'Set availability date', done: Boolean(values.availabilityStartDate), section: 'academic' },
    { id: 'countries', label: 'Choose preferred countries', done: values.preferredCountries.length > 0, section: 'preferences' },
    { id: 'industries', label: 'Choose preferred industries', done: values.preferredIndustries.length > 0, section: 'preferences' },
    {
      id: 'languages',
      label: 'Add language levels',
      done: values.languagePrimary.trim().length > 1 && Boolean(values.languagePrimaryLevel),
      section: 'preferences',
    },
    { id: 'bio', label: 'Write short bio', done: values.bio.trim().length >= 60, section: 'preferences' },
    { id: 'resume', label: 'Upload resume', done: Boolean(resumeMeta.fileName), section: 'documents' },
  ];
}

export function ProfilePage() {
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [savedStrength, setSavedStrength] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState<SectionId | null>(null);
  const [resumeMeta, setResumeMeta] = useState<ResumeMeta>(emptyResumeMeta);
  const [pendingResume, setPendingResume] = useState<File | null>(null);
  const [isResumeDragActive, setIsResumeDragActive] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
    overview: true,
    personal: true,
    academic: true,
    preferences: true,
    documents: true,
  });

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const highlightTimerRef = useRef<number | null>(null);
  const isProfileReadyRef = useRef(false);
  const saveRequestRef = useRef(0);
  const snapshotRef = useRef('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfileValues,
    mode: 'onBlur',
  });

  const watchedValues = useWatch({ control });
  const liveValues = useMemo<ProfileFormValues>(() => {
    return {
      ...defaultProfileValues,
      ...(watchedValues ?? {}),
      preferredCountries: watchedValues?.preferredCountries ?? [],
      preferredIndustries: watchedValues?.preferredIndustries ?? [],
    };
  }, [watchedValues]);

  const displayedAvatarUrl = pendingAvatar?.previewUrl || liveValues.avatarUrl || '';
  const profileInitials = getNameInitials(liveValues.firstName, liveValues.lastName);

  const readinessItems = useMemo(() => computeReadiness(liveValues, resumeMeta), [liveValues, resumeMeta]);
  const profileStrength = useMemo(() => {
    const completed = readinessItems.filter((item) => item.done).length;
    return Math.round((completed / readinessItems.length) * 100);
  }, [readinessItems]);

  const missingItems = useMemo(() => readinessItems.filter((item) => !item.done), [readinessItems]);
  const profileDelta = profileStrength - savedStrength;

  const personalSummary = useMemo(() => {
    const fullName = `${liveValues.firstName} ${liveValues.lastName}`.trim() || 'No name yet';
    const email = liveValues.email || 'No email';
    return `${fullName}  -  ${email}`;
  }, [liveValues.email, liveValues.firstName, liveValues.lastName]);

  const academicSummary = useMemo(() => {
    const education = educationLabel(liveValues.educationLevel);
    const year = liveValues.graduationYear || 'No graduation year';
    const duration = durationLabel(liveValues.expectedInternshipDuration);
    return `${education}, ${year}  -  ${duration}`;
  }, [liveValues.educationLevel, liveValues.expectedInternshipDuration, liveValues.graduationYear]);

  const preferencesSummary = useMemo(() => {
    const countries = liveValues.preferredCountries.length ? liveValues.preferredCountries.join(', ') : 'No countries';
    const industries = liveValues.preferredIndustries.length ? liveValues.preferredIndustries.join(', ') : 'No industries';
    return `${countries}  -  ${industries}`;
  }, [liveValues.preferredCountries, liveValues.preferredIndustries]);

  const documentsSummary = useMemo(() => {
    if (resumeMeta.fileName) {
      return `Resume: ${resumeMeta.fileName}`;
    }

    return 'No resume uploaded';
  }, [resumeMeta.fileName]);

  const saveStateLabel =
    saveState === 'saving'
      ? 'Saving...'
      : saveState === 'saved'
        ? 'All changes saved'
        : saveState === 'error'
          ? 'Save failed'
          : 'Autosave enabled';

  const persistProfile = useCallback(
    async (
      values: ProfileFormValues,
      options?: {
        manual?: boolean;
        successMessage?: string;
        resumeOverride?: ResumeMeta;
      }
    ) => {
      const requestId = saveRequestRef.current + 1;
      saveRequestRef.current = requestId;
      setSaveState('saving');

      const resumeToUse = options?.resumeOverride ?? resumeMeta;

      try {
        const payload = buildPayload(values, resumeToUse);
        const updatedProfile = await profileApi.updateProfile(payload);

        if (requestId !== saveRequestRef.current) {
          return;
        }

        const nextResumeMeta: ResumeMeta = {
          fileName: updatedProfile.resumeFileName ?? resumeToUse.fileName,
          url: updatedProfile.resumeUrl ?? resumeToUse.url,
          uploadedAt: updatedProfile.resumeUploadedAt ?? resumeToUse.uploadedAt,
        };

        setResumeMeta(nextResumeMeta);
        setSavedStrength(updatedProfile.completion);
        setLastSavedAt(new Date().toISOString());
        setSaveState('saved');
        updateUser({
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          email: updatedProfile.email,
          profileCompletion: updatedProfile.completion,
          avatarUrl: updatedProfile.avatarUrl,
        });

        if ((updatedProfile.avatarUrl ?? '') !== (values.avatarUrl ?? '')) {
          setValue('avatarUrl', updatedProfile.avatarUrl ?? '', {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
        }

        snapshotRef.current = buildSnapshot(
          {
            ...values,
            avatarUrl: updatedProfile.avatarUrl ?? values.avatarUrl ?? '',
          },
          nextResumeMeta
        );

        if (options?.manual) {
          toast.success(options.successMessage ?? 'Profile updated.');
        }
      } catch {
        if (requestId !== saveRequestRef.current) {
          return;
        }

        setSaveState('error');

        if (options?.manual) {
          toast.error('Unable to save profile right now.');
        }
      }
    },
    [resumeMeta, setValue, updateUser]
  );

  const loadProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const profile = await profileApi.getProfile();
      const nextValues = profileToFormValues(profile);
      const nextResumeMeta: ResumeMeta = {
        fileName: profile.resumeFileName ?? '',
        url: profile.resumeUrl ?? '',
        uploadedAt: profile.resumeUploadedAt ?? '',
      };

      reset(nextValues);
      setResumeMeta(nextResumeMeta);
      setSavedStrength(profile.completion);
      setLastSavedAt(new Date().toISOString());
      setSaveState('saved');
      snapshotRef.current = buildSnapshot(nextValues, nextResumeMeta);
      updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        profileCompletion: profile.completion,
        avatarUrl: profile.avatarUrl,
      });
    } catch {
      const fallbackValues = {
        ...defaultProfileValues,
        availabilityStartDate: defaultAvailabilityDate(),
      };

      reset(fallbackValues);
      setResumeMeta(emptyResumeMeta);
      setSavedStrength(0);
      setLastSavedAt(null);
      setSaveState('idle');
      snapshotRef.current = buildSnapshot(fallbackValues, emptyResumeMeta);
      toast.error('Unable to load profile right now.');
    } finally {
      isProfileReadyRef.current = true;
      setIsLoading(false);
    }
  }, [reset, updateUser]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!isProfileReadyRef.current || isLoading) {
      return;
    }

    const snapshot = buildSnapshot(liveValues, resumeMeta);

    if (snapshot === snapshotRef.current) {
      setSaveState((current) => (current === 'error' ? current : 'saved'));
      return;
    }

    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    setSaveState('saving');

    autosaveTimerRef.current = window.setTimeout(() => {
      const parsed = profileSchema.safeParse(liveValues);

      if (!parsed.success) {
        setSaveState('idle');
        return;
      }

      void persistProfile(parsed.data);
    }, 850);

    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [isLoading, liveValues, persistProfile, resumeMeta]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }

      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pendingAvatar?.previewUrl) {
        URL.revokeObjectURL(pendingAvatar.previewUrl);
      }
    };
  }, [pendingAvatar]);

  const toggleSection = useCallback((sectionId: SectionId) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  }, []);

  const focusSection = useCallback((sectionId: SectionId) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: true,
    }));

    setHighlightedSection(sectionId);
    document.getElementById(`profile-section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
    }

    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedSection(null);
    }, 1800);
  }, []);

  const handleImproveProfile = useCallback(() => {
    const firstGap = missingItems[0];

    if (!firstGap) {
      toast.success('Profile looks ready for matching.');
      return;
    }

    focusSection(firstGap.section);
  }, [focusSection, missingItems]);

  const handleManualSave = useCallback(() => {
    void handleSubmit(async (values) => {
      await persistProfile(values, {
        manual: true,
        successMessage: 'Profile changes saved.',
      });
    })();
  }, [handleSubmit, persistProfile]);

  const toggleSelectable = useCallback(
    (field: 'preferredCountries' | 'preferredIndustries', value: string, limit: number) => {
      const currentValues = getValues(field);
      const exists = currentValues.includes(value);
      const nextValues = exists ? currentValues.filter((item) => item !== value) : [...currentValues, value];

      if (!exists && currentValues.length >= limit) {
        toast.error(`Select up to ${limit} options in this section.`);
        return;
      }

      setValue(field, nextValues, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue]
  );

  const onAvatarInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!isAllowedFile(file, ALLOWED_AVATAR_EXTENSIONS)) {
      toast.error('Only JPG, JPEG, PNG, and WEBP files are allowed.');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error('Maximum profile photo size is 3 MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPendingAvatar((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return {
        file,
        previewUrl,
      };
    });
  };

  const handleApplyAvatar = useCallback(async () => {
    if (!pendingAvatar) {
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const updatedProfile = await profileApi.uploadAvatar(pendingAvatar.file);
      setValue('avatarUrl', updatedProfile.avatarUrl ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      updateUser({
        avatarUrl: updatedProfile.avatarUrl,
        profileCompletion: updatedProfile.completion,
      });
      setSavedStrength(updatedProfile.completion);
      setLastSavedAt(new Date().toISOString());
      setSaveState('saved');
      toast.success('Profile photo uploaded.');
      setPendingAvatar((current) => {
        if (current?.previewUrl) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return null;
      });
    } catch {
      toast.error('Unable to upload photo right now.');
    } finally {
      setIsUploadingAvatar(false);
    }
  }, [pendingAvatar, setValue, updateUser]);

  const handleRemoveAvatar = useCallback(() => {
    setValue('avatarUrl', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
    updateUser({ avatarUrl: undefined });
    setPendingAvatar((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
    toast.success('Photo removed. Save to sync this change.');
  }, [setValue, updateUser]);

  const chooseResumeFile = useCallback((file: File) => {
    if (!isAllowedFile(file, ALLOWED_RESUME_EXTENSIONS)) {
      toast.error('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      toast.error('Maximum resume size is 6 MB.');
      return;
    }

    setPendingResume(file);
  }, []);

  const onResumeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    chooseResumeFile(file);
  };

  const onResumeDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsResumeDragActive(true);
  };

  const onResumeDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsResumeDragActive(false);
  };

  const onResumeDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsResumeDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    chooseResumeFile(file);
  };

  const handleUploadResume = useCallback(async () => {
    if (!pendingResume) {
      toast.error('Select a resume file first.');
      return;
    }

    setIsUploadingResume(true);

    try {
      const updatedProfile = await profileApi.uploadResume(pendingResume);
      setResumeMeta({
        fileName: updatedProfile.resumeFileName ?? pendingResume.name,
        url: updatedProfile.resumeUrl ?? '',
        uploadedAt: updatedProfile.resumeUploadedAt ?? new Date().toISOString(),
      });
      updateUser({
        profileCompletion: updatedProfile.completion,
      });
      setSavedStrength(updatedProfile.completion);
      setLastSavedAt(new Date().toISOString());
      toast.success('Resume uploaded.');
      setPendingResume(null);

      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
    } catch {
      toast.error('Unable to upload resume right now.');
    } finally {
      setIsUploadingResume(false);
    }
  }, [pendingResume, updateUser]);

  const handleRemoveResume = useCallback(() => {
    const clearedResume = { ...emptyResumeMeta };
    setPendingResume(null);
    setResumeMeta(clearedResume);

    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }

    const parsed = profileSchema.safeParse(getValues());

    if (!parsed.success) {
      setSaveState('idle');
      toast.success('Resume removed locally. Fix form errors then save to sync.');
      return;
    }

    void persistProfile(parsed.data, {
      manual: true,
      successMessage: 'Resume removed.',
      resumeOverride: clearedResume,
    });
  }, [getValues, persistProfile]);

  const sectionClasses = useCallback(
    (sectionId: SectionId) =>
      cn(
        'overflow-hidden p-0 transition-[box-shadow,border-color] duration-200',
        highlightedSection === sectionId
          ? 'border-brand-400 shadow-[0_0_0_2px_rgba(59,130,246,0.25)] dark:border-brand-400'
          : ''
      ),
    [highlightedSection]
  );

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Profile" subtitle="Manage your profile quality and placement readiness." />
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Optimize your profile to increase matching quality and interview conversion." />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="space-y-4 pb-28">
          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">Profile strength</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{profileStrength}%</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Placement readiness based on completion and quality signals.</p>
              </div>

              <div className="space-y-2 text-right">
                <Button type="button" variant="secondary" size="sm" onClick={handleImproveProfile}>
                  Improve profile
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profileDelta > 0
                    ? `Potential +${profileDelta}% after save`
                    : profileDelta < 0
                      ? `Potential ${profileDelta}% versus last save`
                      : 'No change since last save'}
                </p>
              </div>
            </div>

            <ProgressBar className="mt-4" value={profileStrength} />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Missing to reach 90%</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                  {missingItems.slice(0, 3).map((item) => (
                    <li key={item.id}>{item.label}</li>
                  ))}
                  {missingItems.length === 0 ? <li>All core profile sections are complete.</li> : null}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Save status</p>
                <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      saveState === 'saving'
                        ? 'animate-pulse bg-amber-500'
                        : saveState === 'error'
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                    )}
                    aria-hidden
                  />
                  <span>{saveStateLabel}</span>
                </div>
                {lastSavedAt ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Last saved: {formatDateTime(lastSavedAt)}</p>
                ) : null}
              </div>
            </div>
          </Card>

          <form className="space-y-4" noValidate onSubmit={handleSubmit((values) => persistProfile(values, { manual: true }))}>
            <Card id="profile-section-overview" className={sectionClasses('overview')}>
              <button
                type="button"
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                onClick={() => toggleSection('overview')}
                aria-expanded={expandedSections.overview}
                aria-controls="profile-panel-overview"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile overview</h2>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                    {displayedAvatarUrl ? 'Photo uploaded and ready' : 'No photo uploaded yet'}  -  {personalSummary}
                  </p>
                </div>
                <span className="inline-flex min-h-8 items-center rounded-full border border-slate-300 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  {expandedSections.overview ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {expandedSections.overview ? (
                <div id="profile-panel-overview" className="border-t border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
                  <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/65">
                      <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-brand-300 bg-brand-100 text-3xl font-semibold text-brand-700 dark:border-brand-400/70 dark:bg-brand-500/20 dark:text-brand-100">
                        {displayedAvatarUrl ? (
                          <img
                            src={displayedAvatarUrl}
                            alt="Profile avatar"
                            className="h-full w-full object-cover"
                            width={144}
                            height={144}
                            decoding="async"
                            loading="lazy"
                          />
                        ) : (
                          profileInitials
                        )}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Profile photo</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        Professional photos increase recruiter trust and profile click-through.
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => avatarInputRef.current?.click()}>
                          Change photo
                        </Button>
                        {pendingAvatar ? (
                          <>
                            <Button type="button" size="sm" onClick={() => void handleApplyAvatar()} isLoading={isUploadingAvatar}>
                              Save photo
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setPendingAvatar((current) => {
                                  if (current?.previewUrl) {
                                    URL.revokeObjectURL(current.previewUrl);
                                  }
                                  return null;
                                });
                              }}
                            >
                              Discard
                            </Button>
                          </>
                        ) : null}
                        {(liveValues.avatarUrl || pendingAvatar) ? (
                          <Button type="button" size="sm" variant="ghost" onClick={handleRemoveAvatar}>
                            Remove
                          </Button>
                        ) : null}
                      </div>

                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={onAvatarInput}
                        className="sr-only"
                        aria-hidden
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/65">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Profile impact summary</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                          Your profile directly impacts matching score and interview invitation rate.
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/65">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Current focus</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                          {missingItems.slice(0, 3).map((item) => (
                            <li key={item.id}>{item.label}</li>
                          ))}
                          {missingItems.length === 0 ? <li>Your profile is fully ready for matching.</li> : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            <Card id="profile-section-personal" className={sectionClasses('personal')}>
              <button
                type="button"
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                onClick={() => toggleSection('personal')}
                aria-expanded={expandedSections.personal}
                aria-controls="profile-panel-personal"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal information</h2>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{personalSummary}</p>
                </div>
                <span className="inline-flex min-h-8 items-center rounded-full border border-slate-300 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  {expandedSections.personal ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {expandedSections.personal ? (
                <div id="profile-panel-personal" className="border-t border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input label="First name" autoComplete="given-name" {...register('firstName')} error={errors.firstName?.message} />
                    <Input label="Last name" autoComplete="family-name" {...register('lastName')} error={errors.lastName?.message} />
                    <Input
                      label="Email"
                      type="email"
                      autoComplete="email"
                      {...register('email')}
                      error={errors.email?.message}
                      hint="Use the email recruiters will contact."
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      {...register('phone', {
                        onChange: (event) => {
                          const formatted = formatPhoneInput(String(event.target.value ?? ''));
                          setValue('phone', formatted, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        },
                      })}
                      error={errors.phone?.message}
                      hint="International format recommended."
                    />
                  </div>
                </div>
              ) : null}
            </Card>

            <Card id="profile-section-academic" className={sectionClasses('academic')}>
              <button
                type="button"
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                onClick={() => toggleSection('academic')}
                aria-expanded={expandedSections.academic}
                aria-controls="profile-panel-academic"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Academic profile</h2>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{academicSummary}</p>
                </div>
                <span className="inline-flex min-h-8 items-center rounded-full border border-slate-300 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  {expandedSections.academic ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {expandedSections.academic ? (
                <div id="profile-panel-academic" className="border-t border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Select label="Education level" {...register('educationLevel')} error={errors.educationLevel?.message}>
                      <option value="high_school">High school</option>
                      <option value="bachelor">Bachelor</option>
                      <option value="master">Master</option>
                      <option value="other">Other</option>
                    </Select>

                    <Input
                      label="Field of study"
                      {...register('fieldOfStudy')}
                      error={errors.fieldOfStudy?.message}
                      hint="Example: Business Administration"
                    />

                    <Input
                      label="Graduation year"
                      inputMode="numeric"
                      placeholder="2027"
                      {...register('graduationYear')}
                      error={errors.graduationYear?.message}
                    />

                    <Select
                      label="Expected internship duration"
                      {...register('expectedInternshipDuration')}
                      error={errors.expectedInternshipDuration?.message}
                    >
                      <option value="3_months">3 months</option>
                      <option value="6_months">6 months</option>
                      <option value="12_months">12 months</option>
                      <option value="flexible">Flexible</option>
                    </Select>

                    <Input
                      label="Availability start date"
                      type="date"
                      {...register('availabilityStartDate')}
                      error={errors.availabilityStartDate?.message}
                    />
                  </div>
                </div>
              ) : null}
            </Card>

            <Card id="profile-section-preferences" className={sectionClasses('preferences')}>
              <button
                type="button"
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                onClick={() => toggleSection('preferences')}
                aria-expanded={expandedSections.preferences}
                aria-controls="profile-panel-preferences"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Placement preferences</h2>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{preferencesSummary}</p>
                </div>
                <span className="inline-flex min-h-8 items-center rounded-full border border-slate-300 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  {expandedSections.preferences ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {expandedSections.preferences ? (
                <div id="profile-panel-preferences" className="space-y-4 border-t border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Preferred industries</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Select up to 4 industries.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {industryOptions.map((option) => {
                        const isActive = liveValues.preferredIndustries.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            className={cn(
                              'inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.08em] transition',
                              isActive
                                ? 'border-brand-400 bg-brand-100 text-brand-800 dark:border-brand-400/70 dark:bg-brand-500/20 dark:text-brand-100'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100'
                            )}
                            onClick={() => toggleSelectable('preferredIndustries', option, 4)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {errors.preferredIndustries?.message ? (
                      <p className="mt-2 text-xs font-medium text-rose-700 dark:text-rose-300">{errors.preferredIndustries.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Preferred countries</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Select up to 3 countries.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {countryOptions.map((option) => {
                        const isActive = liveValues.preferredCountries.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            className={cn(
                              'inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.08em] transition',
                              isActive
                                ? 'border-brand-400 bg-brand-100 text-brand-800 dark:border-brand-400/70 dark:bg-brand-500/20 dark:text-brand-100'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100'
                            )}
                            onClick={() => toggleSelectable('preferredCountries', option, 3)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {errors.preferredCountries?.message ? (
                      <p className="mt-2 text-xs font-medium text-rose-700 dark:text-rose-300">{errors.preferredCountries.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Primary language"
                      list="profile-language-list"
                      {...register('languagePrimary')}
                      error={errors.languagePrimary?.message}
                    />
                    <Select label="Primary CEFR level" {...register('languagePrimaryLevel')} error={errors.languagePrimaryLevel?.message}>
                      {cefrLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                    <Input
                      label="Secondary language (optional)"
                      list="profile-language-list"
                      {...register('languageSecondary')}
                      error={errors.languageSecondary?.message}
                    />
                    <Select
                      label="Secondary CEFR level"
                      {...register('languageSecondaryLevel')}
                      error={errors.languageSecondaryLevel?.message}
                    >
                      <option value="">Not selected</option>
                      {cefrLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                    <datalist id="profile-language-list">
                      {languageSuggestions.map((language) => (
                        <option key={language} value={language} />
                      ))}
                    </datalist>
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/65 dark:text-slate-200">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-400" {...register('housingSupportNeeded')} />
                    <span>I need housing support from placement partners.</span>
                  </label>

                  <TextArea
                    label="Short bio"
                    {...register('bio')}
                    error={errors.bio?.message}
                    hint={`${liveValues.bio.length}/500 characters  -  2 to 4 sentences recommended`}
                  />
                </div>
              ) : null}
            </Card>
            <Card id="profile-section-documents" className={sectionClasses('documents')}>
              <button
                type="button"
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                onClick={() => toggleSection('documents')}
                aria-expanded={expandedSections.documents}
                aria-controls="profile-panel-documents"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Documents</h2>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{documentsSummary}</p>
                </div>
                <span className="inline-flex min-h-8 items-center rounded-full border border-slate-300 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  {expandedSections.documents ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {expandedSections.documents ? (
                <div id="profile-panel-documents" className="space-y-4 border-t border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
                  <div
                    className={cn(
                      'rounded-xl border-2 border-dashed p-4 transition-colors',
                      isResumeDragActive
                        ? 'border-brand-400 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
                        : 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/65'
                    )}
                    onDragOver={onResumeDragOver}
                    onDragLeave={onResumeDragLeave}
                    onDrop={onResumeDrop}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Drag and drop resume</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      PDF, DOC, or DOCX up to {formatFileSize(MAX_RESUME_SIZE_BYTES)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => resumeInputRef.current?.click()}>
                        Choose file
                      </Button>
                      <Button type="button" size="sm" onClick={() => void handleUploadResume()} isLoading={isUploadingResume} disabled={!pendingResume}>
                        Upload
                      </Button>
                    </div>

                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={onResumeInput}
                      className="sr-only"
                      aria-hidden
                    />

                    {pendingResume ? (
                      <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                        Selected: <span className="font-semibold">{pendingResume.name}</span> ({formatFileSize(pendingResume.size)})
                      </p>
                    ) : null}
                  </div>

                  {resumeMeta.fileName ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-500/35 dark:bg-emerald-500/10">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">{resumeMeta.fileName}</p>
                      <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">
                        Uploaded {resumeMeta.uploadedAt ? formatDateTime(resumeMeta.uploadedAt) : 'recently'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {resumeMeta.url ? (
                          <a
                            className="inline-flex min-h-9 items-center rounded-lg border border-emerald-300 bg-white px-3 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 hover:border-emerald-400 dark:border-emerald-400/60 dark:bg-slate-900 dark:text-emerald-200"
                            href={resumeMeta.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Preview
                          </a>
                        ) : null}
                        <Button type="button" size="sm" variant="outline" onClick={() => resumeInputRef.current?.click()}>
                          Replace
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={handleRemoveResume}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300">No resume uploaded yet.</p>
                  )}
                </div>
              ) : null}
            </Card>

            <div className="pt-1 sm:sticky sm:bottom-3 sm:z-30">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900/95">
                <button
                  type="button"
                  className="text-xs font-medium text-slate-500 underline-offset-2 transition hover:text-rose-700 hover:underline dark:text-slate-400 dark:hover:text-rose-300"
                  onClick={() => toast('Delete account is managed by your agency support team.')}
                >
                  Delete account
                </button>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        saveState === 'saving'
                          ? 'animate-pulse bg-amber-500'
                          : saveState === 'error'
                            ? 'bg-rose-500'
                            : 'bg-emerald-500'
                      )}
                      aria-hidden
                    />
                    <span>{saveStateLabel}</span>
                  </span>
                  <Button type="button" className="w-full sm:w-auto" onClick={handleManualSave} isLoading={isSubmitting || saveState === 'saving'}>
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <aside className="hidden xl:block">
          <Card className="sticky top-4 p-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Profile impact score</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{profileStrength}%</p>
            <ProgressBar className="mt-3" value={profileStrength} />

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Strengths</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {readinessItems
                    .filter((item) => item.done)
                    .slice(0, 3)
                    .map((item) => (
                      <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                        {item.label}
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Weak points</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {missingItems.slice(0, 3).map((item) => (
                    <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                      {item.label}
                    </li>
                  ))}
                  {missingItems.length === 0 ? (
                    <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                      No critical gaps detected.
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
              title="Matching score combines profile completion, language alignment, and document readiness."
            >
              How matching score works
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
