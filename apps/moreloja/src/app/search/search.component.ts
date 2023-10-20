import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'moreloja-search',
  standalone: true,
  imports: [AsyncPipe, NgIf, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent implements OnInit {
  searchControl = new FormControl('', {
    nonNullable: true,
  });
  searchInput$!: Observable<string>;

  ngOnInit(): void {
    this.searchInput$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );
    
    // TODO
    //this.searchResult = this.searchInput$.pipe(
    //)
  }
}
