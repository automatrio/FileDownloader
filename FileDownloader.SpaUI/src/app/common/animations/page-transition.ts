import { trigger, transition, style, animate } from "@angular/animations";

export const PAGE_TRANSITION = 
    trigger('fade', [
        transition(':enter', [
            style({ opacity: 0, filter: "blur(10px)" }),
            animate('500ms', style({ opacity: 1, filter: "blur(0px)" })),
        ]),
        transition(':leave',
            [animate('500ms', style({ opacity: 0 }))
        ]),
    ]);