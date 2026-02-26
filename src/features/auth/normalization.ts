import type { LoginPayload, RegisterPayload } from '@/types/api';

function collapseSpaces(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function normalizeAuthEmail(value: string) {
  return collapseSpaces(value).toLowerCase();
}

export function normalizeAuthPassword(value: string) {
  return value.trim();
}

export function normalizePersonName(value: string) {
  return collapseSpaces(value);
}

export function splitFullName(value: string) {
  const normalized = normalizePersonName(value);
  const [firstName = '', ...rest] = normalized.split(' ').filter(Boolean);
  const lastName = rest.join(' ').trim();

  return {
    firstName,
    lastName: lastName || firstName,
  };
}

export function normalizeLoginPayload(payload: LoginPayload): LoginPayload {
  return {
    email: normalizeAuthEmail(payload.email),
    password: normalizeAuthPassword(payload.password),
  };
}

export function normalizeRegisterPayload(payload: RegisterPayload): RegisterPayload {
  return {
    firstName: normalizePersonName(payload.firstName),
    lastName: normalizePersonName(payload.lastName),
    email: normalizeAuthEmail(payload.email),
    password: normalizeAuthPassword(payload.password),
  };
}
