// src/components/RoleLabel.tsx
import { Label } from '@/components/ui/label';
import { $$ROLES, Roles } from '../data/types';

export function RoleLabel({ role }: { role: Roles }) {
    return (
        <Label className='w-full min-w-fit rounded-md shadow-inner border-black border-2 bg-white text-center font-bold text-2xl px-1 py-0.5 justify-center z-30 transform translate-y-2/3 text-white group-data-[character-type=demon]:bg-red-500 group-data-[character-type=minion]:bg-orange-500 group-data-[character-type=outsider]:bg-cyan-500 group-data-[character-type=townsfolk]:bg-blue-500 group- data-[character-type=traveler]:bg-yellow-500 '>
            {$$ROLES[role]?.name.toUpperCase()}
        </Label>
    );
}
