docker compose -f compose.yaml -f compose.devtest.yaml --project-name digonto-devtest build --build-arg NPM_TOKEN=$NPM_TOKEN && \
docker compose -f compose.yaml -f compose.devtest.yaml --project-name digonto-devtest up --exit-code-from gateway 