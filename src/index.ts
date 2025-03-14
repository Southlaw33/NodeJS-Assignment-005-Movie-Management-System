import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import MovieDatabase from './movies';


const app = new Hono();
const movieDB = new MovieDatabase();

//adding a movie
app.post('/movies', async (c) => {
  const body = await c.req.json();
  const { title, director, releaseYear, genre } = body;
  
  if (!title || !director || !releaseYear || !genre) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  
  const id = movieDB.addMovie(title, director, releaseYear, genre);
  return c.json({ message: 'Movie added successfully', id }, 201);
});

//updating a movie from its id
app.patch('/movies/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const movie = movieDB.getMovie(id);
  
  if (!movie) {
    return c.json({ error: 'Movie not found' }, 404);
  }
  
  Object.assign(movie, body);
  return c.json({ message: 'Movie updated successfully', movie });
});

//getting a movie from its id
app.get('/movies/:id', (c) => {
  const id = c.req.param('id');
  const movie = movieDB.getMovie(id);
  
  if (!movie) {
    return c.json({ error: 'Movie not found' }, 404);
  }
  
  return c.json(movie);
});


//deleting a movie from its id
app.delete('/movies/:id', (c) => {
  const id = c.req.param('id');
  movieDB.removeMovie(id);
  return c.json({ message: 'Movie removed successfully' });
});

//adding a rating to a movie
app.post('/movies/:id/rating', async (c) => {
  const id = c.req.param('id');
  const { rating } = await c.req.json();
  
  if (rating < 1 || rating > 5) {
    return c.json({ error: 'Rating must be between 1 and 5' }, 400);
  }
  
  movieDB.rateMovie(id, rating);
  return c.json({ message: 'Movie rated successfully' });
});

//getting the average rating of a movie
app.get('/movies/:id/rating', (c) => {
  const id = c.req.param('id');
  const avgRating = movieDB.getAverageRating(id);
  
  if (avgRating === undefined) {
    return c.json({ error: 'Movie not found' }, 404);
  }
  
  return c.json({ averageRating: avgRating });
});

//getting the top rated movies
app.get('/movies/top-rated', (c) => {
  const movies = movieDB.getTopRatedMovies();
  return c.json(movies.length ? movies : { error: 'No movies found' }, movies.length ? 200 : 404);
});

//getting movies by genre
app.get('/movies/genre/:genre', (c) => {
  const genre = c.req.param('genre');
  const movies = movieDB.getMoviesByGenre(genre);
  return c.json(movies.length ? movies : { error: 'No movies found for this genre' }, movies.length ? 200 : 404);
});

//getting movies by director
app.get('/movies/director/:director', (c) => {
  const director = c.req.param('director');
  const movies = movieDB.getMoviesByDirector(director);
  return c.json(movies.length ? movies : { error: 'No movies found by this director' }, movies.length ? 200 : 404);
});

//searching for movies based on a keyword
app.get('/movies/search', (c) => {
  const keyword = c.req.query('keyword');
  if (!keyword) {
    return c.json({ error: 'Keyword is required' }, 400);
  }
  const movies = movieDB.searchMoviesBasedOnKeyword(keyword);
  return c.json(movies.length ? movies : { error: 'No movies match the search keyword' }, movies.length ? 200 : 404);
});


serve(app);
console.log("Server running!!");


