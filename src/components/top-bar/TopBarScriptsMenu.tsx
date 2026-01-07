// src/components/top-bar/TopBarScriptsMenu.tsx
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import editions from '@/data/editions.json';
import { useCallback, useMemo } from 'react';
import { selectScript, setScript } from '../../store/game/game-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Roles } from '../../data/types';

const popularScriptIds = ['tb', 'snv'];
const popularScripts = editions.filter((script) => popularScriptIds.includes(script.id));
const officialScripts = editions.filter((script) => script.isOfficial);

export function TopBarScriptsMenu() {
    const loadedScript = useAppSelector(selectScript);
    const isNoLoadedScript = loadedScript == null || loadedScript.length === 0;
    const dispatch = useAppDispatch();
    const loadScript = useCallback(
        (script: string[]) => () => {
            dispatch(setScript(script as Roles[]));
        },
        [dispatch]
    );
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='h-9 px-3 data-[is-not-loaded="true"]:bg-red-500'
                    data-is-not-loaded={isNoLoadedScript}
                >
                    Scripts
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='w-56'
            >
                <DropdownMenuLabel>Popular scripts</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {popularScripts.map((script) => (
                        <DropdownMenuItem
                            key={script.id}
                            onClick={loadScript(script.roles)}
                        >
                            {script.name}
                            <DropdownMenuShortcut>Load to setup</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Official scripts</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {officialScripts.map((script) => (
                        <DropdownMenuItem key={script.id}>
                            {script.name}
                            <DropdownMenuShortcut>Load to setup</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
