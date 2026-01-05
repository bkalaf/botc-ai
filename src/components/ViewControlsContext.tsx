// src/components/ViewControlsContext.tsx
import * as React from 'react';

type ViewControlsContextValue = {
    isViewControlsOpen: boolean;
    setIsViewControlsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleViewControls: () => void;
};

const ViewControlsContext = React.createContext<ViewControlsContextValue | undefined>(undefined);

export function ViewControlsProvider({ children }: { children: React.ReactNode }) {
    const [isViewControlsOpen, setIsViewControlsOpen] = React.useState(true);

    const value = React.useMemo(
        () => ({
            isViewControlsOpen,
            setIsViewControlsOpen,
            toggleViewControls: () => setIsViewControlsOpen((prev) => !prev)
        }),
        [isViewControlsOpen]
    );

    return <ViewControlsContext.Provider value={value}>{children}</ViewControlsContext.Provider>;
}

export function useViewControls() {
    const context = React.useContext(ViewControlsContext);
    if (!context) {
        throw new Error('useViewControls must be used within a ViewControlsProvider');
    }
    return context;
}
