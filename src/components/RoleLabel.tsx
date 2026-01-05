// src/components/RoleLabel.tsx
import { Label } from '@/components/ui/label';
import { $$ROLES, Roles } from '../data/types';

export function RoleLabel({ role }: { role: Roles }) {
    return <Label className=' text-white'>{$$ROLES[role]?.name.toUpperCase()}</Label>;
}

/*
w-full min-w-fit rounded-md shadow-inner border-black border-2 bg-white text-center font-bold text-2xl px-1 py-0.5 justify-center z-30 transform translate-y-2/3
 */
