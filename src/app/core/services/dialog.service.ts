import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent, inject } from '@angular/core';
import { DialogConfig } from '@core/models/dialog.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from '@shared/components/dialog/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private readonly appRef = inject(ApplicationRef);
    private readonly injector = inject(EnvironmentInjector);

    // Reference to the currently active dialog component
    private dialogComponentRef: ComponentRef<DialogComponent> | null = null;

    // Subject to return the result of the dialog
    private resultSubject = new Subject<boolean>();

    public constructor() { }

    /**
     * Opens a dialog with the given configuration.
     * Returns an Observable that emits true (accepted) or false (cancelled).
     */
    public open(config: DialogConfig): Observable<boolean> {
        // If a dialog is already open, close it (cancel) to ensure the previous subscription completes
        if (this.dialogComponentRef) {
            this.close(false);
        }

        this.resultSubject = new Subject<boolean>();

        // 1. Create the component
        this.dialogComponentRef = createComponent(DialogComponent, {
            environmentInjector: this.injector
        });

        // 2. Pass the configuration
        this.dialogComponentRef.instance.config = config;

        // 3. Listen to the close event (Output)
        this.dialogComponentRef.instance.closed.subscribe((result: boolean) => {
            this.close(result);
        });

        // 4. Attach to the application (so change detection works)
        this.appRef.attachView(this.dialogComponentRef.hostView);

        // 5. Append to the DOM (body)
        const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        return this.resultSubject.asObservable();
    }

    /**
     * Closes the dialog programmatically
     */
    public close(result: boolean = false): void {
        if (this.dialogComponentRef) {
            // Emit result
            this.resultSubject.next(result);
            this.resultSubject.complete();

            // Destroy component
            this.appRef.detachView(this.dialogComponentRef.hostView);
            this.dialogComponentRef.destroy();
            this.dialogComponentRef = null;
        }
    }

    // Convenience Methods

    public info(title: string, message: string): Observable<boolean> {
        return this.open({
            title,
            message,
            type: 'info',
            confirmText: 'OK',
            confirmColor: 'primary'
        });
    }

    public success(title: string, message: string): Observable<void> {
        return this.open({
            title,
            message,
            type: 'success',
            confirmText: 'OK',
            confirmColor: 'primary'
        }).pipe(map(() => undefined));
    }

    public warning(title: string, message: string): Observable<boolean> {
        return this.open({
            title,
            message,
            type: 'warning',
            confirmText: 'Understood',
            confirmColor: 'primary' // Yellow/Orange usually handled by CSS/Icon, but primary button is often okay
        });
    }

    public error(title: string, message: string): Observable<void> {
        return this.open({
            title,
            message,
            type: 'error',
            confirmText: 'Close',
            confirmColor: 'danger'
        }).pipe(map(() => undefined));
    }

    public confirm(title: string, message: string, confirmText: string = 'Yes', cancelText: string = 'Cancel'): Observable<boolean> {
        return this.open({
            title,
            message,
            type: 'confirm',
            confirmText,
            cancelText,
            confirmColor: 'primary',
            cancelColor: 'ghost'
        });
    }
}
