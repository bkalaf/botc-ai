import { useSidebar } from '@/components/ui/sidebar';

export function SidebarBrandToggle() {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            type='button'
            onClick={toggleSidebar}
            className='flex items-center gap-2 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-ring'
            aria-label='Toggle sidebar'
        >
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq-O8uTV06F2xMayi91pOGQIgzFVLiMIDoIw&s'
                alt=''
                className='h-8 w-8 rounded-md object-cover'
                aria-hidden='true'
            />
            {/* Optional: show text only when expanded (if you want) */}
            {/* <span className="text-sm font-semibold">BOTC AI</span> */}
        </button>
    );
}
