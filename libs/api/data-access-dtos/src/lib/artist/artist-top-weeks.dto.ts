import { WeekDto } from './week.dto';

export class ArtistTopWeeksDto {
  constructor(
    public GoldWeeks: WeekDto[],
    public SilverWeeks: WeekDto[],
    public BronzeWeeks: WeekDto[],
  ) {}
}
