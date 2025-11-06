package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {

	store := NewDataStore()
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
	}))

	r.Route("/tasks", func(r chi.Router) {
		r.Get("/", store.getTasksHandler)
		r.Post("/", store.createTaskHandler)
		r.Route("/{id}", func(r chi.Router) {
			r.Put("/", store.updateTaskHandler)
			r.Delete("/", store.deleteTaskHandler)
		})
	})

	log.Println("Servidor iniciado na porta 8080")
	http.ListenAndServe(":8080", r)
}
