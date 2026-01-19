import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-voting',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './voting.html',
    styleUrl: './voting.scss',
})
export class VotingComponent { }
