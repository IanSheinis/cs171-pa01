# Makefile

# Default values
d ?= 10
epsilon_max ?= 0.1
rho ?= 1e-6

run_project:
	ts-node Time_Server.ts & ts-node NW.ts & sleep 2 && ts-node Client.ts --d $(d) --epsilon_max $(epsilon_max) --rho $(rho)

clean:
	rm -f output.csv