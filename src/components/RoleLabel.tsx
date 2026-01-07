// src/components/RoleLabel.tsx
import { Label } from '@/components/ui/label';
import { $$ROLES, Roles } from '../data/types';

export function RoleLabel({ role }: { role: Roles }) {
    return (
        <Label className='text-sm bg-black text-white group-data-[character-type="demon"]:bg-rose-500/70 group-data-[character-type="minion"]:bg-orange-500/70  group-data-[character-type="townsfolk"]:bg-blue-500/90 group-data-[character-type="traveler"]:bg-yellow-500/70 group-data-[character-type="outsider"]:bg-cyan-500/90 px-1.5 rounded-sm justify-center mx-auto pointer-events-auto z-30 absolute top-0'>
            {$$ROLES[role].name.toString()}
        </Label>
    );
}

export function NameLabel({ name }: { name: string }) {
    return (
        <span className='font-rubik flex text-center transform font-normal justify-center z-30 font-lg px-1.5 text-sm bg-black/70 rounded-sm text-white absolute bottom-0'>
            {name}
        </span>
    );
}
