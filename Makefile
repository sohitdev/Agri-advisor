.PHONY: test-backend test-ml test-frontend test-all up down health

test-backend:
	cd backend && npm run test

test-ml:
	cd ml-service && source venv_test/bin/activate && pytest

test-frontend:
	cd frontend && npx vitest run

test-all: test-backend test-ml test-frontend

up:
	docker-compose up -d --build

down:
	docker-compose down
