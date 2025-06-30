import { Movie } from "../../../../models";
import { MovieService } from "../../../../services";

export const buildMovieConfig = (movieService: MovieService) => ({
  create: {
    service: (file: File, movie: Movie) => movieService.saveMovie(file, movie),
    successMessage: 'app.movie_created_success'
  },
  update: {
    service: (file: File, movie: Movie) => movieService.updateMovie(file, movie),
    successMessage: 'app.movie_updated_success'
  }
});
