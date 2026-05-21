import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BoardingFieldProps {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}

type BoardingControlProps = Omit<BoardingFieldProps, 'children'>;

export function BoardingField({ label, helper, error, children }: BoardingFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {helper ? <span className="block text-xs leading-5 text-slate-500">{helper}</span> : null}
      {error ? <span className="block text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

export function BoardingInput({ label, helper, error, ...props }: BoardingControlProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <BoardingField label={label} helper={helper} error={error}>
      <Input className="h-11 rounded-xl border-slate-200 bg-white" {...props} />
    </BoardingField>
  );
}

export function BoardingTextarea({ label, helper, error, ...props }: BoardingControlProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <BoardingField label={label} helper={helper} error={error}>
      <Textarea className="min-h-28 rounded-xl border-slate-200 bg-white" {...props} />
    </BoardingField>
  );
}

export function BoardingSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function BoardingLabel({ children }: { children: ReactNode }) {
  return <Label className="text-sm font-semibold text-slate-800">{children}</Label>;
}
