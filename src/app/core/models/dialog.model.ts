export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm' | 'custom';

export interface DialogConfig {
    title?: string;
    message: string;
    type?: DialogType;
    iconUrl?: string; // Custom icon URL

    // Customization
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'primary' | 'secondary' | 'danger';
    cancelColor?: 'primary' | 'secondary' | 'outline' | 'ghost';

    // Behavior
    disableClose?: boolean; // If true, clicking backdrop won't close
    width?: string; // CSS width (e.g. '400px')
}

export interface DialogRef {
    close: (result: boolean) => void;
}
