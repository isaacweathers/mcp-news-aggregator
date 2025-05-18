# Dockerfile
FROM python:3.12-slim

# Install build essentials and SQLite3
RUN apt-get update && apt-get install -y build-essential libsqlite3-dev wget

# Download and compile a newer version of SQLite
RUN wget https://www.sqlite.org/2023/sqlite-autoconf-3410200.tar.gz -O sqlite.tar.gz \
    && tar xzf sqlite.tar.gz \
    && cd sqlite-autoconf-3410200 \
    && ./configure \
    && make \
    && make install \
    && cd .. \
    && rm -rf sqlite-autoconf-3410200 sqlite.tar.gz \
    && ldconfig

WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy only files necessary for dependency installation
COPY pyproject.toml poetry.lock* README.md /app/

# Copy the rest of the application code
COPY src/ /app/src/

# Install dependencies
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["poetry", "run", "uvicorn", "src.mcp_server.main:app", "--host", "0.0.0.0", "--port", "8000"]
