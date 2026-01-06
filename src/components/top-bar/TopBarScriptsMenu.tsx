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

const popularScriptIds = ['tb', 'snv'];
const popularScripts = editions.filter((script) => popularScriptIds.includes(script.id));
const officialScripts = editions.filter((script) => script.isOfficial);

export function TopBarScriptsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='h-9 px-3'
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
                        <DropdownMenuItem key={script.id}>
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
