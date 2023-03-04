ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
include $(ROOT_DIR)/.mk-lib/common.mk
include .env
export

.EXPORT_ALL_VARIABLES:

.PHONY: help build start logs


build: ## Build s=<name> service
	@$(DC) build $(s)
	@notify-send "Build completed for $(s)"

start: ## Start all or s=<name> service in background
	@$(DC) up -d $(s)

logs: ## Show logs for all or c=<name> service
	@$(DC) logs --tail=100 --follow $(s)

stop: ## Start all or s=<name> service in background
	@$(DC) stop $(s)

migration-gen: #s=service n=<name> (migration name)
	@${DC} exec -e NAME=$(n) $(s) npm run migration:generate

migration: #s=service a=<action> (action=up|down)
	@${DC} exec $(s) npm run migration:$(a)
