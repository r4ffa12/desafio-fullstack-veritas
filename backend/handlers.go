package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func (s *DataStore) getTasksHandler(w http.ResponseWriter, r *http.Request) {
	tasks := s.GetTasks()
	respondWithJSON(w, http.StatusOK, tasks)
}

func (s *DataStore) createTaskHandler(w http.ResponseWriter, r *http.Request) {
	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		respondWithError(w, http.StatusBadRequest, "Corpo da requisição inválido")
		return
	}

	if task.Title == "" {
		respondWithError(w, http.StatusBadRequest, "O título da tarefa é obrigatório")
		return
	}

	if task.Status == "" {
		task.Status = "A Fazer"
	}

	createdTask := s.CreateTask(task)
	respondWithJSON(w, http.StatusCreated, createdTask)
}

func (s *DataStore) updateTaskHandler(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID da tarefa inválido")
		return
	}

	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		respondWithError(w, http.StatusBadRequest, "Corpo da requisição inválido")
		return
	}

	if task.Title == "" {
		respondWithError(w, http.StatusBadRequest, "O título da tarefa é obrigatório")
		return
	}

	if task.Status != "A Fazer" && task.Status != "Em Progresso" && task.Status != "Concluídas" {
		respondWithError(w, http.StatusBadRequest, "Status da tarefa inválido")
		return
	}

	updatedTask, ok := s.UpdateTask(id, task)
	if !ok {
		respondWithError(w, http.StatusNotFound, "Tarefa não encontrada")
		return
	}
	respondWithJSON(w, http.StatusOK, updatedTask)

}

func (s *DataStore) deleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID da tarefa inválido")
		return
	}

	if ok := s.DeleteTask(id); !ok {
		respondWithError(w, http.StatusNotFound, "Tarefa não encontrada")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
