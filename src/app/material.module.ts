import { NgModule } from '@angular/core';

import {
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatGridListModule,
    MatSidenavModule,
    MatToolbarModule, 
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatRadioModule,
    MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
    imports: [
        MatInputModule,
        MatCardModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatListModule,
        MatGridListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatDialogModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatInputModule,
        MatCardModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatListModule,
        MatGridListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatDialogModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule { }