import { SongDto } from "./song.dto";

export class GetAllSongsResponseDto {
    constructor(
        public songs: SongDto[]
    ) {
    }
}
