# Notes

## Getting Started

### Test Project

Todos App: https://github.com/laravel-streams/todos-app

- `git clone` to your machine
- `composer install` from the project dir
- `php artisan serve` from the project dir

Should be available: http://127.0.0.1:8000/

I am going to be using the above repo for the testing on my end.

### Documentation

Original Developer Documentation: https://laravel-streams.github.io/api-client/

My Usage Documentation: https://streams.dev/docs/api/client

Core documentation, Streams concept / object show here: https://streams.dev/docs/core/streams

## Installation

In general I like the manner of the installation. Simple NPM package.

### Intended Modeling

Criteria: https://github.com/laravel-streams/streams-core/blob/2.0/src/Criteria/Criteria.php

This is used like:

```
entries(string $stream); // Returns the streams query criteria class

$thompsons = entries('people')->where('name', 'LIKE', '% Thompson')->get();
$dads = entries('people')->where('name', 'LIKE', '% Thompson')->where('is_dad', true)->get();
```

Repository: https://github.com/laravel-streams/streams-core/blob/2.0/src/Repository/Repository.php

This is used like:

```

repository(string $stream); // Returns the streams entry repository

$entry = repository('people')->findAll($selectedIds);
```

I want to mirror this functionality as much as possible.

> In the PHP package the criteria and repositories are configurable.


### The Entry Model

It would be nice to have a proxy object for entries I think that's done here as well. Which in turn uses the stream configuration endpoint to save to and keeps tracks of it's attributes. 

This is a secondary priority at this point - but should tie in nicely with the supporting code for the interface in general.

## Priorities

In general, it doesn't work, lol. So starting there, trimming down unnecessary things that don't support the principle function of the utility.

The backend is intended like this: https://streams.dev/docs/api/endpoints

I have a simple project in the top of this doc that will serve up:

`http://127.0.0.1:8000/streams/todos/entries GET|POST|PUT|PATCH|DELETE`

Once we get a basic interaction with the API backend going I can help flesh out the rest of the logic. But the installation and build issues are blocking. Probably a little puffy from a deps standpoint. 

So:

1. Get it to work as a basic query interface for collections and single responses per docs (won't change much from there)
2. Lighten where possible and clean up code style if needed
3. Simplify the configuration and setup out of the box
4. Simplify the build and dev environment for working on it

I am online all the time just reach out if you have any questions or anything.

IF the code worked now - I could probably do something with it but I think it may need much more to help harden it for basic and most valuable functionality - API CRUD, essentially. We'll get into custom endpoints later but they too only return collections or entries in a standardized format so should not be hard to adapt to. And we could piggy back the same payload delivery (JSON BODY I think right now IIRC, which may not be appropriate for all request types, there's some accommodation in there for that) GET + JSON BODY params or something.