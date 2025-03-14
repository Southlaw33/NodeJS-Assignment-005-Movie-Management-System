type Movie = {
    id: number;
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    rating: number[];
}

class MovieDatabase {
    movies: Map<string, Movie> = new Map();
    
    addMovie(title: string, director: string, releaseYear: number, genre: string): string {
        const id = Math.floor(Math.random() * 1000);
        const movie: Movie = {
            id,
            title,
            director,
            releaseYear,
            genre,
            rating: []
        };
        const idStr = id.toString();
        this.movies.set(idStr, movie);
        console.log("Movie added successfully");
        return idStr;
    }

    rateMovie(id: string, rating: number): void {
        const movie = this.movies.get(id);
        if(movie) {
            movie.rating.push(rating); 
            this.movies.set(id, movie);
            console.log(`Movie: ${movie.title} has been rated ${rating}`);
        } else {
            console.log("Movie not found");
        }
    }

    getAverageRating(id: string): number | undefined {
        const movie = this.movies.get(id);
        if(!movie) {
            return undefined;
        }
        
        if(movie.rating.length === 0) {
            return 0;
        }
        
        const sum = movie.rating.reduce((total, rating) => total + rating, 0);
        return sum / movie.rating.length;
    }

    getMovie(id: string): Movie | null {
        return this.movies.get(id) || null;
    }

    removeMovie(id: string): void {
        if(this.movies.delete(id)) {
            console.log("Movie removed successfully");
        } else {
            console.log("Movie not found");
        }
    }
    
    getTopRatedMovies(): Movie[] {
        return Array.from(this.movies.values())
            .sort((a, b) => {
                const avgA = a.rating.length ? a.rating.reduce((sum, r) => sum + r, 0) / a.rating.length : 0;
                const avgB = b.rating.length ? b.rating.reduce((sum, r) => sum + r, 0) / b.rating.length : 0;
                return avgB - avgA; //sorting in the descending order
            });
    }

    getMoviesByGenre(genre: string): Movie[] {
        return Array.from(this.movies.values())
            .filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
    }

    getMoviesByDirector(director: string): Movie[] {
        return Array.from(this.movies.values())
            .filter(movie => movie.director.toLowerCase() === director.toLowerCase());
    }

    searchMoviesBasedOnKeyword(keyword: string): Movie[] {
        return Array.from(this.movies.values())
            .filter(movie => movie.title.toLowerCase().includes(keyword.toLowerCase()));
    }

    getAllMovies(): Movie[] {
        return Array.from(this.movies.values());
    }
}

export default MovieDatabase;