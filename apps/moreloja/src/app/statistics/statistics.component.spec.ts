import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { StatisticsService } from '@moreloja/services/statistics';
import StatisticsComponent from './statistics.component';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let mockStatisticsService: StatisticsService;

  const mockStatistics = {
    TotalSongs: 150,
    TotalPlays: 1250,
    TotalPlayTime: 7200, // 2 hours in seconds
    TotalArtists: 25,
    TotalAlbums: 30,
    AverageSongDuration: 180, // 3 minutes in seconds
  };

  const mockEmptyStatistics = {
    TotalSongs: undefined,
    TotalPlays: undefined,
    TotalPlayTime: undefined,
    TotalArtists: undefined,
    TotalAlbums: undefined,
    AverageSongDuration: undefined,
  };

  // Simple mock that provides just what the component needs
  const createMockHttpResourceRef = (data: any) =>
    ({
      value: signal(data),
      // Add minimal properties to satisfy the interface
      headers: signal(undefined),
      statusCode: signal(200),
      progress: signal(undefined),
      hasValue: signal(true),
      error: signal(undefined),
      isPending: signal(false),
      isSuccess: signal(true),
      isError: signal(false),
      isCanceled: signal(false),
      isStale: signal(false),
      refetch: vi.fn(),
      mutate: vi.fn(),
      cancel: vi.fn(),
      reset: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setPending: vi.fn(),
      setSuccess: vi.fn(),
      setCanceled: vi.fn(),
      setStale: vi.fn(),
      setHeaders: vi.fn(),
      setStatusCode: vi.fn(),
      setProgress: vi.fn(),
    }) as any;

  beforeEach(async () => {
    const statisticsServiceSpy = {
      getStatistics: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: StatisticsService, useValue: statisticsServiceSpy },
      ],
    }).compileComponents();

    mockStatisticsService = TestBed.inject(StatisticsService);
  });

  describe('with valid statistics data', () => {
    beforeEach(() => {
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(mockStatistics),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display total songs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Total Songs: 150');
    });

    it('should display total plays', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Total Plays: 1250');
    });

    it('should display total play time formatted', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Time spend listening: 02:00:00');
    });

    it('should display total artists', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Total Artists: 25');
    });

    it('should display total albums', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Total Albums: 30');
    });

    it('should display average song duration formatted', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Average song duration: 00:03:00');
    });

    it('should calculate and display average tracks per album correctly', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Average tracks per album: 5.00');
    });

    it('should have correct averageTracksPerAlbum computed property', () => {
      expect(component.averageTracksPerAlbum).toBe('5.00');
    });
  });

  describe('with empty/undefined statistics data', () => {
    beforeEach(() => {
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(mockEmptyStatistics),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display dashes for undefined values', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Total Songs: -');
      expect(compiled.textContent).toContain('Total Plays: -');
      expect(compiled.textContent).toContain('Total Artists: -');
      expect(compiled.textContent).toContain('Total Albums: -');
    });

    it('should display dash for undefined play time', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Time spend listening: -');
    });

    it('should display dash for undefined average song duration', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Average song duration: -');
    });

    it('should return dash for averageTracksPerAlbum when data is undefined', () => {
      expect(component.averageTracksPerAlbum).toBe('-');
    });
  });

  describe('averageTracksPerAlbum computed property', () => {
    it('should calculate correctly with valid numbers', () => {
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(mockStatistics),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;

      expect(component.averageTracksPerAlbum).toBe('5.00');
    });

    it('should return dash when TotalSongs is undefined', () => {
      const statsWithUndefinedSongs = {
        ...mockStatistics,
        TotalSongs: undefined,
      };
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(statsWithUndefinedSongs),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;

      expect(component.averageTracksPerAlbum).toBe('-');
    });

    it('should return dash when TotalAlbums is undefined', () => {
      const statsWithUndefinedAlbums = {
        ...mockStatistics,
        TotalAlbums: undefined,
      };
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(statsWithUndefinedAlbums),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;

      expect(component.averageTracksPerAlbum).toBe('-');
    });

    it('should handle division by zero gracefully', () => {
      const statsWithZeroAlbums = { ...mockStatistics, TotalAlbums: 0 };
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(statsWithZeroAlbums),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;

      expect(component.averageTracksPerAlbum).toBe('Infinity');
    });

    it('should format decimal places correctly', () => {
      const statsWithUnevenDivision = {
        ...mockStatistics,
        TotalSongs: 47,
        TotalAlbums: 10,
      };
      vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
        createMockHttpResourceRef(statsWithUnevenDivision),
      );
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;

      expect(component.averageTracksPerAlbum).toBe('4.70');
    });
  });

  it('should inject StatisticsService', () => {
    vi.mocked(mockStatisticsService.getStatistics).mockReturnValue(
      createMockHttpResourceRef(mockStatistics),
    );
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;

    expect(component.statisticsService).toBe(mockStatisticsService);
  });
});
