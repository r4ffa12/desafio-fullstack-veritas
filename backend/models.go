package main

import "sync"

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status"`
}

type DataStore struct {
	tasks  map[int]Task
	nextID int
	mu     sync.Mutex
}

func NewDataStore() *DataStore {
	return &DataStore{
		tasks:  make(map[int]Task),
		nextID: 1,
	}
}

func (s *DataStore) CreateTask(task Task) Task {
	s.mu.Lock()
	defer s.mu.Unlock()

	task.ID = s.nextID
	s.tasks[task.ID] = task
	s.nextID++
	return task
}

func (s *DataStore) GetTasks() []Task {
	s.mu.Lock()
	defer s.mu.Unlock()

	allTasks := make([]Task, 0, len(s.tasks))
	for _, task := range s.tasks {
		allTasks = append(allTasks, task)
	}
	return allTasks
}

func (s *DataStore) UpdateTask(id int, updatedTask Task) (Task, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, ok := s.tasks[id]
	if !ok {
		return Task{}, false
	}
	updatedTask.ID = id
	s.tasks[id] = updatedTask
	return updatedTask, true
}

func (s *DataStore) DeleteTask(id int) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, ok := s.tasks[id]
	if !ok {
		return false
	}
	delete(s.tasks, id)
	return true
}
